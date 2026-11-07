# Alifia Math - Game Matematika SD

Platform game 3D pembelajaran Matematika Sekolah Dasar (Kelas 1–6 SD) berbasis Three.js & Socket.io. Game ini dapat dimainkan secara **Online Multiplayer** (dengan Kode Kelas dari Guru) maupun **Offline/Single-Player**.

---

## 📁 Struktur Berkas Proyek

```
zuperverse-sd-math/
├── public/
│   └── index.html      # Tampilan 3D Client (Three.js, 90 Soal SD, Joystick, Canvas UI)
├── .gitignore          # File yang diabaikan Git
├── package.json        # Dependensi Node.js & Socket.io
├── README.md           # Panduan penggunaan & deployment
└── server.js           # Backend WebSocket Server (Room Management & Realtime Sync)
```

---

## 🛠️ Cara Menjalankan di Komputer Lokal

1. **Pastikan Node.js sudah terinstal** di komputer Anda.
2. Buka terminal / Command Prompt di folder proyek ini:
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   npm start
   ```
4. Buka browser dan kunjungi:
   ```text
   http://localhost:3000
   ```

---

## 🌐 Cara Meng-online-kan Proyek (Deployment)

### 1. Upload ke GitHub
1. Buat Repositori Baru di [GitHub](https://github.com/new) dengan nama `zuperverse-sd-math`.
2. Jalankan perintah berikut di terminal folder Anda:
   ```bash
   git init
   git add .
   git commit -m "Initial commit ZuperVerse SD Math"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/zuperverse-sd-math.git
   git push -u origin main
   ```

### 2. Deploy Backend Multiplayer ke Render.com (Gratis)
1. Buat akun di [Render.com](https://render.com).
2. Pilih **New +** > **Web Service**.
3. Sambungkan dengan akun GitHub Anda dan pilih repositori `zuperverse-sd-math`.
4. Atur konfigurasinya:
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Klik **Create Web Service**. Setelah selesai, Render akan memberikan URL server (misalnya: `https://zuperverse-sd-math.onrender.com`).

---

## 🎮 Fitur Utama Game

- **90 Soal Matematika SD:** 15 Soal per kelas (Kelas 1 hingga Kelas 6) + Mode Speed Run.
- **Dunia 3D & Avatar Kustom:** Karakter 3D interaktif dengan *name tag* melayang di atas kepala.
- **Kontrol Dual:** Keyboard (WASD/Panah/Spasi) & Virtual Joystick untuk HP/Tablet.
- **Fitur Mode Guru:** Guru dapat membuat Kode Kelas, memantau siswa di ruang tunggu, dan memulai kuis secara serentak.
- **Offline Fallback:** Menggunakan `localStorage` sehingga siswa tetap bisa bermain sendirian jika koneksi internet terputus.
