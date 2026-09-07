# DESIGN.md - Panduan Arahan Desain KalenderKita

Dokumen ini mendefinisikan identitas, kepribadian visual, palet warna, tipografi, dan dial antislop untuk aplikasi KalenderKita.

---

## 1. Identitas & Karakter Produk (Identity & Character)
- **Nama Produk**: KalenderKita (Canva-Ready Calendar Generator)
- **Kategori**: Studio / Graphic Workbench untuk Desainer & Konten Kreator Canva
- **Peran**: Utilitas presisi yang menghasilkan grid kalender matematis, akurat, dan beresolusi tinggi (PNG Transparan & SVG) untuk diimpor ke lembar kerja cetak/desain.
- **Karakter Desain**: *Utilitarian, Precision, Typographic, Grounded*. Terasa seperti alat grafis profesional (setara Figma / Linear Inspector / Print Tool), bukan template AI saas generik yang dipenuhi gradien ungu dan neon glow.

---

## 2. Dials Antislop (Liveliness Toolkit)
Dial ditetapkan secara sadar untuk mencerminkan workbench grafis:

| Dial | Nilai | Alasan / Penerapan |
|---|---|---|
| **ENERGY** | **2 (Balanced)** | Tampilan tegas, bersih, dan percaya diri; fokus utama adalah kanvas kalender tanpa distraksi dekoratif yang berisik. |
| **RHYTHM** | **2 (Consistent with breaks)** | Pembagian tata letak jelas antara panel inspektur pengaturan, navigasi 12 bulan, kanvas transparan, dan action bar ekspor. |
| **MOTION** | **1 (Hover & transitions only)** | Transisi interaksi cepat (150ms-200ms) saat hover, fokus, dan ganti tab. Tidak ada animasi loop/pulse tak berujung. |

---

## 3. Palet Warna & Kontras (Color System - WCAG AA)

Semua kombinasi warna teks dan latar belakang wajib memenuhi standar WCAG AA (minimal 4.5:1 untuk teks normal, minimal 3.0:1 untuk teks besar dan batas non-teks).

| Peran | Nilai Hex | Penggunaan | Rasio Kontras pada `#ffffff` / `#f8fafc` |
|---|---|---|---|
| **Latar Belakang Aplikasi** | `#f8fafc` | Background kanvas luas | Netral dasar |
| **Permukaan Kartu / Panel** | `#ffffff` | Background panel kontrol & inspektur | 1.0:1 (terdapat border pemisah) |
| **Border Struktural** | `#e2e8f0` | Pembatas antar seksi & input (1px) | 1.2:1 (batas pemisah) |
| **Border Kuat (Active/Hover)** | `#cbd5e1` | Border saat hover/interaksi | 1.5:1 |
| **Teks Utama (Primary Text)** | `#0f172a` | Judul, angka tanggal, label utama | **18.6:1 (PASS AA)** |
| **Teks Sekunder (Secondary Text)**| `#475569` | Sublabel, instruksi, status non-aktif | **5.4:1 (PASS AA)** |
| **Aksen Utama (Primary Action)** | `#1d4ed8` | Tombol download utama, tab aktif, ring fokus | **4.9:1 pada putih (PASS AA)** |
| **Aksen Utama Hover** | `#1e40af` | Status hover tombol utama | **6.5:1 pada putih (PASS AA)** |
| **Aksen Semantik (Holiday/Sun)** | `#dc2626` | Tanggal merah, kolom Minggu, status libur | **4.6:1 pada putih (PASS AA)** |

*Catatan: Gradien warna ungu-ke-biru dan efek glow spekulatif dilarang (R-01, R-13).*

---

## 4. Tipografi & Skala Teks (Typography Hierarchy)

Menggunakan Google Fonts *Plus Jakarta Sans* sebagai font dasar aplikasi karena keterbacaan tinggi pada teks kecil dan angka tabel.

- **Header / Brand**: 1.125rem (18px), Weight 700, tracking -0.02em
- **Section Headers**: 0.8125rem (13px), Weight 700, uppercase, tracking +0.05em, color `#475569`
- **Control Labels**: 0.875rem (14px), Weight 600, color `#0f172a`
- **Helper / Sublabels**: 0.75rem (12px), Weight 400, color `#475569` (bukan abu-abu pudar)
- **Tombol / Tab**: 0.875rem (14px), Weight 600

---

## 5. Skala Radius & Elevasi (Border Radius & Elevation)

Menolak tren "pill everywhere" (R-11) dan "floating shadow everywhere" (R-12):

- **Radius 6px (`--radius-sm`)**: Tag status, stepper input, color swatch.
- **Radius 8px (`--radius-md`)**: Tombol, input teks, dropdown select, tab bulan.
- **Radius 12px (`--radius-lg`)**: Kartu panel, modal dialog, area kanvas pratinjau.
- **Elevasi Fungsional**: Mengutamakan kontras 1px border struktural (`#e2e8f0`). Shadow digunakan sangat hemat (`0 1px 2px rgba(0,0,0,0.05)`) hanya untuk membedakan lapisan popover/modal.

---

## 6. Standar Interaksi & Aksesibilitas (Accessibility & Human Standard)

1. **Tap Target**: Seluruh tombol interaktif, stepper (+/-), tab navigasi, dan switch memiliki area sentuh minimal **44px x 44px** (R-03).
2. **Fokus Keyboard**: Indikator `:focus-visible` berkontras tinggi (2px solid `#2563eb`, outline-offset 2px) aktif pada semua kontrol yang dapat difokuskan (R-32).
3. **Penutupan Modal**: Seluruh dialog modal dapat ditutup dengan tombol `Escape` atau klik di luar area konten (R-26).
4. **State Lengkap**: Menyediakan tampilan kosong (*empty state*), loading progress bar, dan notifikasi konfirmasi tindakan (R-27).
5. **Bahasa Manusia**: Copywriting menggunakan Bahasa Indonesia baku yang lugas tanpa kata pemasaran generik dan **tanpa em dash (`—`)** (R-02, R-16).
