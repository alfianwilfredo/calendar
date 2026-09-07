/**
 * themes.js - Preset Tema, Palet Warna, dan Tipografi
 */

export const THEME_PRESETS = {
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist Monochrome',
    description: 'Tampilan bersih, modern dengan angka hitam elegan & aksen merah cerah',
    weekdayColor: '#1e293b',
    sundayColor: '#dc2626',
    saturdayColor: '#64748b',
    holidayColor: '#dc2626',
    headerColor: '#0f172a',
    backgroundColor: 'transparent',
    gridLineColor: '#e2e8f0',
    adjacentColor: '#cbd5e1'
  },
  pastel: {
    id: 'pastel',
    name: 'Aesthetic Pastel',
    description: 'Sentuhan warna lembut kekinian cocok untuk planner dan kalender estetik',
    weekdayColor: '#475569',
    sundayColor: '#e11d48',
    saturdayColor: '#8b5cf6',
    holidayColor: '#e11d48',
    headerColor: '#0f766e',
    backgroundColor: 'transparent',
    gridLineColor: '#f1f5f9',
    adjacentColor: '#cbd5e1'
  },
  earthy: {
    id: 'earthy',
    name: 'Warm Earthy',
    description: 'Nuansa hangat terracotta, cokelat kopi & zaitun',
    weekdayColor: '#44403c',
    sundayColor: '#c2410c',
    saturdayColor: '#854d0e',
    holidayColor: '#c2410c',
    headerColor: '#292524',
    backgroundColor: 'transparent',
    gridLineColor: '#e7e5e4',
    adjacentColor: '#d6d3d1'
  },
  navy: {
    id: 'navy',
    name: 'Corporate Navy',
    description: 'Kesan formal & profesional dengan kombinasi biru tua dan merah marun',
    weekdayColor: '#1e3a8a',
    sundayColor: '#b91c1c',
    saturdayColor: '#2563eb',
    holidayColor: '#b91c1c',
    headerColor: '#172554',
    backgroundColor: 'transparent',
    gridLineColor: '#dbeafe',
    adjacentColor: '#bfdbfe'
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode (Teks Terang)',
    description: 'Warna teks cerah putih/pastel, sangat cocok di-overlay di atas template Canva berlatar gelap',
    weekdayColor: '#f8fafc',
    sundayColor: '#f87171',
    saturdayColor: '#94a3b8',
    holidayColor: '#f87171',
    headerColor: '#ffffff',
    backgroundColor: 'transparent',
    gridLineColor: '#334155',
    adjacentColor: '#64748b'
  }
};

export const FONT_FAMILIES = [
  { id: 'Poppins', name: 'Poppins (Modern & Bulat)', css: "'Poppins', sans-serif" },
  { id: 'Inter', name: 'Inter (Clean & Minimalis)', css: "'Inter', sans-serif" },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Elegan)', css: "'Plus Jakarta Sans', sans-serif" },
  { id: 'Montserrat', name: 'Montserrat (Bold Geometric)', css: "'Montserrat', sans-serif" },
  { id: 'Playfair Display', name: 'Playfair Display (Klasik Serif)', css: "'Playfair Display', serif" }
];
