/**
 * holidays.js - Manajemen Hari Libur Nasional Indonesia & Custom Storage
 * Menyediakan data resmi/perkiraan libur nasional untuk tahun 2024-2030+,
 * serta fungsi tambah/edit/hapus manual yang disimpan di localStorage.
 */

// Dataset Hari Libur Nasional (Resmi & Perkiraan Astronomi)
const DEFAULT_HOLIDAYS = {
  2024: [
    { date: '2024-01-01', name: 'Tahun Baru 2024 Masehi' },
    { date: '2024-02-08', name: 'Isra Mikraj Nabi Muhammad SAW' },
    { date: '2024-02-10', name: 'Tahun Baru Imlek 2575 Kongzili' },
    { date: '2024-03-11', name: 'Hari Suci Nyepi Tahun Baru Saka 1946' },
    { date: '2024-03-29', name: 'Wafat Yesus Kristus' },
    { date: '2024-03-31', name: 'Hari Paskah' },
    { date: '2024-04-10', name: 'Hari Raya Idul Fitri 1445 H' },
    { date: '2024-04-11', name: 'Hari Raya Idul Fitri 1445 H' },
    { date: '2024-05-01', name: 'Hari Buruh Internasional' },
    { date: '2024-05-09', name: 'Kenaikan Yesus Kristus' },
    { date: '2024-05-23', name: 'Hari Raya Waisak 2568 BE' },
    { date: '2024-06-01', name: 'Hari Lahir Pancasila' },
    { date: '2024-06-17', name: 'Hari Raya Idul Adha 1445 H' },
    { date: '2024-07-07', name: 'Tahun Baru Islam 1446 H' },
    { date: '2024-08-17', name: 'Hari Kemerdekaan RI' },
    { date: '2024-09-16', name: 'Maulid Nabi Muhammad SAW' },
    { date: '2024-12-25', name: 'Hari Raya Natal' }
  ],
  2025: [
    { date: '2025-01-01', name: 'Tahun Baru 2025 Masehi' },
    { date: '2025-01-27', name: 'Isra Mikraj Nabi Muhammad SAW' },
    { date: '2025-01-29', name: 'Tahun Baru Imlek 2576 Kongzili' },
    { date: '2025-03-29', name: 'Hari Suci Nyepi Saka 1947' },
    { date: '2025-03-31', name: 'Hari Raya Idul Fitri 1446 H' },
    { date: '2025-04-01', name: 'Hari Raya Idul Fitri 1446 H' },
    { date: '2025-04-18', name: 'Wafat Yesus Kristus' },
    { date: '2025-04-20', name: 'Hari Paskah' },
    { date: '2025-05-01', name: 'Hari Buruh Internasional' },
    { date: '2025-05-12', name: 'Hari Raya Waisak 2569 BE' },
    { date: '2025-05-29', name: 'Kenaikan Yesus Kristus' },
    { date: '2025-06-01', name: 'Hari Lahir Pancasila' },
    { date: '2025-06-07', name: 'Hari Raya Idul Adha 1446 H' },
    { date: '2025-06-27', name: 'Tahun Baru Islam 1447 H' },
    { date: '2025-08-17', name: 'Hari Kemerdekaan RI' },
    { date: '2025-09-05', name: 'Maulid Nabi Muhammad SAW' },
    { date: '2025-12-25', name: 'Hari Raya Natal' }
  ],
  2026: [
    { date: '2026-01-01', name: 'Tahun Baru 2026 Masehi' },
    { date: '2026-01-16', name: 'Isra Mikraj Nabi Muhammad SAW' },
    { date: '2026-02-17', name: 'Tahun Baru Imlek 2577 Kongzili' },
    { date: '2026-03-19', name: 'Hari Suci Nyepi Saka 1948' },
    { date: '2026-03-20', name: 'Hari Raya Idul Fitri 1447 H' },
    { date: '2026-03-21', name: 'Hari Raya Idul Fitri 1447 H' },
    { date: '2026-04-03', name: 'Wafat Yesus Kristus' },
    { date: '2026-04-05', name: 'Hari Paskah' },
    { date: '2026-05-01', name: 'Hari Buruh Internasional' },
    { date: '2026-05-14', name: 'Kenaikan Yesus Kristus' },
    { date: '2026-05-27', name: 'Hari Raya Idul Adha 1447 H' },
    { date: '2026-05-31', name: 'Hari Raya Waisak 2570 BE' },
    { date: '2026-06-01', name: 'Hari Lahir Pancasila' },
    { date: '2026-06-16', name: 'Tahun Baru Islam 1448 H' },
    { date: '2026-08-17', name: 'Hari Kemerdekaan RI' },
    { date: '2026-08-25', name: 'Maulid Nabi Muhammad SAW' },
    { date: '2026-12-25', name: 'Hari Raya Natal' }
  ],
  2027: [
    { date: '2027-01-01', name: 'Tahun Baru 2027 Masehi' },
    { date: '2027-01-06', name: 'Isra Mikraj Nabi Muhammad SAW' },
    { date: '2027-02-06', name: 'Tahun Baru Imlek 2578 Kongzili' },
    { date: '2027-03-09', name: 'Hari Suci Nyepi Saka 1949' },
    { date: '2027-03-10', name: 'Hari Raya Idul Fitri 1448 H' },
    { date: '2027-03-11', name: 'Hari Raya Idul Fitri 1448 H' },
    { date: '2027-03-26', name: 'Wafat Yesus Kristus' },
    { date: '2027-03-28', name: 'Hari Paskah' },
    { date: '2027-05-01', name: 'Hari Buruh Internasional' },
    { date: '2027-05-06', name: 'Kenaikan Yesus Kristus' },
    { date: '2027-05-16', name: 'Hari Raya Idul Adha 1448 H' },
    { date: '2027-05-20', name: 'Hari Raya Waisak 2571 BE' },
    { date: '2027-06-01', name: 'Hari Lahir Pancasila' },
    { date: '2027-06-06', name: 'Tahun Baru Islam 1449 H' },
    { date: '2027-08-15', name: 'Maulid Nabi Muhammad SAW' },
    { date: '2027-08-17', name: 'Hari Kemerdekaan RI' },
    { date: '2027-12-25', name: 'Hari Raya Natal' },
    { date: '2027-12-27', name: 'Isra Mikraj Nabi Muhammad SAW (1449 H)' }
  ],
  2028: [
    { date: '2028-01-01', name: 'Tahun Baru 2028 Masehi' },
    { date: '2028-01-26', name: 'Tahun Baru Imlek 2579 Kongzili' },
    { date: '2028-02-27', name: 'Hari Raya Idul Fitri 1449 H' },
    { date: '2028-02-28', name: 'Hari Raya Idul Fitri 1449 H' },
    { date: '2028-03-26', name: 'Hari Suci Nyepi Saka 1950' },
    { date: '2028-04-14', name: 'Wafat Yesus Kristus' },
    { date: '2028-05-01', name: 'Hari Buruh Internasional' },
    { date: '2028-05-05', name: 'Hari Raya Idul Adha 1449 H' },
    { date: '2028-05-09', name: 'Hari Raya Waisak 2572 BE' },
    { date: '2028-05-25', name: 'Kenaikan Yesus Kristus' },
    { date: '2028-06-01', name: 'Hari Lahir Pancasila' },
    { date: '2028-08-17', name: 'Hari Kemerdekaan RI' },
    { date: '2028-12-25', name: 'Hari Raya Natal' }
  ]
};

const STORAGE_KEY = 'kalenderkita_custom_holidays';
const OVERRIDE_KEY = 'kalenderkita_holiday_overrides';

/**
 * Mendapatkan daftar libur custom pengguna dari localStorage
 * @returns {Array<{id: string, date: string, name: string, isCustom: boolean}>}
 */
export function getStoredCustomHolidays() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Gagal membaca custom holidays dari localStorage', e);
    return [];
  }
}

/**
 * Menyimpan daftar libur custom pengguna ke localStorage
 * @param {Array} holidays
 */
export function saveCustomHolidays(holidays) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holidays));
  } catch (e) {
    console.error('Gagal menyimpan custom holidays ke localStorage', e);
  }
}

/**
 * Mendapatkan daftar ID libur default yang dinonaktifkan/dihapus pengguna
 * @returns {string[]}
 */
export function getDisabledHolidayIds() {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Menyimpan ID libur default yang dinonaktifkan
 * @param {string[]} ids
 */
export function saveDisabledHolidayIds(ids) {
  try {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Gagal menyimpan disabled holidays', e);
  }
}

/**
 * Mendapatkan daftar libur bawaan untuk suatu tahun (dengan fallback jika tahun belum terdaftar)
 * @param {number} year
 * @returns {Array<{id: string, date: string, name: string, isCustom: boolean}>}
 */
export function getBaseHolidays(year) {
  if (DEFAULT_HOLIDAYS[year]) {
    return DEFAULT_HOLIDAYS[year].map((h, idx) => ({
      id: `default-${year}-${idx}-${h.date}`,
      date: h.date,
      name: h.name,
      isCustom: false
    }));
  }

  // Fallback untuk tahun di luar database (libur tanggal tetap nasional)
  return [
    { id: `fixed-${year}-01-01`, date: `${year}-01-01`, name: `Tahun Baru ${year} Masehi`, isCustom: false },
    { id: `fixed-${year}-05-01`, date: `${year}-05-01`, name: 'Hari Buruh Internasional', isCustom: false },
    { id: `fixed-${year}-06-01`, date: `${year}-06-01`, name: 'Hari Lahir Pancasila', isCustom: false },
    { id: `fixed-${year}-08-17`, date: `${year}-08-17`, name: 'Hari Kemerdekaan RI', isCustom: false },
    { id: `fixed-${year}-12-25`, date: `${year}-12-25`, name: 'Hari Raya Natal', isCustom: false }
  ];
}

/**
 * Mendapatkan seluruh hari libur (bawaan aktif + custom) untuk tahun tertentu
 * @param {number} year
 * @returns {Array<{id: string, date: string, name: string, isCustom: boolean}>}
 */
export function getAllHolidaysForYear(year) {
  const base = getBaseHolidays(year);
  const disabledIds = new Set(getDisabledHolidayIds());
  const activeBase = base.filter(h => !disabledIds.has(h.id));

  const customHolidays = getStoredCustomHolidays().filter(h => {
    return h.date && h.date.startsWith(`${year}-`);
  });

  // Gabungkan dan urutkan berdasarkan tanggal
  const merged = [...activeBase, ...customHolidays];
  return merged.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Mendapatkan hari libur untuk bulan tertentu (month: 0-11)
 * @param {number} year
 * @param {number} month
 * @returns {Array<{id: string, date: string, name: string, isCustom: boolean}>}
 */
export function getHolidaysForMonth(year, month) {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  return getAllHolidaysForYear(year).filter(h => h.date.startsWith(monthPrefix));
}

/**
 * Cek apakah sebuah tanggal (YYYY-MM-DD) merupakan tanggal merah libur nasional
 * @param {string} dateKey
 * @param {number} year
 * @returns {{isHoliday: boolean, holidayName?: string}}
 */
export function checkHoliday(dateKey, year) {
  const holidays = getAllHolidaysForYear(year);
  const matched = holidays.find(h => h.date === dateKey);
  if (matched) {
    return { isHoliday: true, holidayName: matched.name, id: matched.id, isCustom: matched.isCustom };
  }
  return { isHoliday: false };
}

/**
 * Menambahkan hari libur custom baru
 * @param {string} date - 'YYYY-MM-DD'
 * @param {string} name - 'Keterangan Libur'
 * @returns {Object}
 */
export function addCustomHoliday(date, name) {
  const custom = getStoredCustomHolidays();
  const newHoliday = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    date,
    name: name.trim(),
    isCustom: true
  };
  custom.push(newHoliday);
  saveCustomHolidays(custom);
  return newHoliday;
}

/**
 * Menghapus hari libur berdasarkan ID
 * @param {string} id
 */
export function deleteHolidayById(id) {
  if (id.startsWith('custom-')) {
    const custom = getStoredCustomHolidays().filter(h => h.id !== id);
    saveCustomHolidays(custom);
  } else {
    // Nonaktifkan default holiday
    const disabled = getDisabledHolidayIds();
    if (!disabled.includes(id)) {
      disabled.push(id);
      saveDisabledHolidayIds(disabled);
    }
  }
}

/**
 * Mengembalikan semua libur pada tahun ini ke setting bawaan semula
 * @param {number} year
 */
export function resetHolidaysForYear(year) {
  // Hapus custom holidays di tahun ini
  const custom = getStoredCustomHolidays().filter(h => !h.date.startsWith(`${year}-`));
  saveCustomHolidays(custom);

  // Aktifkan kembali disabled holidays bawaan untuk tahun ini
  const disabled = getDisabledHolidayIds().filter(id => !id.includes(`-${year}-`));
  saveDisabledHolidayIds(disabled);
}
