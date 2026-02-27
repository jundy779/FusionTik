# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported |
|---------|-----------|
| 2.x (latest) | ✅ Yes |
| 1.x | ❌ No |

---

## Reporting a Vulnerability

> [!CAUTION]
> **DO NOT** report security vulnerabilities through public GitHub Issues, Pull Requests, or Discussions.

If you discover a security vulnerability in FusionTik, please report it responsibly:

### 📧 Contact

**Email:** fusiontik.official@gmail.com

**Subject:** `[SECURITY] Brief description of the vulnerability`

### 📝 What to Include

Please provide as much detail as possible:

1. **Type of vulnerability** (e.g., XSS, CSRF, injection, information disclosure)
2. **Affected component** (e.g., `/api/tiktok`, `video-preview.tsx`)
3. **Steps to reproduce** the vulnerability
4. **Potential impact** — what could an attacker do?
5. **Suggested fix** (optional but appreciated)
6. **Your contact information** for follow-up

### ⏱️ Response Timeline

| Stage | Timeline |
|-------|----------|
| Initial acknowledgment | Within 48 hours |
| Vulnerability assessment | Within 7 days |
| Fix development | Within 14 days (depending on severity) |
| Public disclosure | After fix is deployed |

---

## Security Measures in FusionTik

FusionTik implements the following security measures:

### HTTP Security Headers

All responses include:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-XSS-Protection: 1; mode=block
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; ...
```

### Input Validation

- TikTok URLs are validated with a strict regex before processing
- Request body is type-checked before use
- HTML entities are escaped before rendering user-provided content

### Data Privacy

- No user data is stored on the server
- Download history is stored only in the user's browser (localStorage)
- No third-party tracking or analytics

### Dependency Security

- Dependencies are regularly updated
- `npm audit` is run periodically to check for known vulnerabilities

---

## Known Limitations

The following are known limitations that are **not** considered security vulnerabilities:

- **CORS on TikTok CDN**: Direct browser downloads may fall back to `window.open()` due to TikTok CDN CORS policies. This is expected behavior.
- **Rate limiting**: The current version does not implement server-side rate limiting. This is a planned improvement.
- **File-based stats**: The `data/global-stats.json` fallback is not suitable for production multi-instance deployments.

---

## Responsible Disclosure

We follow responsible disclosure practices:

1. Reporter notifies us privately
2. We acknowledge and investigate
3. We develop and test a fix
4. We deploy the fix
5. We credit the reporter (with their permission) in the release notes

Thank you for helping keep FusionTik and its users safe! 🔒

---

*© 2025 Fusionify.ID — FusionTik Security Policy*
