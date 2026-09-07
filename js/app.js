/**
 * app.js - Controller Utama KalenderKita
 * Menghubungkan state aplikasi, event listener, live preview, dan antarmuka manajemen libur.
 */

import { MONTH_NAMES, getOrderedDayNames } from './calendar.js';
import {
  getAllHolidaysForYear,
  getHolidaysForMonth,
  addCustomHoliday,
  deleteHolidayById,
  resetHolidaysForYear
} from './holidays.js';
import { THEME_PRESETS, FONT_FAMILIES } from './themes.js';
import {
  generateCalendarSVG,
  downloadCalendarPNG,
  downloadCalendarSVG,
  downloadBatchCalendarZIP
} from './render.js';

// State Aplikasi Default
const state = {
  year: 2027,
  month: 0, // 0 = Januari
  startDayOfWeek: 0, // 0 = Minggu, 1 = Senin
  language: 'id',
  dayFormat: 'short',
  toggles: {
    showMonthTitle: true,
    showDayNames: true,
    showDateGrid: true,
    showHolidayList: true,
    showAdjacentDays: false,
    showGridLines: false
  },
  theme: {
    preset: 'minimalist',
    fontFamily: 'Poppins',
    fontCss: "'Poppins', sans-serif",
    weekdayColor: '#1e293b',
    sundayColor: '#dc2626',
    saturdayColor: '#64748b',
    holidayColor: '#dc2626',
    headerColor: '#0f172a',
    backgroundColor: 'transparent',
    gridLineColor: '#e2e8f0',
    adjacentColor: '#cbd5e1'
  }
};

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  initDOM();
  bindEvents();
  renderMonthTabs();
  updateLivePreview();
});

/**
 * Inisialisasi nilai awal di elemen antarmuka
 */
function initDOM() {
  const yearInput = document.getElementById('yearInput');
  if (yearInput) yearInput.value = state.year;

  // Isi dropdown font
  const fontSelect = document.getElementById('fontFamilySelect');
  if (fontSelect) {
    fontSelect.innerHTML = FONT_FAMILIES.map(f => `
      <option value="${f.id}" ${f.id === state.theme.fontFamily ? 'selected' : ''}>
        ${f.name}
      </option>
    `).join('');
  }

  // Sinkronkan color pickers dengan tema awal
  syncFormWithTheme(state.theme);
}

/**
 * Sinkronkan nilai input warna dengan objek tema
 * @param {Object} theme
 */
function syncFormWithTheme(theme) {
  setInputValue('colorWeekday', theme.weekdayColor);
  setInputValue('colorSunday', theme.sundayColor);
  setInputValue('colorSaturday', theme.saturdayColor);
  setInputValue('colorHoliday', theme.holidayColor);
  setInputValue('colorHeader', theme.headerColor);

  const bgTransparentCheckbox = document.getElementById('bgTransparentCheckbox');
  const bgColorInput = document.getElementById('colorBackground');
  if (bgTransparentCheckbox && bgColorInput) {
    if (theme.backgroundColor === 'transparent') {
      bgTransparentCheckbox.checked = true;
      bgColorInput.disabled = true;
    } else {
      bgTransparentCheckbox.checked = false;
      bgColorInput.disabled = false;
      bgColorInput.value = theme.backgroundColor;
    }
  }
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

/**
 * Render Tab 12 Bulan (Januari s/d Desember)
 */
function renderMonthTabs() {
  const container = document.getElementById('monthTabsContainer');
  if (!container) return;

  const months = MONTH_NAMES[state.language] || MONTH_NAMES.id;
  container.innerHTML = months.map((name, idx) => {
    const isActive = idx === state.month;
    return `
      <button type="button" class="month-tab ${isActive ? 'active' : ''}" data-month="${idx}">
        ${name.substring(0, 3)}
      </button>
    `;
  }).join('');

  // Update indikator bulan aktif pada sub-header
  const label = document.getElementById('activeMonthLabel');
  if (label) {
    label.textContent = `${months[state.month]} ${state.year}`;
  }
}

/**
 * Render Live Preview Kalender SVG
 */
function updateLivePreview() {
  const previewContainer = document.getElementById('calendarSvgWrapper');
  if (!previewContainer) return;

  const svgString = generateCalendarSVG(state);
  previewContainer.innerHTML = svgString;

  // Update label bulan aktif
  const months = MONTH_NAMES[state.language] || MONTH_NAMES.id;
  const label = document.getElementById('activeMonthLabel');
  if (label) {
    label.textContent = `${months[state.month]} ${state.year}`;
  }

  // Update info ringkas hari libur di sidebar
  renderSidebarHolidaySnippet();
}

/**
 * Render ringkasan hari libur bulan aktif di panel kontrol
 */
function renderSidebarHolidaySnippet() {
  const listEl = document.getElementById('sidebarHolidayList');
  if (!listEl) return;

  const holidays = getHolidaysForMonth(state.year, state.month);
  if (holidays.length === 0) {
    listEl.innerHTML = `<li class="empty-holiday">Tidak ada tanggal merah libur nasional di bulan ini.</li>`;
    return;
  }

  listEl.innerHTML = holidays.map(h => {
    const day = parseInt(h.date.split('-')[2], 10);
    return `
      <li class="holiday-pill">
        <span class="pill-date">${day}</span>
        <span class="pill-name">${escapeHtml(h.name)}</span>
        ${h.isCustom ? '<span class="pill-badge-custom">Kustom</span>' : ''}
      </li>
    `;
  }).join('');
}

/**
 * Event binding untuk seluruh interaksi pengguna
 */
function bindEvents() {
  // 1. Tahun & Navigasi
  const yearInput = document.getElementById('yearInput');
  if (yearInput) {
    yearInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val >= 1900 && val <= 2100) {
        state.year = val;
        updateLivePreview();
      }
    });
  }

  document.getElementById('btnYearMinus')?.addEventListener('click', () => {
    state.year -= 1;
    if (yearInput) yearInput.value = state.year;
    updateLivePreview();
  });

  document.getElementById('btnYearPlus')?.addEventListener('click', () => {
    state.year += 1;
    if (yearInput) yearInput.value = state.year;
    updateLivePreview();
  });

  // 2. Month Tabs & Prev/Next
  document.getElementById('monthTabsContainer')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.month-tab');
    if (!btn) return;
    const m = parseInt(btn.dataset.month, 10);
    state.month = m;
    renderMonthTabs();
    updateLivePreview();
  });

  document.getElementById('btnPrevMonth')?.addEventListener('click', () => {
    if (state.month === 0) {
      state.month = 11;
      state.year -= 1;
      if (yearInput) yearInput.value = state.year;
    } else {
      state.month -= 1;
    }
    renderMonthTabs();
    updateLivePreview();
  });

  document.getElementById('btnNextMonth')?.addEventListener('click', () => {
    if (state.month === 11) {
      state.month = 0;
      state.year += 1;
      if (yearInput) yearInput.value = state.year;
    } else {
      state.month += 1;
    }
    renderMonthTabs();
    updateLivePreview();
  });

  // 3. Pengaturan Kalender (Awal Minggu, Bahasa, Format Hari)
  document.querySelectorAll('input[name="startDayOfWeek"]').forEach(r => {
    r.addEventListener('change', (e) => {
      state.startDayOfWeek = parseInt(e.target.value, 10);
      updateLivePreview();
    });
  });

  document.getElementById('selectLanguage')?.addEventListener('change', (e) => {
    state.language = e.target.value;
    renderMonthTabs();
    updateLivePreview();
  });

  document.getElementById('selectDayFormat')?.addEventListener('change', (e) => {
    state.dayFormat = e.target.value;
    updateLivePreview();
  });

  // 4. Toggles
  const bindToggle = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', (e) => {
      state.toggles[key] = e.target.checked;
      updateLivePreview();
    });
  };

  bindToggle('toggleMonthTitle', 'showMonthTitle');
  bindToggle('toggleDayNames', 'showDayNames');
  bindToggle('toggleDateGrid', 'showDateGrid');
  bindToggle('toggleHolidayList', 'showHolidayList');
  bindToggle('toggleAdjacentDays', 'showAdjacentDays');
  bindToggle('toggleGridLines', 'showGridLines');

  // 5. Tema & Preset
  document.getElementById('themePresetSelect')?.addEventListener('change', (e) => {
    const presetKey = e.target.value;
    if (THEME_PRESETS[presetKey]) {
      const p = THEME_PRESETS[presetKey];
      state.theme = {
        ...state.theme,
        preset: presetKey,
        weekdayColor: p.weekdayColor,
        sundayColor: p.sundayColor,
        saturdayColor: p.saturdayColor,
        holidayColor: p.holidayColor,
        headerColor: p.headerColor,
        backgroundColor: p.backgroundColor,
        gridLineColor: p.gridLineColor,
        adjacentColor: p.adjacentColor
      };
      syncFormWithTheme(state.theme);
      updateLivePreview();
    }
  });

  // 6. Font Family
  document.getElementById('fontFamilySelect')?.addEventListener('change', (e) => {
    const fontId = e.target.value;
    const fontObj = FONT_FAMILIES.find(f => f.id === fontId);
    if (fontObj) {
      state.theme.fontFamily = fontObj.id;
      state.theme.fontCss = fontObj.css;
      updateLivePreview();
    }
  });

  // 7. Color Pickers
  const bindColor = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      state.theme[key] = e.target.value;
      updateLivePreview();
    });
  };

  bindColor('colorWeekday', 'weekdayColor');
  bindColor('colorSunday', 'sundayColor');
  bindColor('colorSaturday', 'saturdayColor');
  bindColor('colorHoliday', 'holidayColor');
  bindColor('colorHeader', 'headerColor');
  bindColor('colorBackground', 'backgroundColor');

  // Checkbox Background Transparan
  const bgTransparentCheckbox = document.getElementById('bgTransparentCheckbox');
  const bgColorInput = document.getElementById('colorBackground');
  if (bgTransparentCheckbox && bgColorInput) {
    bgTransparentCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.theme.backgroundColor = 'transparent';
        bgColorInput.disabled = true;
      } else {
        state.theme.backgroundColor = bgColorInput.value || '#ffffff';
        bgColorInput.disabled = false;
      }
      updateLivePreview();
    });
  }

  // 8. Download Actions
  document.getElementById('btnDownloadPNG')?.addEventListener('click', async () => {
    const btn = document.getElementById('btnDownloadPNG');
    const monthNum = String(state.month + 1).padStart(2, '0');
    const monthName = (MONTH_NAMES[state.language] || MONTH_NAMES.id)[state.month].toLowerCase();
    const filename = `kalender-${state.year}-${monthNum}-${monthName}.png`;

    try {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Memproses PNG 300 DPI...`;
      await downloadCalendarPNG(state, filename);
      showToast(`Berhasil mengunduh ${filename}`);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh gambar PNG: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download PNG Transparan
      `;
    }
  });

  document.getElementById('btnDownloadSVG')?.addEventListener('click', () => {
    const monthNum = String(state.month + 1).padStart(2, '0');
    const monthName = (MONTH_NAMES[state.language] || MONTH_NAMES.id)[state.month].toLowerCase();
    const filename = `kalender-${state.year}-${monthNum}-${monthName}.svg`;

    downloadCalendarSVG(state, filename);
    showToast(`Berhasil mengunduh ${filename}`);
  });

  // Toggle Dropdown ZIP
  const btnZipToggle = document.getElementById('btnDownloadZipToggle');
  const menuZip = document.getElementById('dropdownZipMenu');
  btnZipToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    menuZip?.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-zip')) {
      menuZip?.classList.remove('show');
    }
  });

  // Batch Download (ZIP)
  document.getElementById('btnDownloadZipPNG')?.addEventListener('click', async () => {
    menuZip?.classList.remove('show');
    await handleBatchZip('png');
  });

  document.getElementById('btnDownloadZipSVG')?.addEventListener('click', async () => {
    menuZip?.classList.remove('show');
    await handleBatchZip('svg');
  });

  // 9. Modal Kelola Hari Libur
  bindHolidayModalEvents();
}

/**
 * Eksekusi Batch Download ZIP (PNG/SVG)
 */
async function handleBatchZip(format) {
  const modalProgress = document.getElementById('zipProgressModal');
  const progressText = document.getElementById('zipProgressText');
  const progressBar = document.getElementById('zipProgressBar');

  if (modalProgress) modalProgress.classList.add('show');

  try {
    await downloadBatchCalendarZIP(state, format, (current, total) => {
      const pct = Math.round((current / total) * 100);
      if (progressText) progressText.textContent = `Merender bulan ${current} dari ${total}... (${pct}%)`;
      if (progressBar) progressBar.style.width = `${pct}%`;
    });
    showToast(`12 Bulan Kalender (${format.toUpperCase()}) berhasil diunduh dalam file ZIP!`);
  } catch (err) {
    console.error(err);
    alert('Gagal mendownload ZIP: ' + err.message);
  } finally {
    if (modalProgress) modalProgress.classList.remove('show');
  }
}

/**
 * Event binding untuk Modal Kelola Hari Libur
 */
function bindHolidayModalEvents() {
  const modal = document.getElementById('holidayManagerModal');
  const btnOpen = document.getElementById('btnOpenHolidayModal');
  const btnClose = document.getElementById('btnCloseHolidayModal');
  const formAdd = document.getElementById('formAddHoliday');
  const btnReset = document.getElementById('btnResetHolidays');

  btnOpen?.addEventListener('click', () => {
    renderHolidayModalList();
    // Set default tanggal form ke tahun aktif
    const dateInput = document.getElementById('inputHolidayDate');
    if (dateInput) {
      const monthStr = String(state.month + 1).padStart(2, '0');
      dateInput.value = `${state.year}-${monthStr}-01`;
    }
    modal.classList.add('show');
  });

  btnClose?.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Klik di luar konten modal untuk menutup
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  // Form Tambah Libur
  formAdd?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateInput = document.getElementById('inputHolidayDate');
    const nameInput = document.getElementById('inputHolidayName');

    if (!dateInput.value || !nameInput.value.trim()) {
      alert('Harap lengkapi tanggal dan nama libur.');
      return;
    }

    addCustomHoliday(dateInput.value, nameInput.value);
    nameInput.value = '';
    renderHolidayModalList();
    updateLivePreview();
    showToast('Tanggal merah berhasil ditambahkan!');
  });

  // Tombol Reset ke Bawaan
  btnReset?.addEventListener('click', () => {
    if (confirm(`Kembalikan seluruh daftar libur nasional tahun ${state.year} ke data default?`)) {
      resetHolidaysForYear(state.year);
      renderHolidayModalList();
      updateLivePreview();
      showToast('Hari libur berhasil di-reset ke bawaan.');
    }
  });

  // Handler Hapus Item di Modal
  document.getElementById('holidayModalListContainer')?.addEventListener('click', (e) => {
    const btnDel = e.target.closest('.btn-delete-holiday');
    if (!btnDel) return;
    const id = btnDel.dataset.id;
    deleteHolidayById(id);
    renderHolidayModalList();
    updateLivePreview();
    showToast('Hari libur berhasil dihapus.');
  });
}

/**
 * Render isi daftar libur di dalam modal
 */
function renderHolidayModalList() {
  const container = document.getElementById('holidayModalListContainer');
  const modalYearTitle = document.getElementById('modalHolidayYearTitle');
  if (modalYearTitle) modalYearTitle.textContent = state.year;
  if (!container) return;

  const holidays = getAllHolidaysForYear(state.year);
  if (holidays.length === 0) {
    container.innerHTML = `<div class="empty-state">Belum ada hari libur terdaftar untuk tahun ${state.year}.</div>`;
    return;
  }

  container.innerHTML = holidays.map(h => {
    return `
      <div class="holiday-manage-row">
        <div class="row-info">
          <span class="row-date">${h.date}</span>
          <span class="row-name">${escapeHtml(h.name)}</span>
          ${h.isCustom ? '<span class="badge badge-custom">Kustom</span>' : '<span class="badge badge-default">Bawaan</span>'}
        </div>
        <button type="button" class="btn-delete-holiday" data-id="${h.id}" title="Hapus atau sembunyikan libur ini">
          &times;
        </button>
      </div>
    `;
  }).join('');
}

/**
 * Tampilkan notifikasi Toast
 */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3500);
}

function escapeHtml(str) {
  return (str || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&#39;';
      case '"': return '&quot;';
    }
  });
}
