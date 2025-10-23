# 🚀 FusionTik - TikTok Downloader

> Download TikTok videos, images, and audio without watermarks. Fast, free, and user-friendly.

## 🌟 What is FusionTik?

FusionTik is your go-to solution for downloading TikTok content effortlessly. Whether you want to save videos, images, or extract audio, FusionTik makes it simple and fast. No watermarks, no hassle - just pure content downloading experience.

**🌐 Try it now:** [FusionTik Live](https://fusiontik.vercel.app)

### 🎯 Why Choose FusionTik?

- 🎬 **Clean Downloads** - Get TikTok videos without any watermarks
- 🖼️ **Photo Support** - Download image carousels and slideshows
- 🎵 **Audio Only** - Extract just the music you love
- 📱 **Works Everywhere** - Perfect on phone, tablet, or computer
- ⚡ **Lightning Fast** - Downloads in seconds, not minutes
- 🔒 **Your Privacy** - We don't store your data or track you
- 💾 **Smart History** - Never lose track of what you've downloaded
- 🆓 **Always Free** - No hidden costs, no premium tiers

## 🛠️ Built With Modern Tech

- **⚛️ Next.js 15** - The latest React framework for optimal performance
- **📘 TypeScript** - Type-safe development for reliability
- **🎨 Tailwind CSS** - Utility-first styling for beautiful designs
- **🧩 shadcn/ui** - High-quality, accessible UI components
- **🎭 Framer Motion** - Smooth animations and transitions
- **🔗 Lucide Icons** - Beautiful, consistent iconography
- **🌐 External APIs** - Reliable TikTok content extraction

## 🚀 Quick Start

### What You'll Need

- **Node.js 18+** (Latest LTS recommended)
- **Package Manager** (npm, yarn, or pnpm)

### Get Started

1. **Clone the repository:**
```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🎮 Running FusionTik

### Development

Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see FusionTik in action!

### Production

Build for production:
```bash
npm run build
npm run start
```

Customize the port:
```bash
PORT=8080 npm run start
```

## 📁 Project Structure

```
FusionTik/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── tiktok/
│   │       └── route.ts          # TikTok download API endpoint
│   ├── fonts/                    # Custom fonts
│   ├── favicon.ico               # Favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (main downloader)
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── tooltip.tsx
│   │   └── use-toast.ts
│   ├── navbar.tsx                # Navigation bar component
│   ├── result-buttons.tsx        # Download result buttons
│   ├── result-card.tsx           # Download history card
│   └── video-preview-modal.tsx   # Video preview modal
│
├── hooks/                        # Custom React hooks
│   └── use-download-history.ts   # Download history management hook
│
├── lib/                          # Utility libraries
│   └── utils.ts                  # Helper functions
│
├── public/                       # Static assets
│   └── ...
│
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore file
├── components.json              # shadcn/ui configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Project dependencies
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## 💡 How It Works

### 🎬 Video Downloads
- Paste any TikTok video URL
- Get clean MP4 files without watermarks
- Choose between standard and HD quality

### 🖼️ Image Collections
- Download entire photo carousels
- Save individual images or all at once
- Maintains original image quality

### 🎵 Audio Extraction
- Extract just the audio from videos
- Get MP3 files ready to use
- Perfect for music lovers

### 📚 Smart History
- Your downloads are saved locally
- Access previous downloads anytime
- Manage your collection easily

## 🛡️ Your Privacy Matters

- **🔒 Zero Data Storage** - We don't keep your downloads on our servers
- **💻 Local Only** - Your history stays on your device
- **👻 No Tracking** - We don't follow you around the internet
- **📖 Open Source** - You can see exactly what we do

## 🤝 Want to Help?

We'd love your contributions! Here's how:

1. **🍴 Fork this repo**
2. **🌿 Create a branch:**
   ```bash
   git checkout -b your-awesome-feature
   ```
3. **💾 Commit your changes:**
   ```bash
   git commit -m 'Add your awesome feature'
   ```
4. **🚀 Push and create a PR**

## 🐛 Found a Bug?

Help us fix it! Please include:
- What went wrong
- How to make it happen again
- What you expected vs what happened
- Screenshots if helpful
- Your device/browser info

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
- [TikMate API](https://tikmate.netlify.app/) - TikTok content extraction

## 📞 Get in Touch

- **🌐 Website:** [Fusionify.ID](https://fusionify.id)
- **📁 Repository:** [FusionTik](https://github.com/fusionify-id/FusionTik)

---

**💙 Made with love by [Fusionify.ID](https://fusionify.id)**
