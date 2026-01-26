# 🚀 FusionTik - TikTok Downloader

![Next.js](https://img.shields.io/badge/Next.js-15-blue?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/TikTok%20Downloader-Production%20Ready-brightgreen?style=for-the-badge)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/jundy779/FusionTik?utm_source=oss&utm_medium=github&utm_campaign=jundy779%2FFusionTik&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
> Download TikTok videos, foto (Photo Mode), dan audio tanpa watermark. Cepat, gratis, dan simpel dipakai.

## 🖼️ Preview

Contoh tampilan UI (bisa kamu ganti kapan saja):

![FusionTik UI Preview](./public/placeholder.jpg)

## 🌟 Apa itu FusionTik?

FusionTik adalah web TikTok downloader modern untuk simpan konten TikTok tanpa ribet. Tinggal paste link, pilih format, dan download tanpa watermark.

**🌐 Live demo:** [https://fusiontik.vercel.app](https://fusiontik.vercel.app)

### 🎯 Kenapa pakai FusionTik?

- 🎬 **Tanpa Watermark** – Download video TikTok bersih tanpa logo
- 🖼️ **Support Photo Mode** – Bisa download carousel / slide foto TikTok
- 🎵 **Audio Only** – Ekstrak hanya suaranya (musik) dari video
- 📱 **Responsif** – Enak dipakai di HP, tablet, dan desktop
- ⚡ **Cepat** – Proses download dalam hitungan detik
- 💾 **Riwayat Download** – History tersimpan di device kamu
- 🌍 **Global Stats** – Counter total download seluruh pengguna
- 🛡️ **Notifikasi Error** – Owner bisa dapat notif kalau API provider error

## 🛠️ Tech Stack

- **⚛️ Next.js 15** – App Router, SEO-friendly
- **📘 TypeScript** – Type-safe dan maintainable
- **🎨 Tailwind CSS** – Utility-first styling
- **🧩 shadcn/ui** – Komponen UI siap pakai
- **🎭 Framer Motion** – Animasi halus
- **📊 Supabase** – Penyimpanan statistik global
- **✉️ Nodemailer + Telegram Bot** – Notifikasi gangguan API ke owner

## 🚀 Quick Start

### Prasyarat

- **Node.js 18+**
- **npm / pnpm / yarn**

### Clone & install

```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik

# pilih salah satu package manager
npm install
# atau
pnpm install
# atau
yarn install
```

## 🎮 Menjalankan Project

### Development

```bash
npm run dev
```

Buka <http://localhost:3000>.

### Production

```bash
npm run build
npm run start
```

Custom port:

```bash
PORT=8080 npm run start
```

## ⚙️ Environment Variables

Contoh `.env.local` minimal:

```env
# Supabase (untuk global stats)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Notifikasi error (opsional tapi direkomendasikan)
TELEGRAM_BOT_TOKEN= # token bot Telegram
TELEGRAM_CHAT_ID=   # chat id penerima notif

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=yourapppassword
ALERT_EMAIL_TO=owner@domain.com
```

Notifikasi akan dikirim ketika provider TikTok API gagal merespons (fallback error).

## 🌐 Deployment / Hosting

### 1. Deploy ke Vercel (recommended)

1. Fork repo ini ke akun GitHub kamu
2. Buka [https://vercel.com/import](https://vercel.com/import) dan pilih repo **FusionTik**
3. Set environment variables di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (opsional)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ALERT_EMAIL_TO` (opsional)
4. Deploy, dan Vercel akan build + host otomatis

### 2. Deploy ke VPS / Server sendiri

- Clone repo di server
- Set `.env.local` sesuai kebutuhan
- Jalankan:

```bash
npm install
npm run build
npm run start
```

Gunakan process manager seperti `pm2`, `docker` (kalau kamu buat Dockerfile sendiri), atau systemd service sesuai preferensi.

## 📁 Struktur Project

```
FusionTik/
├── app/
│   ├── api/
│   │   ├── tiktok/
│   │   │   └── route.ts        # Endpoint utama TikTok downloader + fallback provider
│   │   └── global-stats/
│   │       └── route.ts        # API global download counter
│   ├── layout.tsx              # Root layout + SEO + verification
│   └── page.tsx                # Halaman utama downloader
│
├── components/
│   ├── ui/                     # Komponen shadcn/ui
│   ├── navbar.tsx
│   ├── result-buttons.tsx
│   ├── result-card.tsx
│   ├── stats-card.tsx
│   ├── video-preview.tsx       # Preview video + Photo Mode
│   └── video-preview-modal.tsx
│
├── hooks/
│   ├── use-download-history.ts # Riwayat download per user
│   ├── use-download-stats.ts   # Statistik per user
│   └── use-global-stats.ts     # Global counter
│
├── lib/
│   └── utils.ts                # Helper utilities
│
├── data/
│   └── global-stats.json       # Persistensi global counter (server side)
│
├── public/                     # Static assets
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 💡 Cara Kerja Singkat

### 🎬 Video & Photo Mode

- User paste URL TikTok
- Backend memanggil beberapa provider (misal: Zell, Sanka) dengan fallback
- Response diproses dan ditampilkan di UI
- Pengguna bisa download:
  - Video tanpa watermark (MP4)
  - Audio saja (MP3)
  - Carousel foto (Photo Mode)

### 🔔 Notifikasi Error Provider

- Jika provider utama gagal
- Sistem mencoba fallback provider lain
- Jika semua gagal:
  - Kirim notif ke webhook/Telegram/email (kalau env diset)
  - User tetap dapat pesan error yang rapi di UI

### 📊 Statistik

- Global counter menggunakan Supabase + file JSON
- Statistik per user dan history disimpan di local storage (client-side)

## 🛡️ Privasi

- Tidak menyimpan file video/audio di server
- History hanya disimpan di device pengguna
- Tidak ada tracking pihak ketiga

## 🤝 Kontribusi

Pull request sangat diterima. Secara garis besar:

1. Fork repo
2. Buat branch baru
3. Commit perubahan
4. Buka Pull Request ke repo utama

## 🐛 Bug Report

Saat lapor bug, sertakan:

- Langkah reproduksi
- URL yang digunakan
- Expected vs actual behavior
- Info browser/device

## 📝 Kredit

- Template UI dan banyak komponen terinspirasi dari ekosistem **shadcn/ui**
- Developed by **Fusionify.ID**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌍 English Overview

**FusionTik** is a modern TikTok downloader web app that lets you:

- Download TikTok videos without watermark
- Download Photo Mode / image carousels
- Extract audio only (MP3)
- Track global download statistics
- Send error notifications to the owner via Telegram bot / email

### Tech

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase for global stats
- Nodemailer + Telegram Bot for alerts

### Run locally

```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
npm install
npm run dev
```

Then open <http://localhost:3000>.

## ⚖️ Important Notice

**Please use responsibly:**

- This is for personal use only
- Respect content creators' rights
- Follow TikTok's Terms of Service
- Don't use downloaded content commercially without permission

## 🙏 Thanks to These Amazing Tools

- [Next.js](https://nextjs.org/) - Our React foundation
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful styling made easy
- [shadcn/ui](https://ui.shadcn.com/) - Gorgeous UI components
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [TikSave.io](https://tiksave.io/) - TikTok content extraction

## 📞 Get in Touch

- **🌐 Website:** [Fusionify.ID](https://linktr.ee/fusionifytempest)
- **📁 Repository:** [FusionTik](https://github.com/jundy779/FusionTik)

---

**💙 Made with love by [FUSIONIFY DIGITAL.ID](https://linktr.ee/fusionifytempest)**
