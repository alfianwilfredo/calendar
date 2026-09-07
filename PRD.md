# Product Requirements Document (PRD)
# Canva-Ready Calendar Generator Web App (KalenderKita)

---

## 1. Ringkasan Eksekutif & Latar Belakang

### 1.1 Masalah (Problem Statement)
Mendesain kalender tahunan di Canva atau aplikasi grafis lainnya sering kali memakan waktu lama dan rentan salah pada bagian penyusunan grid tanggal per bulan (angka 1 s/d 31, penyesuaian posisi hari, dan penandaan tanggal merah/hari libur nasional). Pengguna sering harus mengetik atau memindahkan angka tanggal satu per satu secara manual setiap bulan.

### 1.2 Solusi (Solution)
Aplikasi web generator kalender yang **super ringan (pure client-side)**, fleksibel, dan intuitif. Pengguna dapat:
- Memilih tahun berapa pun (misal: 2027, 2028, dst.).
- Melihat tanggal merah & libur nasional Indonesia yang otomatis terisi, dengan keleluasaan mengedit/menambah libur secara manual.
- Mengatur tema warna, font, dan elemen tampilan (toggle on/off judul bulan, nama hari, keterangan libur).
- Mengunduh hasil kalender per bulan secara instan dalam format **PNG Transparan (High-Resolution)** dan **SVG**, siap diimpor (*drag-and-drop*) langsung ke lembar kerja Canva tanpa merusak atau menutupi background desain.

---

## 2. Tujuan & Target Pengguna

### 2.1 Tujuan Produk (Goals)
1. **Memangkas Waktu Desain Kalender:** Mengurangi waktu setup grid tanggal dari hitungan jam menjadi hitungan detik.
2. **Seringan & Secepat Mungkin:** Berjalan 100% di peramban pengguna (*zero backend latency*), dapat dibuka secara lokal (file HTML) maupun di-host gratis (GitHub Pages / Vercel).
3. **Kompatibilitas Penuh dengan Canva:** Menghasilkan aset grafis transparan beresolusi tinggi (300 DPI equivalent) dan vektor SVG yang tajam pada berbagai ukuran kanvas cetak (A3, A4, kalender meja/dinding).

### 2.2 Target Pengguna (User Persona)
- **Desainer Canva / Konten Kreator:** Pengguna yang membuat kalender custom untuk dijual (template Canva), merchandise bisnis, atau kebutuhan komunitas.
- **Pemilik UMKM & Percetakan:** Pengusaha yang membutuhkan layout tanggal cepat dan akurat untuk cetak kalender tahunan.
- **Pengguna Umum:** Siapa saja yang ingin mencetak kalender pribadi untuk tahun mendatang.

---

## 3. Fitur Utama & Kebutuhan Fungsional (Functional Requirements)

### 3.1 Mesin Kalender & Navigasi Waktu
- **Pemilihan Tahun Bebas:** Input tahun numerik bebas (misal: 2025, 2026, 2027, 2030+). Algoritma kalender menghitung posisi hari, jumlah hari per bulan, dan tahun kabisat (*leap year*) secara otomatis dan presisi.
- **Navigasi Bulan Cepat:** Tab bar 12 bulan (Januari – Desember) dan tombol navigasi *Prev/Next* untuk beralih bulan secara instan.
- **Pengaturan Hari Awal Minggu:**
  - Pilihan hari pertama: **Minggu** (standar kalender Indonesia) atau **Senin** (standar ISO / modern planner).
- **Pengaturan Bahasa & Format Hari:**
  - Pilihan bahasa: **Bahasa Indonesia** atau **English**.
  - Gaya singkatan nama hari:
    - 3 Huruf: `Min, Sen, Sel, Rab, Kam, Jum, Sab`
    - 1 Huruf: `M, S, S, R, K, J, S`
    - Lengkap: `Minggu, Senin, Selasa, ...`

### 3.2 Sistem Tanggal Merah & Libur Nasional Indonesia
- **Perhitungan Libur Otomatis:**
  - Menyertakan daftar hari libur nasional tahunan berbasis tanggal masehi tetap (Tahun Baru Masehi, Hari Buruh, Hari Lahir Pancasila, Hari Kemerdekaan RI, Hari Kesaktian Pancasila/Sumpah Pemuda jika ada, Hari Raya Natal).
  - Algoritma perkiraan untuk hari libur berbasis kalender lunar/astronomi (Tahun Baru Imlek, Isra Miraj, Idul Fitri, Hari Raya Nyepi, Waisak, Idul Adha, Tahun Baru Islam, Maulid Nabi).
- **Manajemen Libur Interaktif (Tambah/Edit/Hapus Manual):**
  - Mengingat SKB 3 Menteri resmi untuk tahun mendatang (seperti 2027) belum rilis saat ini, pengguna diberikan panel kontrol untuk:
    - Menambah tanggal merah baru (tanggal + keterangan libur / cuti bersama).
    - Mengubah tanggal merah yang ada.
    - Menghapus tanggal merah.
  - Data custom tersimpan otomatis di `localStorage` peramban pengguna agar tidak hilang saat halaman di-refresh.

### 3.3 Fleksibilitas Layout & Komponen Visual (Modular Toggles)
Pengguna dapat mengaktifkan/menonaktifkan (*toggle switch*) elemen-elemen berikut sesuai kebutuhan layout Canva mereka:
- `[Toggle]` **Judul Bulan & Tahun** (misal: "Januari 2027") — bisa dimatikan jika desainer ingin mengetik tipografi judul sendiri di Canva.
- `[Toggle]` **Baris Nama Hari** (Sen, Sel, Rab...) — bisa dimatikan jika header hari sudah ada di template Canva.
- `[Toggle]` **Grid Angka Tanggal** (1 s/d 31) — grid utama kalender.
- `[Toggle]` **Keterangan Tanggal Merah di Bawah** — daftar teks nama libur di bawah grid kalender.
- `[Toggle]` **Tanggal Bulan Sebelum/Sesudah (*Adjacent Days*)** — opsi menampilkan tanggal samar/pudar dari akhir bulan lalu & awal bulan depan agar grid terlihat penuh 6 baris rapi.
- `[Toggle]` **Garis Pembatas Sel / Grid Lines** — opsi kalender tanpa garis (*clean minimal*), garis tipis modern, atau latar kotak bersudut tumpul (*pill/card style*).

### 3.4 Kustomisasi Tema, Warna & Tipografi
- **Preset Tema Siap Pakai:**
  - *Clean Minimalist* (Monokrom elegan, aksen merah lembut)
  - *Modern Pastel* (Nuansa warna lembut, estetik)
  - *Warm Earthy* (Terracotta, sage green, hangat)
  - *Corporate Navy* (Biru tua profesional)
  - *Dark Mode Sleek* (Latar gelap untuk teks kalender terang/putih di Canva)
- **Color Picker Kustom:**
  - Warna Hari Kerja (Senin–Jumat)
  - Warna Hari Minggu (Merah / Custom)
  - Warna Hari Sabtu (Abu-abu / Biru / Netral)
  - Warna Tanggal Merah Libur Nasional (Merah aksen)
  - Warna Judul Bulan & Nama Hari
  - Warna Latar Belakang (Transparan sebagai default, atau warna solid jika diinginkan)
- **Tipografi:**
  - Pilihan font modern via Google Fonts (Inter, Poppins, Montserrat, Plus Jakarta Sans, Playfair Display).
  - Pengaturan ketebalan font (*Regular*, *Medium*, *Bold*).
  - Skala ukuran font angka, nama hari, dan judul.

### 3.5 Sistem Ekspor & Download (Canva Ready)
- **Download Per Bulan (1 per 1):**
  - Tombol unduh langsung untuk bulan aktif yang sedang dipratinjau.
  - **Format PNG Transparan:** Resolusi tinggi (skala 2x–4x / ~300 DPI) agar tidak pecah saat diperbesar di lembar kerja Canva.
  - **Format SVG (Vektor):** Hasil berupa file `.svg` murni yang dapat di-unggah ke Canva dan warna/elemennya tetap dapat diedit sebagai objek vektor.
- **Download Sekaligus (Batch 12 Bulan .ZIP):**
  - Tombol ekstra untuk mengunduh seluruh 12 bulan kalender dalam satu file ZIP (tersedia pilihan ZIP isi PNG atau ZIP isi SVG).
- **Format Penamaan File Otomatis:**
  - Pola: `kalender-[tahun]-[nomor_bulan]-[nama_bulan].[png/svg]` (Contoh: `kalender-2027-01-januari.png`).

### 3.6 Pratinjau Interaktif Langsung (WYSIWYG Live Preview)
- Kanvas pratinjau yang responsif dengan checkerboard pattern (indikator transparansi).
- Setiap perubahan slider, warna, toggle, atau tahun langsung ter-render dalam hitungan milidetik (*real-time reactive*).

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Ringan & Cepat (Ultra-Lightweight):**
   - Total ukuran aset awal di bawah 200 KB (tanpa framework berat, pure HTML5 + CSS3 + Vanilla JS).
   - *First Contentful Paint (FCP)* < 0.5 detik.
2. **Kemandirian (Zero Server / Pure Client-Side):**
   - Tidak memerlukan server backend atau database relasional.
   - Dapat dijalankan secara *offline* setelah dimuat pertama kali.
3. **Privasi & Keamanan:**
   - Tidak ada data pengguna yang dikirim ke server luar. Kustomisasi tersimpan di browser klien (`localStorage`).
4. **Responsivitas Antarmuka:**
   - Tampilan split-screen di desktop (Panel Pengaturan di kiri, Live Preview di kanan).
   - Tata letak bertumpuk yang tetap nyaman digunakan di tablet dan mobile.

---

## 5. Arsitektur Teknis & Struktur Proyek

### 5.1 Arsitektur Aplikasi
```
[User Browser]
   │
   ├── index.html           --> Struktur semantik & antarmuka aplikasi
   ├── style.css            --> Variabel CSS, tema, layout responsif & styling modern
   └── js/
       ├── app.js           --> State management & inisialisasi controller
       ├── calendar.js      --> Perhitungan grid tanggal, hari, & leap year
       ├── holidays.js      --> Data libur nasional default + kalkulasi + storage custom
       ├── render.js        --> SVG builder & Canvas 300 DPI exporter
       └── themes.js        --> Preset palet warna & tipografi
```

### 5.2 Strategi Rendering Ekspor
1. **SVG Generation:** Template string SVG modular berbasis DOM/XML yang bersih, menyusun `<text>`, `<rect>`, dan `<line>` dengan koordinat presisi.
2. **PNG Generation:** Me-render SVG ke dalam elemen `<canvas>` HTML5 dengan perkalian skala *devicePixelRatio* (faktor skala 3x/4x) untuk menghasilkan kerapatan piksel setara cetak 300 DPI, lalu diekspor menggunakan `canvas.toBlob('image/png')`.
3. **Batch ZIP:** Menggunakan library JSZip ringan (via CDN) untuk membundel 12 file hasil render menjadi satu file zip tanpa beban server.

---

## 6. Struktur Data (Data Schema)

### 6.1 Data Hari Libur
```typescript
interface Holiday {
  id: string;              // unik, e.g. "2027-01-01-newyear"
  date: string;            // format ISO: "YYYY-MM-DD"
  name: string;            // e.g. "Tahun Baru Masehi 2027"
  isNationalHoliday: boolean; // true = tanggal merah
  isCutiBersama: boolean;  // opsional
  isCustom?: boolean;      // true jika ditambahkan pengguna secara manual
}
```

### 6.2 Konfigurasi Kalender (App State)
```typescript
interface CalendarConfig {
  year: number;            // e.g. 2027
  activeMonth: number;     // 0 = Januari, 11 = Desember
  startDayOfWeek: 0 | 1;   // 0 = Minggu, 1 = Senin
  language: 'id' | 'en';
  dayFormat: 'short' | 'single' | 'full'; // "Min" | "M" | "Minggu"
  toggles: {
    showMonthTitle: boolean;
    showDayNames: boolean;
    showDateGrid: boolean;
    showHolidayList: boolean;
    showAdjacentDays: boolean;
    showGridLines: boolean;
  };
  theme: {
    preset: string;
    fontFamily: string;
    weekdayColor: string;
    sundayColor: string;
    saturdayColor: string;
    holidayColor: string;
    headerColor: string;
    backgroundColor: string; // 'transparent' atau hex
  };
}
```

---

## 7. Desain Antarmuka (UI Layout & Wireframe)

### 7.1 Tata Letak Desktop (Split Screen)
```
+-----------------------------------------------------------------------------+
|  📅 KalenderKita - Canva-Ready Calendar Generator                          |
+------------------------------------+----------------------------------------+
| PANEL KONTROL & PENGATURAN (KIRI)  | LIVE PREVIEW & DOWNLOAD (KANAN)       |
|                                    |                                        |
| 1. Tahun & Navigasi                | [Jan] [Feb] [Mar] ... [Des] (Tabs)    |
|    - Input Tahun: [ 2027 ]         | +------------------------------------+ |
|    - Awal Minggu: (o) Min  ( ) Sen | |       JANUARI 2027                 | |
|    - Bahasa: [ Bahasa Indonesia v] | |                                    | |
|                                    | |  MIN  SEN  SEL  RAB  KAM  JUM  SAB | |
| 2. Elemen Tampilan (Toggles)       | |                   1    2    3    4 | |
|    [x] Judul Bulan & Tahun         | |    5    6    7    8    9   10   11 | |
|    [x] Baris Nama Hari             | |   12   13   14   15   16   17   18 | |
|    [x] Daftar Libur di Bawah       | |   19   20   21   22   23   24   25 | |
|    [ ] Tampilkan Garis Grid        | |   26   27   28   29   30   31      | |
|                                    | | ---------------------------------- | |
| 3. Tema & Warna                    | | * 1 Jan: Tahun Baru Masehi         | |
|    - Preset: [ Minimalist Modern v]| +------------------------------------+ |
|    - Font:   [ Poppins v ]         |                                        |
|    - Color Pickers (Tgl/Merah/Bg)  | [ Download PNG Transparan ]            |
|                                    | [ Download SVG Vektor ]                |
| 4. Kelola Hari Libur & Tanggal     | -------------------------------------- |
|    - [+ Tambah Libur Manual]       | [ 📦 Download 12 Bulan (.ZIP) ]        |
|    - Daftar libur bulan ini (edit) |                                        |
+------------------------------------+----------------------------------------+
```

---

## 8. Rencana Implementasi & Roadmap

- **Fase 1: Core Engine**
  - Implementasi fungsi kalkulator tanggal Masehi & tahun kabisat.
  - Implementasi generator dataset libur nasional Indonesia (termasuk perkiraan 2027).
- **Fase 2: Visual Styling & Live Preview**
  - Setup antarmuka responsif dengan Vanilla CSS & modern design tokens.
  - Integrasi preset tema, color pickers, dan Google Fonts.
  - Sistem toggle visibilitas elemen modular.
- **Fase 3: Ekspor Gambar (PNG Transparan & SVG)**
  - Rendering SVG dinamis dan konversi Canvas ke PNG resolusi tinggi (300 DPI).
  - Implementasi batch download 12 bulan via JSZip.
- **Fase 4: Manajemen Libur Custom & Penyempurnaan**
  - Modal/Form tambah & edit tanggal merah dengan persistensi `localStorage`.
  - Polishing UI/UX, pengujian hasil impor di Canva, dan dokumentasi penggunaan.
