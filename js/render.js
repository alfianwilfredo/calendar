/**
 * render.js - SVG Builder, High-Resolution Canvas Exporter & Batch ZIP Downloader
 * Menghasilkan output kalender siap-pakai untuk Canva dalam format PNG Transparan 300 DPI dan SVG.
 */

import { MONTH_NAMES, getOrderedDayNames, generateMonthGrid } from './calendar.js';
import { getHolidaysForMonth, checkHoliday } from './holidays.js';

/**
 * Menghasilkan string SVG kalender yang terstruktur dan scalable
 * @param {Object} config
 * @returns {string} SVG String
 */
export function generateCalendarSVG(config) {
  const {
    year,
    month,
    startDayOfWeek = 0,
    language = 'id',
    dayFormat = 'short',
    toggles = {},
    theme = {}
  } = config;

  const fontCss = theme.fontCss || `'Poppins', sans-serif`;
  const fontFamilyName = theme.fontFamily || 'Poppins';

  // Periksa elemen apa saja yang aktif
  const showMonthTitle = toggles.showMonthTitle ?? true;
  const showDayNames = toggles.showDayNames ?? true;
  const showDateGrid = toggles.showDateGrid ?? true;
  const showHolidayList = toggles.showHolidayList ?? true;
  const showAdjacentDays = toggles.showAdjacentDays ?? false;
  const showGridLines = toggles.showGridLines ?? false;

  // Dimensi SVG
  const width = 1000;
  
  // Hitung perkiraan tinggi dinamis
  let currentY = 50;
  let titleY = 0;
  if (showMonthTitle) {
    titleY = currentY + 50;
    currentY += 110;
  }

  let dayRowY = 0;
  if (showDayNames) {
    dayRowY = currentY + 30;
    currentY += 60;
  }

  const gridStartY = currentY;
  const weeks = generateMonthGrid(year, month, startDayOfWeek);
  const rowCount = weeks.length;
  const cellWidth = (width - 100) / 7;
  const cellHeight = 85;
  const gridHeight = showDateGrid ? (rowCount * cellHeight) : 0;
  currentY += gridHeight + 30;

  // Daftar hari libur bulan ini
  const monthHolidays = getHolidaysForMonth(year, month);
  let holidayStartY = currentY;
  const holidayItemHeight = 32;
  const holidayListHeight = (showHolidayList && monthHolidays.length > 0) 
    ? (monthHolidays.length * holidayItemHeight + 40) 
    : 0;

  currentY += holidayListHeight + 30;
  const totalHeight = Math.max(currentY, 600);

  // SVG Elements
  let svgParts = [];

  // 1. Header XML & Defs / Styles
  svgParts.push(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${totalHeight}" width="${width}" height="${totalHeight}">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamilyName)}:wght@400;500;600;700;800&amp;display=swap');
          text {
            font-family: ${fontCss};
            user-select: none;
          }
          .month-title {
            font-size: 46px;
            font-weight: 800;
            fill: ${theme.headerColor || '#0f172a'};
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .day-name {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .date-num {
            font-size: 30px;
            font-weight: 600;
          }
          .date-adjacent {
            font-size: 26px;
            font-weight: 400;
            fill: ${theme.adjacentColor || '#cbd5e1'};
            opacity: 0.6;
          }
          .holiday-dot {
            fill: ${theme.holidayColor || '#dc2626'};
          }
          .holiday-text {
            font-size: 18px;
            font-weight: 500;
            fill: ${theme.weekdayColor || '#334155'};
          }
          .holiday-badge {
            font-size: 16px;
            font-weight: 700;
            fill: ${theme.holidayColor || '#dc2626'};
          }
          .grid-line {
            stroke: ${theme.gridLineColor || '#e2e8f0'};
            stroke-width: 1.5;
            stroke-dasharray: none;
          }
        </style>
      </defs>
  `);

  // 2. Background (jika bukan transparan)
  if (theme.backgroundColor && theme.backgroundColor !== 'transparent') {
    svgParts.push(`<rect width="100%" height="100%" fill="${theme.backgroundColor}" rx="24"/>`);
  }

  // 3. Judul Bulan & Tahun
  if (showMonthTitle) {
    const monthName = MONTH_NAMES[language]?.[month] || MONTH_NAMES.id[month];
    svgParts.push(`
      <text x="${width / 2}" y="${titleY}" text-anchor="middle" class="month-title">
        ${monthName} <tspan font-weight="400" fill="${theme.holidayColor || '#dc2626'}">${year}</tspan>
      </text>
    `);
  }

  // 4. Baris Nama Hari
  const orderedDays = getOrderedDayNames(language, dayFormat, startDayOfWeek);
  if (showDayNames) {
    // Garis pemisah di bawah nama hari jika grid lines aktif
    if (showGridLines) {
      svgParts.push(`<line x1="50" y1="${dayRowY + 15}" x2="${width - 50}" y2="${dayRowY + 15}" class="grid-line" stroke-width="2"/>`);
    }

    orderedDays.forEach((dayText, colIdx) => {
      const x = 50 + colIdx * cellWidth + (cellWidth / 2);
      // Tentukan hari asli (0 = Minggu, 6 = Sabtu)
      const actualDayOfWeek = (startDayOfWeek === 1) ? (colIdx === 6 ? 0 : colIdx + 1) : colIdx;
      
      let fill = theme.weekdayColor || '#1e293b';
      if (actualDayOfWeek === 0) fill = theme.sundayColor || '#dc2626';
      else if (actualDayOfWeek === 6) fill = theme.saturdayColor || '#64748b';

      svgParts.push(`
        <text x="${x}" y="${dayRowY}" text-anchor="middle" fill="${fill}" class="day-name">
          ${dayText}
        </text>
      `);
    });
  }

  // 5. Grid Angka Tanggal
  if (showDateGrid) {
    // Render garis pembatas horizontal antar baris jika aktif
    if (showGridLines) {
      for (let r = 0; r <= rowCount; r++) {
        const y = gridStartY + r * cellHeight;
        svgParts.push(`<line x1="50" y1="${y}" x2="${width - 50}" y2="${y}" class="grid-line"/>`);
      }
      for (let c = 0; c <= 7; c++) {
        const x = 50 + c * cellWidth;
        svgParts.push(`<line x1="${x}" y1="${gridStartY}" x2="${x}" y2="${gridStartY + rowCount * cellHeight}" class="grid-line"/>`);
      }
    }

    weeks.forEach((week, rowIdx) => {
      week.forEach((cell, colIdx) => {
        const centerX = 50 + colIdx * cellWidth + (cellWidth / 2);
        const centerY = gridStartY + rowIdx * cellHeight + (cellHeight / 2) + 8;

        if (!cell.isCurrentMonth) {
          if (showAdjacentDays) {
            svgParts.push(`
              <text x="${centerX}" y="${centerY}" text-anchor="middle" class="date-adjacent">
                ${cell.day}
              </text>
            `);
          }
          return;
        }

        // Cek hari libur nasional
        const holidayInfo = checkHoliday(cell.dateKey, year);
        const isHoliday = holidayInfo.isHoliday;
        const isSunday = cell.dayOfWeek === 0;
        const isSaturday = cell.dayOfWeek === 6;

        let numColor = theme.weekdayColor || '#1e293b';
        if (isHoliday || isSunday) {
          numColor = theme.holidayColor || theme.sundayColor || '#dc2626';
        } else if (isSaturday) {
          numColor = theme.saturdayColor || '#64748b';
        }

        // Teks nomor tanggal
        svgParts.push(`
          <text x="${centerX}" y="${centerY}" text-anchor="middle" fill="${numColor}" class="date-num">
            ${cell.day}
          </text>
        `);

        // Titik penanda libur nasional di bawah angka
        if (isHoliday) {
          const dotY = centerY + 16;
          svgParts.push(`
            <circle cx="${centerX}" cy="${dotY}" r="3.5" class="holiday-dot"/>
          `);
        }
      });
    });
  }

  // 6. Keterangan Tanggal Merah (Holiday Legend)
  if (showHolidayList && monthHolidays.length > 0) {
    const legendStartY = holidayStartY + 10;
    
    // Garis aksen tipis sebelum keterangan libur
    svgParts.push(`
      <line x1="60" y1="${legendStartY - 15}" x2="${width - 60}" y2="${legendStartY - 15}" stroke="${theme.gridLineColor || '#e2e8f0'}" stroke-width="1.5" stroke-dasharray="4 4"/>
    `);

    monthHolidays.forEach((h, index) => {
      const itemY = legendStartY + (index * holidayItemHeight) + 15;
      const dayNumber = parseInt(h.date.split('-')[2], 10);
      const monthName = MONTH_NAMES[language]?.[month] || MONTH_NAMES.id[month];

      svgParts.push(`
        <g transform="translate(60, ${itemY})">
          <circle cx="8" cy="-5" r="4.5" fill="${theme.holidayColor || '#dc2626'}"/>
          <text x="22" y="0" class="holiday-badge">
            ${dayNumber} ${monthName}:
          </text>
          <text x="160" y="0" class="holiday-text">
            ${escapeXml(h.name)}
          </text>
        </g>
      `);
    });
  }

  svgParts.push('</svg>');
  return svgParts.join('\n');
}

/**
 * Escape karakter spesial XML/SVG
 * @param {string} unsafe
 * @returns {string}
 */
function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

/**
 * Render string SVG ke Canvas beresolusi tinggi (setara 300 DPI)
 * @param {string} svgString
 * @param {number} scaleFactor - default 3x (menghasilkan resolusi ~3000px)
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderSVGToCanvas(svgString, scaleFactor = 3) {
  // Pastikan font browser sudah dimuat
  if (document.fonts) {
    await document.fonts.ready;
  }

  return new Promise((resolve, reject) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElem = doc.documentElement;
    const width = parseFloat(svgElem.getAttribute('width')) || 1000;
    const height = parseFloat(svgElem.getAttribute('height')) || 1000;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scaleFactor);
    canvas.height = Math.round(height * scaleFactor);
    const ctx = canvas.getContext('2d');

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(blobURL);
      resolve(canvas);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(blobURL);
      reject(err);
    };

    img.src = blobURL;
  });
}

/**
 * Trigger download file dari Blob
 * @param {Blob} blob
 * @param {string} filename
 */
export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download Kalender Bulan Aktif dalam format PNG Transparan (High Res)
 * @param {Object} config
 * @param {string} filename
 * @returns {Promise<void>}
 */
export async function downloadCalendarPNG(config, filename) {
  const svgString = generateCalendarSVG(config);
  const canvas = await renderSVGToCanvas(svgString, 3);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      triggerBlobDownload(blob, filename);
      resolve();
    }, 'image/png');
  });
}

/**
 * Download Kalender Bulan Aktif dalam format SVG Vektor
 * @param {Object} config
 * @param {string} filename
 */
export function downloadCalendarSVG(config, filename) {
  const svgString = generateCalendarSVG(config);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  triggerBlobDownload(blob, filename);
}

/**
 * Batch Download 12 Bulan dalam 1 file ZIP
 * @param {Object} config - base config
 * @param {'png'|'svg'} format
 * @param {Function} onProgress - callback (currentMonth, totalMonths)
 * @returns {Promise<void>}
 */
export async function downloadBatchCalendarZIP(config, format = 'png', onProgress = null) {
  if (typeof JSZip === 'undefined') {
    throw new Error('JSZip belum dimuat. Pastikan koneksi internet tersedia.');
  }

  const zip = new JSZip();
  const folderName = `kalender-${config.year}-${format}`;
  const folder = zip.folder(folderName);

  for (let m = 0; m < 12; m++) {
    if (onProgress) onProgress(m + 1, 12);

    const monthConfig = { ...config, month: m };
    const monthNum = String(m + 1).padStart(2, '0');
    const monthName = MONTH_NAMES.id[m].toLowerCase();
    const baseName = `kalender-${config.year}-${monthNum}-${monthName}`;

    const svgString = generateCalendarSVG(monthConfig);

    if (format === 'svg') {
      folder.file(`${baseName}.svg`, svgString);
    } else {
      const canvas = await renderSVGToCanvas(svgString, 3);
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      folder.file(`${baseName}.png`, blob);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(zipBlob, `kalender-${config.year}-${format}.zip`);
}
