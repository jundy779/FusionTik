<div align="center">

<!-- Wave Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=FusionTik&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=fff&desc=TikTok%20Downloader%20Tanpa%20Watermark&descAlignY=55&descSize=18" width="100%" />

<br/>

_⚡ FusionTik_

**Modern TikTok Downloader — Video · Photo Mode · MP3**

<p align="center">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://supabase.com/">
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License" />
  </a>
</p>

<p align="center">
  <a href="https://fusiontik.vercel.app">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-fusiontik.vercel.app-blue?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/jundy779/FusionTik/stargazers">
    <img src="https://img.shields.io/github/stars/jundy779/FusionTik?style=for-the-badge&logo=github&color=gold" alt="Stars" />
  </a>
  <a href="https://github.com/jundy779/FusionTik/issues">
    <img src="https://img.shields.io/github/issues/jundy779/FusionTik?style=for-the-badge&logo=github&color=red" alt="Issues" />
  </a>
</p>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

</div>

_🌸 Overview_

**FusionTik** adalah web application modern untuk mendownload konten TikTok tanpa watermark. Dibangun dengan **Next.js 15 App Router**, **TypeScript**, dan **Tailwind CSS** — FusionTik menawarkan pengalaman download yang cepat, bersih, dan responsif di semua perangkat.

Tidak perlu install aplikasi. Tidak perlu login. Cukup **paste link TikTok**, klik **Download**, dan simpan konten ke perangkatmu.

Built on Next.js • Powered by Supabase • Written in TypeScript

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🏗️ Architecture Overview_

```mermaid
graph TD
    A[User Browser<br/><sub>Paste TikTok URL</sub>] -->|Submit Form| B[Next.js Frontend<br/><sub>app/page.tsx</sub>]
    B -->|POST /api/tiktok| C[API Route Handler<br/><sub>Validate URL</sub>]
    C -->|Try Provider 1| D[Zell API<br/><sub>apizell.web.id</sub>]
    C -->|Fallback| E[Sanka API<br/><sub>sankavollerei.com</sub>]
    D -->|Success| F[Parse Response<br/><sub>video/audio/images</sub>]
    E -->|Success| F
    D -->|Fail| E
    E -->|All Fail| G[notifyProviderFailure<br/><sub>Alert System</sub>]
    G --> H[Telegram Bot<br/><sub>Instant Alert</sub>]
    G --> I[Email SMTP<br/><sub>Nodemailer</sub>]
    G --> J[Webhook POST<br/><sub>Custom Endpoint</sub>]
    F -->|JSON Response| B
    B -->|Show VideoPreview| K[Download UI<br/><sub>Progress Bar</sub>]
    K -->|downloadWithProgress| L[TikTok CDN<br/><sub>Direct Download</sub>]
    B -->|POST /api/global-stats| M[Global Counter<br/><sub>Increment</sub>]
    M -->|Atomic RPC| N[(Supabase DB<br/><sub>global_stats</sub>)]
    M -->|Fallback| O[(JSON File<br/><sub>data/global-stats.json</sub>)]

    style A fill:#e3f2fd,stroke:#2196f3,stroke-width:3px,color:#0d47a1
    style B fill:#e8f5e9,stroke:#4caf50,stroke-width:3px,color:#1b5e20
    style C fill:#fff3e0,stroke:#ff9800,stroke-width:3px,color:#e65100
    style D fill:#f3e5f5,stroke:#9c27b0,stroke-width:3px,color:#4a148c
    style E fill:#e8eaf6,stroke:#3f51b5,stroke-width:3px,color:#1a237e
    style F fill:#e0f2f1,stroke:#00695c,stroke-width:3px,color:#004d40
    style G fill:#fce4ec,stroke:#e91e63,stroke-width:3px,color:#880e4f
    style H fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#1b5e20
    style I fill:#fff3e0,stroke:#ff9800,stroke-width:2px,color:#e65100
    style J fill:#e3f2fd,stroke:#2196f3,stroke-width:2px,color:#0d47a1
    style K fill:#fff8e1,stroke:#ff8f00,stroke-width:3px,color:#ff6f00
    style L fill:#efebe9,stroke:#795548,stroke-width:3px,color:#3e2723
    style M fill:#f5f5f5,stroke:#616161,stroke-width:2px,color:#424242
    style N fill:#d7ccc8,stroke:#5d4037,stroke-width:2px,color:#3e2723
    style O fill:#d7ccc8,stroke:#5d4037,stroke-width:2px,color:#3e2723

    linkStyle default stroke:#666,stroke-width:2px
    linkStyle 0 stroke:#2196f3,stroke-width:3px
    linkStyle 12 stroke:#4caf50,stroke-width:3px
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_✨ Key Features_

<table>
<tr>
<td align="center" width="33%">

**🎬 Video Tanpa Watermark**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Video%20Camera.png" width="50" />

Download video TikTok
<br>dalam format MP4
<br>tanpa logo watermark

</td>
<td align="center" width="33%">

**🖼️ Photo Mode**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Framed%20Picture.png" width="50" />

Simpan semua gambar
<br>dari TikTok carousel
<br>sekaligus dalam sekali klik

</td>
<td align="center" width="33%">

**🎵 Audio Extraction**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Musical%20Notes.png" width="50" />

Ekstrak dan download
<br>hanya audio/musik
<br>dalam format MP3

</td>
</tr>
<tr>
<td align="center" width="33%">

**📊 Download Progress**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" width="50" />

Progress bar real-time
<br>saat proses download
<br>berlangsung

</td>
<td align="center" width="33%">

**🕐 Download History**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/File%20Folder.png" width="50" />

Riwayat download
<br>tersimpan lokal
<br>di perangkatmu (max 100)

</td>
<td align="center" width="33%">

**🌍 Global Counter**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Europe-Africa.png" width="50" />

Counter total download
<br>seluruh pengguna
<br>di seluruh dunia

</td>
</tr>
<tr>
<td align="center" width="33%">

**🔔 Error Alerts**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bell.png" width="50" />

Notifikasi otomatis
<br>via Telegram & Email
<br>jika provider API gagal

</td>
<td align="center" width="33%">

**🌙 Dark Mode**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Night%20with%20Stars.png" width="50" />

Tema gelap dan terang
<br>yang bisa disesuaikan
<br>dengan preferensimu

</td>
<td align="center" width="33%">

**🔒 Privacy First**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png" width="50" />

Tidak ada file tersimpan
<br>di server — history
<br>hanya di device kamu

</td>
</tr>
</table>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🔄 Message Flow_

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FE as 🖥️ Frontend
    participant API as ⚙️ API Server
    participant Z as 🔌 Zell Provider
    participant S as 🔌 Sanka Provider
    participant DB as 🗄️ Supabase
    participant TG as 📱 Telegram

    U->>FE: Paste TikTok URL
    U->>FE: Click "Download"
    FE->>API: POST /api/tiktok { url }
    API->>API: Validate URL (regex)
    API->>Z: GET ?url=tiktok_url
    
    alt Zell Success
        Z-->>API: { video, music, images }
        API-->>FE: { type, video, music }
    else Zell Failed
        Z-->>API: Error 5xx
        API->>S: GET ?apikey=...&url=tiktok_url
        alt Sanka Success
            S-->>API: { play, music, images }
            API-->>FE: { type, video, music }
        else All Providers Failed
            S-->>API: Error
            API->>TG: ⚠️ Alert notification
            API-->>FE: { error: "Gangguan..." }
            FE-->>U: Show error message
        end
    end

    FE->>FE: Show VideoPreview component
    U->>FE: Click "UNDUH MP4"
    FE->>FE: downloadWithProgress(url, filename)
    FE-->>U: Progress: 0% → 100%
    FE-->>U: File saved ✓

    FE->>API: POST /api/global-stats
    API->>DB: RPC increment_global_downloads()
    DB-->>API: new_total
    API-->>FE: { totalDownloads: N }
    FE-->>U: Update counter display
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🗂️ Project Structure_

```
FusionTik/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📄 layout.tsx                # Root layout + SEO metadata + PWA
│   ├── 📄 page.tsx                  # ⭐ Halaman utama downloader
│   ├── 📄 globals.css               # Global styles + custom animations
│   ├── 📄 robots.ts                 # SEO robots.txt
│   ├── 📄 sitemap.ts                # SEO sitemap.xml
│   │
│   ├── 📁 api/
│   │   ├── 📁 tiktok/
│   │   │   └── 📄 route.ts          # ⭐ Core API: fetch + fallback + alerts
│   │   └── 📁 global-stats/
│   │       └── 📄 route.ts          # Global download counter
│   │
│   ├── 📁 faq/                      # Halaman FAQ
│   ├── 📁 feedback/                 # Halaman Feedback
│   ├── 📁 help-center/              # Halaman Help Center
│   ├── 📁 privacy/                  # Privacy Policy
│   └── 📁 terms/                    # Terms of Service
│
├── 📁 components/
│   ├── 📄 navbar.tsx                # Navigation bar + dark mode toggle
│   ├── 📄 video-preview.tsx         # ⭐ Preview + download buttons
│   ├── 📄 result-card.tsx           # History item card
│   ├── 📄 result-buttons.tsx        # Download action buttons
│   ├── 📄 stats-card.tsx            # Personal statistics card
│   ├── 📄 video-preview-modal.tsx   # Modal preview
│   ├── 📄 mode-toggle.tsx           # Dark/light mode toggle
│   ├── 📄 theme-provider.tsx        # Theme context provider
│   └── 📁 ui/                       # shadcn/ui (50+ komponen)
│
├── 📁 hooks/
│   ├── 📄 use-download-history.ts   # ⭐ History (localStorage, max 100)
│   ├── 📄 use-download-stats.ts     # Personal download statistics
│   ├── 📄 use-global-stats.ts       # Global counter state
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

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🛠️ Tech Stack_

<table>
<tr>
<td align="center" width="25%">

**Framework**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" width="40" />

</td>
<td align="center" width="25%">

**Language**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" width="40" />

</td>
<td align="center" width="25%">

**Styling**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Artist%20Palette.png" width="40" />

</td>
<td align="center" width="25%">

**Database**

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/File%20Folder.png" width="40" />

</td>
</tr>
</table>

<p align="left">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=nodemailer&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

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

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_⚡ Quick Start_

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

Edit `.env.local`:

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

# Custom port
PORT=8080 npm run start
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_⚙️ Environment Variables_

| Variable | Wajib | Deskripsi |
|----------|:-----:|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | URL project Supabase untuk global stats |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ | Anon key Supabase |
| `ZELL_TIKTOK_API_URL` | ❌ | Override URL provider Zell |
| `SANKA_TIKTOK_API_URL` | ❌ | Override URL provider Sanka |
| `SANKA_TIKTOK_API_KEY` | ❌ | API key untuk provider Sanka |
| `ALERT_WEBHOOK_URL` | ❌ | Webhook URL untuk notifikasi error |
| `TELEGRAM_BOT_TOKEN` | ❌ | Token bot Telegram untuk alert |
| `TELEGRAM_CHAT_ID` | ❌ | Chat ID penerima notifikasi Telegram |
| `SMTP_HOST` | ❌ | SMTP host untuk email alert |
| `SMTP_PORT` | ❌ | SMTP port (587 TLS / 465 SSL) |
| `SMTP_USER` | ❌ | Email pengirim |
| `SMTP_PASS` | ❌ | Password / App Password email |
| `ALERT_EMAIL_TO` | ❌ | Email penerima alert |

> **Catatan:** Jika Supabase tidak dikonfigurasi, global stats menggunakan `data/global-stats.json` sebagai fallback (cocok untuk development).

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🌐 Deployment_

### Deploy ke Vercel (Recommended)

1. Fork repo ini ke akun GitHub kamu
2. Buka [vercel.com/import](https://vercel.com/import) dan pilih repo **FusionTik**
3. Set environment variables di dashboard Vercel
4. Klik **Deploy** — Vercel akan build dan host otomatis

### Deploy ke VPS / Server Sendiri

```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
npm install
cp env.example .env.local
# Edit .env.local sesuai kebutuhan
npm run build
npm run start
```

**Gunakan PM2 untuk production:**

```bash
npm install -g pm2
pm2 start "npm run start" --name fusiontik
pm2 save && pm2 startup
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🗄️ Setup Supabase_

Untuk mengaktifkan global download counter yang persisten:

**1. Buat Tabel**

```sql
CREATE TABLE global_stats (
  id BIGINT PRIMARY KEY DEFAULT 1,
  total_downloads BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO global_stats (id, total_downloads) VALUES (1, 0);
```

**2. Buat RPC Function (Atomic Increment)**

```sql
CREATE OR REPLACE FUNCTION increment_global_downloads()
RETURNS BIGINT LANGUAGE plpgsql AS $$
DECLARE new_total BIGINT;
BEGIN
  UPDATE global_stats
  SET total_downloads = total_downloads + 1, updated_at = NOW()
  WHERE id = 1
  RETURNING total_downloads INTO new_total;
  RETURN new_total;
END;
$$;
```

**3. Row Level Security**

```sql
ALTER TABLE global_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON global_stats FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON global_stats FOR UPDATE USING (true);
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🔔 Sistem Notifikasi Error_

Ketika **semua provider API gagal**, FusionTik otomatis mengirim alert:

```mermaid
flowchart LR
    A[Provider Zell ❌] --> B[Provider Sanka ❌]
    B --> C{notifyProviderFailure}
    C --> D[📱 Telegram Bot]
    C --> E[📧 Email SMTP]
    C --> F[🔗 Webhook POST]
    C --> G[🖥️ User Error UI]

    style A fill:#fce4ec,stroke:#e91e63,color:#880e4f
    style B fill:#fce4ec,stroke:#e91e63,color:#880e4f
    style C fill:#fff3e0,stroke:#ff9800,color:#e65100
    style D fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    style E fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    style F fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    style G fill:#efebe9,stroke:#795548,color:#3e2723
```

**Contoh pesan Telegram yang dikirim:**
```
⚠️ FusionTik downloader error
URL: https://www.tiktok.com/@user/video/123
Error: Zell API returned 503: Service Unavailable
Time: 2025-01-15T10:30:00.000Z
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_📊 Statistik & Analytics_

### Global Stats
Disimpan di **Supabase** dengan atomic increment via RPC. Fallback ke **file JSON** untuk development. Ditampilkan di hero section halaman utama.

### Personal Stats (Per User)
Disimpan di **localStorage** browser:

| Metrik | Deskripsi |
|--------|-----------|
| 📥 Total Downloads | Jumlah total konten yang didownload |
| 🎬 Videos Downloaded | Jumlah video yang didownload |
| 🖼️ Images Downloaded | Jumlah foto/carousel yang didownload |
| 🎵 Audio Extracted | Jumlah audio yang diekstrak |
| 📅 Today Downloads | Download hari ini |
| 📆 This Week | Download 7 hari terakhir |
| 🗓️ This Month | Download 30 hari terakhir |
| 🏆 Most Active Day | Hari dengan download terbanyak |
| 📈 Average/Day | Rata-rata download per hari |

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🔒 Keamanan & Privasi_

- ✅ **Tidak ada file tersimpan di server** — semua konten langsung dari CDN TikTok
- ✅ **History hanya di device pengguna** — tidak ada tracking server-side
- ✅ **CSP Headers** — Content Security Policy ketat di semua response
- ✅ **Security Headers** — HSTS, X-Frame-Options, X-Content-Type-Options, dll
- ✅ **XSS Protection** — Caption TikTok di-escape sebelum render HTML
- ✅ **No Third-party Tracking** — Tidak ada Google Analytics atau tracker pihak ketiga

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_📝 Changelog_

### v2.1.0 — Clean Code & Security Update
- ✅ **Refactor**: hapus semua `any` type → proper TypeScript interfaces
- ✅ **Security**: XSS fix pada caption rendering (HTML entity escaping)
- ✅ **Fix**: atomic Supabase counter increment via RPC
- ✅ **Fix**: sequential image download (cegah browser popup blocking)
- ✅ **Improvement**: `response.ok` check pada semua fetch calls
- ✅ **Improvement**: history limit 100 item + `useRef` fix untuk infinite loop
- ✅ **Improvement**: konsistensi `downloadWithProgress` di semua download handler
- ✅ **Security**: hapus exposed Supabase key dari `env.example`

### v2.0.0 — Multi-Provider & Alerts
- ✅ Dual provider dengan fallback (Zell → Sanka)
- ✅ Notifikasi error multi-channel (Webhook + Telegram + Email)
- ✅ Global download counter dengan Supabase
- ✅ Download progress tracking dengan ReadableStream
- ✅ Personal download statistics
- ✅ Dark/Light mode

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🤝 Contributing_

<div align="center">

**Contributions are welcome!** 💖

</div>

1. **Fork** repo ini
2. Buat **branch baru**: `git checkout -b feature/nama-fitur`
3. **Commit** perubahan: `git commit -m "feat: tambah fitur X"`
4. **Push** ke branch: `git push origin feature/nama-fitur`
5. Buka **Pull Request** ke branch `main`

**Konvensi Commit:**

| Prefix | Deskripsi |
|--------|-----------|
| `feat:` | Fitur baru |
| `fix:` | Bug fix |
| `refactor:` | Refactoring kode |
| `docs:` | Update dokumentasi |
| `style:` | Perubahan styling |
| `chore:` | Maintenance / dependency update |

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_⚖️ Legal & Disclaimer_

> [!WARNING]
> **Gunakan dengan bijak:**
> - Layanan ini untuk penggunaan **pribadi** saja
> - Hormati hak cipta kreator konten
> - Jangan gunakan konten yang didownload untuk tujuan komersial tanpa izin
> - Ikuti [Terms of Service TikTok](https://www.tiktok.com/legal/page/global/terms-of-service/en)
> - FusionTik **tidak berafiliasi** dengan TikTok atau ByteDance Ltd.

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_💖 Acknowledgements_

**Core Technologies**

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

**Community & Contributors**

- 💚 Semua [contributors](https://github.com/jundy779/FusionTik/graphs/contributors) yang membuat ini mungkin
- 🌍 Komunitas open-source yang luar biasa
- ⭐ Semua yang sudah memberikan bintang di repo ini

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<div align="center">

<!-- Star History -->
<p><strong>🌟 Star History</strong></p>
<a href="https://star-history.com/#jundy779/FusionTik&Date">
  <img src="https://api.star-history.com/svg?repos=jundy779/FusionTik&type=Date" width="600" alt="Star History Chart"/>
</a>

<hr/>

<p><strong>Maintained with ❤️ by <a href="https://linktr.ee/fusionifytempest">FUSIONIFY DIGITAL.ID</a></strong></p>

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer&text=Thank%20You!&fontSize=40&fontColor=ffffff&animation=twinkling&fontAlignY=75" width="100%" alt="Footer"/>

</div>
