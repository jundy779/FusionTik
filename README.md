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
  <a href="https://www.mongodb.com/atlas">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge" alt="Apache-2.0 License" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/jundy779/FusionTik/actions/workflows/ci.yml">
    <img src="https://github.com/jundy779/FusionTik/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://github.com/jundy779/FusionTik/actions/workflows/docker.yml">
    <img src="https://github.com/jundy779/FusionTik/actions/workflows/docker.yml/badge.svg" alt="Docker Build" />
  </a>
  <a href="https://github.com/jundy779/FusionTik/actions/workflows/codeql.yml">
    <img src="https://github.com/jundy779/FusionTik/actions/workflows/codeql.yml/badge.svg" alt="CodeQL" />
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

Built on Next.js • Powered by MongoDB Atlas • Written in TypeScript

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🏗️ Architecture Overview_

```mermaid
graph TD
    A["User Browser - Paste TikTok URL"] -->|Submit Form| B["Next.js Frontend - app/page.tsx"]
    B -->|POST /api/tiktok| C["API Route Handler - Validate URL"]
    C -->|Try Provider 1| D["Zell API - apizell.web.id"]
    C -->|Fallback| E["Sanka API - sankavollerei.com"]
    D -->|Success| F["Parse Response - video, audio, images"]
    E -->|Success| F
    D -->|Fail| E
    E -->|All Fail| G["notifyProviderFailure - Alert System"]
    G --> H["Telegram Bot - Instant Alert"]
    G --> I["Email SMTP - Nodemailer"]
    G --> J["Webhook POST - Custom Endpoint"]
    F -->|JSON Response| B
    B -->|Show VideoPreview| K["Download UI - Progress Bar"]
    K -->|downloadWithProgress| L["TikTok CDN - Direct Download"]
    B -->|POST /api/global-stats| M["Global Counter - Increment"]
    M -->|Atomic $inc| N[("MongoDB Atlas - global_stats")]
    M -->|Fallback| O[("JSON File - global-stats.json")]

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
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🧱 Software Architecture_

FusionTik menggunakan **Layered Architecture** dengan pemisahan yang jelas antara Presentation, Application, dan Infrastructure layer.

### Layer Overview

```mermaid
graph TB
    subgraph PRESENTATION["Presentation Layer - Client Side"]
        P1["app/page.tsx - Main Page"]
        P2["video-preview.tsx - Download UI"]
        P3["result-card.tsx - History Card"]
        P4["stats-card.tsx - Stats Display"]
        P5["navbar.tsx - Navigation"]
    end

    subgraph STATE["State Management Layer - React Hooks"]
        S1["use-download-history - localStorage"]
        S2["use-download-stats - Personal Stats"]
        S3["use-global-stats - Global Counter"]
    end

    subgraph APPLICATION["Application Layer - Next.js API Routes"]
        A1["POST /api/tiktok - Core Downloader"]
        A2["GET/POST /api/global-stats - Counter API"]
    end

    subgraph INFRASTRUCTURE["Infrastructure Layer"]
        I1["mongoClient.ts - DB Client"]
        I2["lib/download-utils.ts - Download Engine"]
        I3["lib/utils.ts - Utilities"]
    end

    subgraph EXTERNAL["External Services"]
        E1["Zell API - Provider 1"]
        E2["Sanka API - Provider 2"]
        E3["MongoDB Atlas"]
        E4["TikTok CDN - Media Files"]
        E5["Telegram API - Alerts"]
    end

    PRESENTATION --> STATE
    PRESENTATION --> APPLICATION
    APPLICATION --> INFRASTRUCTURE
    INFRASTRUCTURE --> EXTERNAL

    style PRESENTATION fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style STATE fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
    style APPLICATION fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style INFRASTRUCTURE fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style EXTERNAL fill:#efebe9,stroke:#795548,stroke-width:2px
```

### Component Interaction Diagram

```mermaid
graph LR
    subgraph PAGE["app/page.tsx"]
        FORM["Form Input"]
        RESULT["Result Display"]
        HIST["History Section"]
        STATS["Stats Section"]
    end

    subgraph HOOKS["React Hooks"]
        UDH["useDownloadHistory"]
        UDS["useDownloadStats"]
        UGS["useGlobalStats"]
    end

    subgraph COMPONENTS["Components"]
        VP["VideoPreview"]
        RC["ResultCard"]
        SC["StatsCard"]
    end

    subgraph API["API Routes"]
        TK["POST /api/tiktok"]
        GS["GET/POST /api/global-stats"]
    end

    subgraph LIB["Libraries"]
        DU["download-utils"]
        MC["mongoClient"]
    end

    FORM -->|submit| TK
    TK -->|response| RESULT
    RESULT --> VP
    VP --> DU
    HIST --> RC
    STATS --> SC
    PAGE --> UDH
    PAGE --> UDS
    PAGE --> UGS
    UDH -->|localStorage| UDS
    UGS -->|fetch| GS
    GS --> MC
    PAGE -->|increment| GS

    style PAGE fill:#e3f2fd,stroke:#2196f3
    style HOOKS fill:#e8f5e9,stroke:#4caf50
    style COMPONENTS fill:#fff3e0,stroke:#ff9800
    style API fill:#f3e5f5,stroke:#9c27b0
    style LIB fill:#efebe9,stroke:#795548
```

### Data Flow Diagram

```mermaid
flowchart LR
    subgraph INPUT["Input"]
        URL["TikTok URL"]
    end

    subgraph VALIDATION["Validation"]
        REGEX["Regex Check - tiktok.com"]
    end

    subgraph FETCH["Data Fetching"]
        Z["Zell Provider"]
        S["Sanka Provider"]
        PARSE["Parse and Normalize - title, creator, videos, audio, images"]
    end

    subgraph RESPONSE["Response"]
        VIDEO["Video Response - MP4 + Audio"]
        IMAGE["Image Response - Photos + Audio"]
    end

    subgraph STORAGE["Storage"]
        LS["localStorage - history and stats"]
        DB[("MongoDB Atlas - global_stats")]
    end

    subgraph DOWNLOAD["Download"]
        BLOB["Blob with Progress Bar"]
        OPEN["window.open fallback"]
    end

    URL --> REGEX
    REGEX -->|valid| Z
    REGEX -->|invalid| ERR["Error 400"]
    Z -->|success| PARSE
    Z -->|fail| S
    S -->|success| PARSE
    S -->|fail| ALERT["Alert System - Telegram/Email"]
    PARSE --> VIDEO
    PARSE --> IMAGE
    VIDEO --> LS
    IMAGE --> LS
    VIDEO --> DB
    IMAGE --> DB
    VIDEO --> BLOB
    IMAGE --> BLOB
    BLOB -->|CORS ok| BLOB
    BLOB -->|CORS fail| OPEN

    style INPUT fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    style VALIDATION fill:#fff3e0,stroke:#ff9800,color:#e65100
    style FETCH fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    style RESPONSE fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    style STORAGE fill:#efebe9,stroke:#795548,color:#3e2723
    style DOWNLOAD fill:#e0f2f1,stroke:#00695c,color:#004d40
```

### Design Patterns yang Digunakan

| Pattern | Implementasi | File |
|---------|-------------|------|
| **Provider Pattern** | Fallback chain Zell → Sanka | `app/api/tiktok/route.ts` |
| **Repository Pattern** | MongoDB ↔ File JSON fallback | `app/api/global-stats/route.ts` |
| **Custom Hook Pattern** | State management terpisah per concern | `hooks/` |
| **Compound Component** | VideoPreview + download buttons | `components/video-preview.tsx` |
| **Strategy Pattern** | Download: Blob progress vs window.open | `lib/download-utils.ts` |
| **Observer Pattern** | useRef untuk avoid stale closure | `hooks/use-download-history.ts` |

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
    participant U as User
    participant FE as Frontend
    participant API as API Server
    participant Z as Zell Provider
    participant S as Sanka Provider
    participant DB as MongoDB Atlas
    participant TG as Telegram

    U->>FE: Paste TikTok URL
    U->>FE: Click Download
    FE->>API: POST /api/tiktok
    API->>API: Validate URL regex
    API->>Z: GET url=tiktok_url

    alt Zell Success
        Z-->>API: video, music, images
        API-->>FE: type, video, music
    else Zell Failed
        Z-->>API: Error 5xx
        API->>S: GET apikey and url
        alt Sanka Success
            S-->>API: play, music, images
            API-->>FE: type, video, music
        else All Providers Failed
            S-->>API: Error
            API->>TG: Alert notification
            API-->>FE: error message
            FE-->>U: Show error message
        end
    end

    FE->>FE: Show VideoPreview component
    U->>FE: Click UNDUH MP4
    FE->>FE: downloadWithProgress
    FE-->>U: Progress 0 to 100 percent
    FE-->>U: File saved

    FE->>API: POST /api/global-stats
    API->>DB: $inc totalDownloads
    DB-->>API: new_total
    API-->>FE: totalDownloads N
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
│   ├── 📄 mongoClient.ts            # MongoDB client (global counter)
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
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
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
| **Database** | MongoDB Atlas | 6.x | Global download counter |
| **Email** | Nodemailer | 6.x | Alert notifikasi via SMTP |
| **Deployment** | Vercel | — | Hosting + Edge Functions |

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_⚡ Quick Start_

### Prasyarat

- **Node.js 18+**
- **npm / pnpm / yarn**
- Akun **MongoDB Atlas** (opsional, untuk global stats persisten)

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
# MongoDB (global download counter — production)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/fusiontik?retryWrites=true&w=majority
MONGODB_DB_NAME=fusiontik

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
| `MONGODB_URI` | ❌ | Connection string MongoDB Atlas untuk global stats |
| `MONGODB_DB_NAME` | ❌ | Nama database (default: `fusiontik`) |
| `KV_REST_API_URL` | ❌ | Vercel KV / Upstash Redis REST URL (rate limit terpusat) |
| `KV_REST_API_TOKEN` | ❌ | Token REST untuk rate limit |
| `ALLOWED_ORIGIN_DOMAINS` | ❌ | Domain tambahan untuk origin check API (comma-separated) |
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

> **Catatan:** Tanpa `MONGODB_URI`, global stats pakai `data/global-stats.json`. Tanpa `KV_REST_API_*`, rate limit fallback ke in-memory (cukup untuk dev lokal).

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🔐 Setup Vercel KV (Rate Limiting)_

Untuk rate limit terpusat di production (mencegah abuse API):

1. Vercel Dashboard → **Storage** → **Create Database** → **KV**
2. Connect ke project FusionTik — env `KV_REST_API_URL` & `KV_REST_API_TOKEN` otomatis terisi
3. Redeploy

Limit default per IP per menit:

| Endpoint | Limit |
|----------|-------|
| `POST /api/tiktok` | 10 |
| `GET /api/global-stats` | 60 |
| `POST /api/global-stats` | 10 |

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

### Deploy dengan Docker

Pull dan jalankan image dari GitHub Container Registry:

```bash
# Pull image terbaru
docker pull ghcr.io/jundy779/fusiontik:latest

# Jalankan container
docker run -d \
  --name fusiontik \
  -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e TELEGRAM_BOT_TOKEN=your_telegram_token \
  -e TELEGRAM_CHAT_ID=your_chat_id \
  ghcr.io/jundy779/fusiontik:latest
```

Atau build sendiri dari source:

```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
docker build -t fusiontik .
docker run -d --name fusiontik -p 3000:3000 fusiontik
```

Dengan Docker Compose:

```yaml
# docker-compose.yml
services:
  fusiontik:
    image: ghcr.io/jundy779/fusiontik:latest
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - MONGODB_DB_NAME=${MONGODB_DB_NAME:-fusiontik}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
    restart: unless-stopped
```

```bash
docker compose up -d
```

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🗄️ Setup MongoDB Atlas_

Untuk mengaktifkan global download counter yang persisten di production (Vercel):

**1. Buat cluster gratis** di [MongoDB Atlas](https://www.mongodb.com/atlas) → Database Access (user) → Network Access (allow `0.0.0.0/0` untuk Vercel).

**2. Salin connection string** → tambahkan ke `.env.local` dan Vercel Environment Variables:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fusiontik?retryWrites=true&w=majority
MONGODB_DB_NAME=fusiontik
```

**3. Collection otomatis dibuat** saat download pertama (`global_stats`, dokumen `_id: "counter"`). Tidak perlu SQL atau schema manual.

**4. Verifikasi** — buka `/api/global-stats`, response harus `"source": "mongodb"`.

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

_🔔 Sistem Notifikasi Error_

Ketika **semua provider API gagal**, FusionTik otomatis mengirim alert:

```mermaid
flowchart LR
    A["Provider Zell - FAILED"] --> B["Provider Sanka - FAILED"]
    B --> C{"notifyProviderFailure"}
    C --> D["Telegram Bot - Instant Alert"]
    C --> E["Email SMTP - Nodemailer"]
    C --> F["Webhook POST - Custom Endpoint"]
    C --> G["User Error UI - Friendly Message"]

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
Disimpan di **MongoDB Atlas** dengan atomic `$inc`. Fallback ke **file JSON** untuk development. Ditampilkan di hero section halaman utama.

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

### v2.5.3 — API Security
- ✅ Distributed rate limiting via Vercel KV / Upstash Redis
- ✅ Origin check + rate limit on `/api/global-stats` (GET & POST)
- ✅ Shared API guard for `/api/tiktok` and global stats

### v2.5.2 — MongoDB Counter
- ✅ Global download counter migrated to MongoDB Atlas (`MONGODB_URI`)
- ✅ Removed Supabase dependency and legacy code

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
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
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

<!-- RepoBeats Analytics -->
<p><strong>📊 Repository Activity</strong></p>
<img src="https://repobeats.axiom.co/api/embed/b5e5a75d5f5aee6aeae345e1d08db9ab4127c649.svg" width="700" alt="Repobeats analytics image"/>

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
