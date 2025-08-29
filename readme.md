
# 📱 Aplikasi Validasi Nomor & Download Hasil

Aplikasi web sederhana berbasis HTML, CSS, JavaScript, dan Node.js untuk melakukan validasi, pengelompokan, serta Menyalin nomor telepon clipboard.

---

## 📁 Struktur Folder

```
.
├── node_modules/          # Dependensi Node.js
├── public/                # Berisi file HTML utama
│   ├── index.html
│   └── qr.html
├── session/               # File server backend (opsional)
│   └── index.js
├── package-lock.json      # Lockfile npm
├── package.json           # Konfigurasi dependensi
└── README.md              # Dokumentasi penggunaan
```

---

## 📦 Cara Instalasi di Komputer Baru

1. **Install Node.js**  
   Download di: [https://nodejs.org](https://nodejs.org)  
   Install sesuai sistem operasi masing-masing.

2. **Download atau salin proyek ini ke komputer**  
   Bisa menggunakan `git clone` atau ekstrak file `.zip`.

3. **Buka terminal / CMD di dalam folder proyek**

4. **Install dependensi**
   ```bash
   npm install
   ```
   Ini akan membaca file `package.json` dan meng-install semua module ke folder `node_modules/`.

---

## ▶️ Cara Menjalankan

1. Pastikan terminal / CMD berada di root folder proyek.

2. Jalankan server Node.js (jika menggunakan backend di folder `session/`)
   ```bash
   node session/index.js
   ```

3. Buka browser dan akses:
   ```
   http://localhost:3000
   ```

4. Atau buka langsung file `public/index.html` untuk versi tanpa server.

---

## 🎛️ Fitur

- ✅ Input nomor telepon secara bulk  
- ✅ Validasi format nomor  
- ✅ Menampilkan hasil validasi ke layar  
- ✅ Tombol **Salin Hasil Terdaftar** ke clipboard  
- ✅ Tombol **Download Hasil Terdaftar** sebagai file `.txt`

---

## 📌 Catatan Tambahan

- Folder `public/` berisi halaman web utama.
- Folder `session/` untuk script server backend jika diperlukan Hapus jika ada sebelum mulai.
- Semua dependensi otomatis terpasang ke `node_modules/` setelah menjalankan `npm install`.
- Pastikan port di `index.js` sesuai dan belum dipakai program lain.
- Bisa dijalankan lokal tanpa internet.

---

## 📜 Lisensi

Bebas digunakan untuk keperluan pribadi, edukasi, dan non-komersial.
