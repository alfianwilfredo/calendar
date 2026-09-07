/**
 * calendar.js - Mesin Kalkulasi Kalender Masehi
 * Menghitung posisi hari, jumlah hari, tahun kabisat, dan grid hari kalender.
 */

export const MONTH_NAMES = {
  id: [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
};

export const DAY_NAMES = {
  id: {
    short: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    single: ['M', 'S', 'S', 'R', 'K', 'J', 'S'],
    full: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  },
  en: {
    short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    single: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }
};

/**
 * Mendapatkan jumlah hari dalam suatu bulan tertentu (menangani tahun kabisat)
 * @param {number} year - Contoh: 2027
 * @param {number} month - 0 untuk Januari s/d 11 untuk Desember
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Mendapatkan daftar nama hari sesuai urutan awal hari (Minggu atau Senin)
 * @param {'id'|'en'} language
 * @param {'short'|'single'|'full'} format
 * @param {0|1} startDayOfWeek - 0 = Minggu, 1 = Senin
 * @returns {string[]}
 */
export function getOrderedDayNames(language = 'id', format = 'short', startDayOfWeek = 0) {
  const days = DAY_NAMES[language]?.[format] || DAY_NAMES.id.short;
  if (startDayOfWeek === 1) {
    // Geser Minggu (index 0) ke paling belakang: [Sen, Sel, ..., Sab, Min]
    return [...days.slice(1), days[0]];
  }
  return [...days];
}

/**
 * Format angka ke 2 digit (misal: 5 -> "05")
 * @param {number} num
 * @returns {string}
 */
export function padZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Format string tanggal YYYY-MM-DD
 * @param {number} year
 * @param {number} month - 0-11
 * @param {number} day - 1-31
 * @returns {string}
 */
export function formatDateKey(year, month, day) {
  return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

/**
 * Menghasilkan data struktur grid kalender 7 kolom x N baris (biasanya 5 atau 6 baris)
 * @param {number} year
 * @param {number} month - 0-11
 * @param {0|1} startDayOfWeek - 0 = Minggu, 1 = Senin
 * @returns {Array<Array<{day: number, month: number, year: number, isCurrentMonth: boolean, dayOfWeek: number, dateKey: string}>>}
 */
export function generateMonthGrid(year, month, startDayOfWeek = 0) {
  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
  
  // Hitung berapa cell padding sebelum tanggal 1
  let leadingDaysCount = firstDayIndex - startDayOfWeek;
  if (leadingDaysCount < 0) {
    leadingDaysCount += 7;
  }

  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  const nextMonthIndex = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const cells = [];

  // 1. Hari dari bulan sebelumnya (leading adjacent days)
  for (let i = leadingDaysCount - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateKey = formatDateKey(prevYear, prevMonthIndex, dayNum);
    const dayOfWeek = new Date(prevYear, prevMonthIndex, dayNum).getDay();
    cells.push({
      day: dayNum,
      month: prevMonthIndex,
      year: prevYear,
      isCurrentMonth: false,
      dayOfWeek,
      dateKey
    });
  }

  // 2. Hari di bulan aktif
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const dateKey = formatDateKey(year, month, day);
    const dayOfWeek = new Date(year, month, day).getDay();
    cells.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      dayOfWeek,
      dateKey
    });
  }

  // 3. Hari di bulan berikutnya (trailing adjacent days) agar total genap kelipatan 7
  const totalCells = Math.ceil(cells.length / 7) * 7;
  // Jika ingin grid selalu 6 baris rapi (42 cells) untuk layout konsisten
  const targetTotalCells = totalCells < 35 ? 35 : (totalCells === 35 ? 35 : 42);
  const trailingDaysCount = targetTotalCells - cells.length;

  for (let day = 1; day <= trailingDaysCount; day++) {
    const dateKey = formatDateKey(nextYear, nextMonthIndex, day);
    const dayOfWeek = new Date(nextYear, nextMonthIndex, day).getDay();
    cells.push({
      day,
      month: nextMonthIndex,
      year: nextYear,
      isCurrentMonth: false,
      dayOfWeek,
      dateKey
    });
  }

  // Pecah menjadi baris-baris (weeks) berisi 7 kolom
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
}
