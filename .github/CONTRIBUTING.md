# Contributing to FusionTik

Thank you for your interest in contributing to **FusionTik**! 🎉

We welcome contributions of all kinds — bug fixes, new features, documentation improvements, and more.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Convention](#commit-convention)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FusionTik.git
   cd FusionTik
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/jundy779/FusionTik.git
   ```

---

## Development Setup

### Prerequisites

- **Node.js 18+**
- **npm** (or pnpm / yarn)

### Install Dependencies

```bash
npm install
```

### Setup Environment

```bash
cp env.example .env.local
# Edit .env.local with your values (all optional for development)
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```

---

## How to Contribute

### 1. Create a Branch

Always create a new branch from `main` for your changes:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style (TypeScript, no `any` types)
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

Make sure the app builds and runs correctly:

```bash
npm run build
npm run lint
```

### 4. Commit Your Changes

Follow the [Commit Convention](#commit-convention) below.

### 5. Push and Open a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub targeting the `main` branch.

---

## Pull Request Guidelines

- **One PR per feature/fix** — keep PRs focused and small
- **Describe your changes** clearly in the PR description
- **Reference related issues** using `Fixes #123` or `Closes #123`
- **Screenshots** are appreciated for UI changes
- **All checks must pass** before merging

### PR Template

When opening a PR, please include:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## How to Test
Steps to test the changes.

## Screenshots (if applicable)
Add screenshots here.

## Related Issues
Fixes #(issue number)
```

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code refactoring (no feature/fix) |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons, etc. |
| `test` | Adding or updating tests |
| `chore` | Maintenance, dependency updates |
| `perf` | Performance improvements |
| `ci` | CI/CD changes |

### Examples

```bash
feat: add batch download for Photo Mode images
fix: prevent XSS in caption rendering
refactor: replace any types with proper interfaces
docs: update README with Supabase setup guide
chore: update Next.js to 15.5.9
```

---

## Reporting Bugs

Before reporting a bug, please:

1. Check if the issue already exists in [GitHub Issues](https://github.com/jundy779/FusionTik/issues)
2. Try to reproduce it with the latest version

When reporting, include:

- **Steps to reproduce** the bug
- **Expected behavior** vs **actual behavior**
- **TikTok URL** used (if relevant — you can anonymize it)
- **Browser and OS** information
- **Screenshots or error messages**

---

## Suggesting Features

We love feature suggestions! Please:

1. Check [existing issues](https://github.com/jundy779/FusionTik/issues) to avoid duplicates
2. Open a new issue with the label `enhancement`
3. Describe the feature clearly:
   - What problem does it solve?
   - How should it work?
   - Any implementation ideas?

---

## Project Structure

Before contributing, familiarize yourself with the codebase:

```
app/api/tiktok/route.ts     # Core download API — main logic here
app/api/global-stats/       # Global counter API
app/page.tsx                # Main UI page
components/video-preview.tsx # Download UI component
hooks/use-download-history.ts # History management
lib/download-utils.ts       # Download utilities
```

---

## Questions?

If you have questions, feel free to:

- Open a [GitHub Discussion](https://github.com/jundy779/FusionTik/discussions)
- Open an [Issue](https://github.com/jundy779/FusionTik/issues)

---

**Thank you for contributing to FusionTik! 💙**

*Made with love by [FUSIONIFY DIGITAL.ID](https://linktr.ee/fusionifytempest)*
