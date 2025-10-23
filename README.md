# 🎵 FusionTik - TikTok Downloader

> A modern, fast, and free TikTok video & image downloader web application built with Next.js 14, TypeScript, and Tailwind CSS.

## 📋 Overview

FusionTik is a free and open-source web application that allows users to download TikTok videos, images, and audio files without watermarks. Built with modern web technologies, it provides a fast, responsive, and user-friendly interface for downloading TikTok content.

**Live Demo:** [Visit FusionTik](https://fusiontik.vercel.app)

### ✨ Key Features

- 🎥 **Video Download** - Download TikTok videos in MP4 format without watermarks
- 📸 **Image Download** - Download TikTok photo posts (carousel/slideshow)
- 🎵 **Audio Extraction** - Extract and download audio/music from TikTok videos as MMP
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Modern UI** - Beautiful gradient design with smooth animations
- 📊 **Download History** - Keep track of your downloaded content (stored locally)
- ⚡ **Fast Processing** - Quick video processing and download
- 🔒 **Privacy Focused** - No data stored on servers, all history saved locally
- 🆓 **Completely Free** - No subscriptions, no hidden fees

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API:** TikMate API (external)

## 📦 Installation

### Prerequisites

- Node.js 18+ or later
- npm, yarn, or pnpm package manager

### Clone the Repository

```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
```

### Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

Build the application for production:

```bash
npm run build
# or
yarn build
```

### Production Server

Run the production server:

```bash
export PORT=3000
npm run start
# or
export PORT=${SERVER_PORT} && npm run start
```

You can customize the port by changing the `PORT` environment variable:

```bash
export PORT=8080 && npm run start
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

## 🎯 Features in Detail

### Video Download
- Supports standard TikTok video posts
- Downloads without watermark
- Multiple quality options (SD/HD)

### Image Download
- Supports TikTok photo carousels/slideshows
- Downloads all images in a post
- High-quality image preservation

### Audio Extraction
- Extract audio from any TikTok video
- MP3 format output
- Preserves original audio quality

### Download History
- Automatically saves download history
- Stored locally in browser (localStorage)
- Easy access to previously downloaded content
- Delete individual items or clear all history

## 🔒 Privacy & Security

- **No Server Storage:** Videos and images are not stored on our servers
- **Local History:** Download history is saved only in your browser
- **No Tracking:** We don't track or collect user data
- **Open Source:** Full transparency - review the code yourself

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for personal use only. Please respect content creators' rights and TikTok's Terms of Service. Do not use downloaded content for commercial purposes without permission from the original creator.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TikMate API](https://tikmate.netlify.app/) - TikTok media extraction

## 📧 Contact

- Website: [Fusionify.ID](https://fusionify.id)
- Repository: [FusionTik](https://github.com/fusionify-id/FusionTik)

---

**Made with ❤️ by [Fusionify.ID](https://fusionify.id)**
