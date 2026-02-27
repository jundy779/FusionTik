<div align="center">

<img src="./public/placeholder-logo.svg" alt="FusionTik Logo" width="80" height="80" />

# ⚡ FusionTik

### TikTok Downloader Tanpa Watermark — Video · Foto · MP3

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)
[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/jundy779/FusionTik?utm_source=oss&utm_medium=github&utm_campaign=jundy779%2FFusionTik&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews&style=for-the-badge)](https://coderabbit.ai)

**🌐 Live Demo → [fusiontik.vercel.app](https://fusiontik.vercel.app)**

*Download video TikTok tanpa watermark, simpan Photo Mode, dan ekstrak audio MP3 — gratis, cepat, langsung dari browser.*

</div>

---

## 📖 Tentang FusionTik

**FusionTik** adalah web application modern untuk mendownload konten TikTok tanpa watermark. Dibangun dengan Next.js 15 App Router, TypeScript, dan Tailwind CSS — FusionTik menawarkan pengalaman download yang cepat, bersih, dan responsif di semua perangkat.

Tidak perlu install aplikasi. Tidak perlu login. Cukup paste link TikTok, klik Download, dan simpan konten ke perangkatmu.

---

## ✨ Key Features

| Fitur | Deskripsi |
|-------|-----------|
| 🎬 **Video Tanpa Watermark** | Download video TikTok dalam format MP4 tanpa logo watermark |
| 🖼️ **Photo Mode / Carousel** | Simpan semua gambar dari TikTok Photo Mode (slide) sekaligus |
| 🎵 **Audio Extraction** | Ekstrak dan download hanya audio/musik dari video (MP3) |
| 📊 **Download Progress** | Progress bar real-time saat proses download berlangsung |
| 📋 **Paste dari Clipboard** | Tombol paste langsung dari clipboard browser |
| 🕐 **Download History** | Riwayat download tersimpan lokal di perangkat (max 100 item) |
| 📈 **Personal Stats** | Statistik download pribadi: total, per tipe, per hari/minggu/bulan |
| 🌍 **Global Counter** | Counter total download seluruh pengguna di seluruh dunia |
| 🔔 **Error Alerts** | Notifikasi otomatis ke owner via Telegram / Email jika provider API gagal |
| 🌙 **Dark / Light Mode** | Tema gelap dan terang yang bisa disesuaikan |
| 📱 **Fully Responsive** | Optimal di HP, tablet, dan desktop |
| 🔒 **Privacy First** | Tidak ada file yang disimpan di server — history hanya di device kamu |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  app/page.tsx │    │  VideoPreview│    │  Download History │  │
│  │  (Main UI)   │───▶│  Component   │    │  (localStorage)  │  │
│  └──────┬───────┘    └──────────────┘    └──────────────────┘  │
│         │                                                        │
│         │ POST /api/tiktok                                       │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER (API Routes)                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  /api/tiktok/route.ts                    │   │
│  │                                                         │   │
│  │  1. Validate URL (regex)                                │   │
│  │  2. Try Provider 1 (Zell API)  ──────────────────────▶ │──▶ https://apizell.web.id
│  │     └─ If fail ▼                                        │   │
│  │  3. Try Provider 2 (Sanka API) ──────────────────────▶ │──▶ https://sankavollerei.com
│  │     └─ If fail ▼                                        │   │
│  │  4. notifyProviderFailure()                             │   │
│  │     ├─ Webhook POST                                     │   │
│  │     ├─ Telegram Bot API                                 │   │
│  │     └─ SMTP Email                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              /api/global-stats/route.ts                  │   │
│  │                                                         │   │
│  │  GET  → Read counter (Supabase → file fallback)         │   │
│  │  POST → Increment counter (atomic RPC → read-write)     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         STORAGE LAYER                           │
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────────────────┐ │
│  │    Supabase DB   │         │   data/global-stats.json     │ │
│  │  (Production)    │◀───────▶│   (Development Fallback)     │ │
│  │  global_stats    │         │                              │ │
│  └──────────────────┘         └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Download Flow (Message Flow)

```
User                    Frontend              API Server           Provider
 │                          │                     │                    │
 │  Paste TikTok URL        │                     │                    │
 │─────────────────────────▶│                     │                    │
 │                          │                     │                    │
 │  Click "Download"        │                     │                    │
 │─────────────────────────▶│                     │                    │
 │                          │  POST /api/tiktok   │                    │
 │                          │────────────────────▶│                    │
 │                          │                     │  GET Zell API      │
 │                          │                     │───────────────────▶│
 │                          │                     │                    │
 │                          │                     │◀───────────────────│
 │                          │                     │  (success / fail)  │
 │                          │                     │                    │
 │                          │                     │  [if fail] GET Sanka API
 │                          │                     │───────────────────▶│
 │                          │                     │◀───────────────────│
 │                          │                     │                    │
 │                          │◀────────────────────│                    │
 │                          │  { type, video,     │                    │
 │                          │    music, images }  │                    │
 │                          │                     │                    │
 │  Show VideoPreview       │                     │                    │
 │◀─────────────────────────│                     │                    │
 │                          │                     │                    │
 │  Click "UNDUH MP4"       │                     │                    │
 │─────────────────────────▶│                     │                    │
 │                          │  downloadWithProgress(url, filename)     │
 │                          │──────────────────────────────────────────▶
 │  Progress: 0% → 100%     │                     │                    │
 │◀─────────────────────────│                     │                    │
 │                          │                     │                    │
 │  File saved to device ✓  │                     │                    │
 │◀─────────────────────────│                     │                    │
 │                          │  POST /api/global-stats (increment)      │
 │                          │────────────────────▶│                    │
 │                          │                     │  Supabase RPC      │
 │                          │                     │  increment_global_downloads
```

---

## 🗂️ Struktur Project

```
FusionTik/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📄 layout.tsx                # Root layout + SEO metadata + PWA manifest
│   ├── 📄 page.tsx                  # Halaman utama downloader
│   ├── 📄 globals.css               # Global styles + custom animations
│   ├── 📄 robots.ts                 # SEO robots.txt
│   ├── 📄 sitemap.ts                # SEO sitemap.xml
│   │
│   ├── 📁 api/
│   │   ├── 📁 tiktok/
│   │   │   └── 📄 route.ts          # ⭐ Core API: fetch + fallback provider + alerts
│   │   └── 📁 global-stats/
│   │       └── 📄 route.ts          # Global download counter (Supabase + file)
│   │
│   ├── 📁 faq/                      # Halaman FAQ
│   ├── 📁 feedback/                 # Halaman Feedback
│   ├── 📁 help-center/              # Halaman Help Center
│   ├── 📁 privacy/                  # Halaman Privacy Policy
│   └── 📁 terms/                    # Halaman Terms of Service
│
├── 📁 components/
│   ├── 📄 navbar.tsx                # Navigation bar + dark mode toggle
│   ├── 📄 video-preview.tsx         # ⭐ Preview video/foto + download buttons
│   ├── 📄 result-card.tsx           # Card untuk history item
│   ├── 📄 result-buttons.tsx        # Download action buttons
│   ├── 📄 stats-card.tsx            # Personal statistics card
│   ├── 📄 video-preview-modal.tsx   # Modal preview
│   ├── 📄 mode-toggle.tsx           # Dark/light mode toggle
│   ├── 📄 theme-provider.tsx        # Theme context provider
│   └── 📁 ui/                       # shadcn/ui components (50+ komponen)
│
├── 📁 hooks/
│   ├── 📄 use-download-history.ts   # ⭐ History management (localStorage, max 100)
│   ├── 📄 use-download-stats.ts     # Personal download statistics
│   ├── 📄 use-global-stats.ts       # Global counter state
│   ├── 📄 use-mobile.tsx            # Mobile detection hook
│   └── 📄 use-toast.ts              # Toast notification hook
│
├── 📁 lib/
│   ├── 📄 download-utils.ts         # ⭐ Download dengan progress tracking
│   ├── 📄 supabase.ts               # Supabase client (nullable)
│   └── 📄 utils.ts                  # Tailwind merge utilities
│
├── 📁 data/
│   └── 📄 global-stats.json         # Fallback counter (development)
│
├── 📁 public/                       # Static assets + PWA manifest
├── 📄 next.config.mjs               # Next.js config + CSP headers
├── 📄 tailwind.config.ts            # Tailwind configuration
├── 📄 tsconfig.json                 # TypeScript configuration
└── 📄 env.example                   # Template environment variables
```

---

## 🛠️ Tech Stack

| Layer | Teknologi | Versi | Fungsi |
|-------|-----------|-------|--------|
| **Framework** | Next.js | 15 | App Router, SSR, API Routes |
| **Language** | TypeScript | 5 | Type safety end-to-end |
| **Styling** | Tailwind CSS | 3 | Utility-first CSS |
| **UI Components** | shadcn/ui | latest | 50+ komponen siap pakai |
| **Animation** | Framer Motion | latest | Animasi halus & interaktif |
| **Database** | Supabase | 2.x | Global download counter |
| **Email** | Nodemailer | 6.x | Alert notifikasi via SMTP |
| **Deployment** | Vercel | — | Hosting + Edge Functions |

---

## 🚀 Quick Start

### Prasyarat

- **Node.js 18+**
- **npm / pnpm / yarn**
- Akun **Supabase** (opsional, untuk global stats)

### 1. Clone & Install

```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
npm install
```

### 2. Setup Environment

```bash
cp env.example .env.local
```

Edit `.env.local` dan isi nilai yang diperlukan:

```env
# Supabase (untuk global stats — opsional)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Notifikasi error (semua opsional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your-app-password
ALERT_EMAIL_TO=owner@domain.com
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 4. Build Production

```bash
npm run build
npm run start
```

Custom port:
```bash
PORT=8080 npm run start
```

---

## ⚙️ Environment Variables

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | URL project Supabase untuk global stats |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ | Anon key Supabase |
| `ZELL_TIKTOK_API_URL` | ❌ | Override URL provider Zell (default: apizell.web.id) |
| `SANKA_TIKTOK_API_URL` | ❌ | Override URL provider Sanka |
| `SANKA_TIKTOK_API_KEY` | ❌ | API key untuk provider Sanka |
| `ALERT_WEBHOOK_URL` | ❌ | Webhook URL untuk notifikasi error |
| `TELEGRAM_BOT_TOKEN` | ❌ | Token bot Telegram untuk alert |
| `TELEGRAM_CHAT_ID` | ❌ | Chat ID penerima notifikasi Telegram |
| `SMTP_HOST` | ❌ | SMTP host untuk email alert |
| `SMTP_PORT` | ❌ | SMTP port (587 untuk TLS, 465 untuk SSL) |
| `SMTP_USER` | ❌ | Email pengirim |
| `SMTP_PASS` | ❌ | Password / App Password email |
| `ALERT_EMAIL_TO` | ❌ | Email penerima alert |

> **Catatan:** Jika Supabase tidak dikonfigurasi, global stats akan menggunakan file `data/global-stats.json` sebagai fallback (cocok untuk development).

---

## 🌐 Deployment

### Deploy ke Vercel (Recommended)

1. Fork repo ini ke akun GitHub kamu
2. Buka [vercel.com/import](https://vercel.com/import) dan pilih repo **FusionTik**
3. Set environment variables di dashboard Vercel
4. Klik **Deploy** — Vercel akan build dan host otomatis

### Deploy ke VPS / Server Sendiri

```bash
# Clone dan install
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
npm install

# Setup environment
cp env.example .env.local
nano .env.local  # isi nilai yang diperlukan

# Build dan jalankan
npm run build
npm run start
```

Gunakan process manager seperti **PM2** untuk production:

```bash
npm install -g pm2
pm2 start "npm run start" --name fusiontik
pm2 save
pm2 startup
```

---

## 🗄️ Setup Supabase (Opsional)

Untuk mengaktifkan global download counter yang persisten:

### 1. Buat Tabel

```sql
CREATE TABLE global_stats (
  id BIGINT PRIMARY KEY DEFAULT 1,
  total_downloads BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial row
INSERT INTO global_stats (id, total_downloads) VALUES (1, 0);
```

### 2. Buat RPC Function (Atomic Increment)

```sql
CREATE OR REPLACE FUNCTION increment_global_downloads()
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  new_total BIGINT;
BEGIN
  UPDATE global_stats
  SET total_downloads = total_downloads + 1,
      updated_at = NOW()
  WHERE id = 1
  RETURNING total_downloads INTO new_total;
  
  RETURN new_total;
END;
$$;
```

### 3. Set Row Level Security

```sql
-- Allow public read
ALTER TABLE global_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON global_stats
  FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON global_stats
  FOR UPDATE USING (true);
```

---

## 🔔 Sistem Notifikasi Error

FusionTik mengirim notifikasi otomatis ke owner ketika **semua provider API gagal**:

```
Provider Zell gagal
       ↓
Provider Sanka gagal
       ↓
notifyProviderFailure() dipanggil
       ↓
┌──────────────────────────────────┐
│  Kirim ke semua channel aktif:   │
│  ✓ Webhook (JSON POST)           │
│  ✓ Telegram Bot                  │
│  ✓ Email (SMTP)                  │
└──────────────────────────────────┘
       ↓
User mendapat pesan error yang rapi
```

**Contoh pesan Telegram:**
```
⚠️ FusionTik downloader error
URL: https://www.tiktok.com/@user/video/123
Error: Zell API returned 503: Service Unavailable
Time: 2025-01-15T10:30:00.000Z
```

---

## 📊 Statistik & Analytics

### Global Stats
- Disimpan di **Supabase** (production) dengan atomic increment via RPC
- Fallback ke **file JSON** (`data/global-stats.json`) untuk development
- Ditampilkan di hero section halaman utama

### Personal Stats (Per User)
Disimpan di **localStorage** browser, meliputi:

| Metrik | Deskripsi |
|--------|-----------|
| Total Downloads | Jumlah total konten yang didownload |
| Videos Downloaded | Jumlah video yang didownload |
| Images Downloaded | Jumlah foto/carousel yang didownload |
| Audio Extracted | Jumlah audio yang diekstrak |
| Today Downloads | Download hari ini |
| This Week | Download 7 hari terakhir |
| This Month | Download 30 hari terakhir |
| Most Active Day | Hari dengan download terbanyak |
| Average/Day | Rata-rata download per hari |

---

## 🔒 Keamanan & Privasi

- ✅ **Tidak ada file yang disimpan di server** — semua konten langsung dari CDN TikTok
- ✅ **History hanya di device pengguna** — tidak ada tracking server-side
- ✅ **CSP Headers** — Content Security Policy ketat di semua response
- ✅ **Security Headers** — HSTS, X-Frame-Options, X-Content-Type-Options, dll
- ✅ **XSS Protection** — Caption TikTok di-escape sebelum render HTML
- ✅ **No Third-party Tracking** — Tidak ada Google Analytics atau tracker pihak ketiga

---

## 🤝 Kontribusi

Pull request sangat diterima! Berikut cara berkontribusi:

1. **Fork** repo ini
2. Buat **branch baru**: `git checkout -b feature/nama-fitur`
3. **Commit** perubahan: `git commit -m "feat: tambah fitur X"`
4. **Push** ke branch: `git push origin feature/nama-fitur`
5. Buka **Pull Request** ke branch `main`

### Konvensi Commit

```
feat:     Fitur baru
fix:      Bug fix
refactor: Refactoring kode
docs:     Update dokumentasi
style:    Perubahan styling
chore:    Maintenance / dependency update
```

---

## 🐛 Bug Report

Saat melaporkan bug, sertakan:

- [ ] Langkah-langkah untuk mereproduksi
- [ ] URL TikTok yang digunakan (jika relevan)
- [ ] Expected vs actual behavior
- [ ] Screenshot / error message
- [ ] Info browser dan OS

---

## 📝 Changelog

### v2.1.0 (Latest)
- ✅ Refactor: hapus semua `any` type → proper TypeScript interfaces
- ✅ Security: XSS fix pada caption rendering (HTML entity escaping)
- ✅ Fix: atomic Supabase counter increment via RPC
- ✅ Fix: sequential image download (cegah browser popup blocking)
- ✅ Improvement: `response.ok` check pada semua fetch calls
- ✅ Improvement: history limit 100 item + `useRef` fix untuk infinite loop
- ✅ Improvement: konsistensi `downloadWithProgress` di semua download handler
- ✅ Security: hapus exposed Supabase key dari `env.example`

### v2.0.0
- ✅ Dual provider dengan fallback (Zell → Sanka)
- ✅ Notifikasi error multi-channel (Webhook + Telegram + Email)
- ✅ Global download counter dengan Supabase
- ✅ Download progress tracking dengan ReadableStream
- ✅ Personal download statistics
- ✅ Dark/Light mode

---

## ⚖️ Legal & Disclaimer

> **Gunakan dengan bijak:**
> - Layanan ini untuk penggunaan **pribadi** saja
> - Hormati hak cipta kreator konten
> - Jangan gunakan konten yang didownload untuk tujuan komersial tanpa izin
> - Ikuti [Terms of Service TikTok](https://www.tiktok.com/legal/page/global/terms-of-service/en)
> - FusionTik **tidak berafiliasi** dengan TikTok atau ByteDance Ltd.

---

## 🙏 Credits & Acknowledgements

- [**Next.js**](https://nextjs.org/) — React framework yang luar biasa
- [**shadcn/ui**](https://ui.shadcn.com/) — Komponen UI yang indah dan accessible
- [**Tailwind CSS**](https://tailwindcss.com/) — Utility-first CSS framework
- [**Framer Motion**](https://www.framer.com/motion/) — Animasi yang smooth
- [**Supabase**](https://supabase.com/) — Open source Firebase alternative
- [**Radix UI**](https://www.radix-ui.com/) — Headless UI primitives

---

<div align="center">

**💙 Made with love by [FUSIONIFY DIGITAL.ID](https://linktr.ee/fusionifytempest)**

[![GitHub](https://img.shields.io/badge/GitHub-jundy779%2FFusionTik-181717?style=flat-square&logo=github)](https://github.com/jundy779/FusionTik)
[![Website](https://img.shields.io/badge/Website-fusiontik.vercel.app-blue?style=flat-square&logo=vercel)](https://fusiontik.vercel.app)
[![Linktree](https://img.shields.io/badge/Linktree-fusionifytempest-39E09B?style=flat-square&logo=linktree)](https://linktr.ee/fusionifytempest)

*© 2025 Fusionify.ID — MIT License*

</div>
