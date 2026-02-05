
# Vulnerable CTF Lab

A deliberately vulnerable web application built with Next.js for pentesting practice.

**WARNING: DO NOT DEPLOY THIS TO A PUBLIC SERVER WITHOUT AUTHENTICATION OR IP RESTRICTIONS. IT IS VULNERABLE BY DESIGN.**

## Architecture
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS (Cyberpunk Theme)
- **Database**: In-memory (resets on restart)
- **Design**: CTF Challenges

## Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Features / Targets

| Challenge | Type | Vulnerability |
|-----------|------|---------------|
| `Reflected XSS` | Client/DOM | `dangerouslySetInnerHTML` with `q` param. |
| `Stored XSS` | Persistent | Comments API stores unsanitized HTML. |
| `DOM XSS` | Client | `location.hash` into `innerHTML`. |
| `IDOR` | API logic | `/api/users/[id]` lacks auth check. |
| `SQL Injection` | Logic | `/api/login-db` logic bypass. |
| `SSRF` | API | `/api/proxy` bypass blacklist. |
| `JWT` | Crypto | `None` alg or weak secret `secret123`. |
| `Open Redirect` | Logic | `/api/redirect` unvalidated. |
| `CORS` | Config | `Access-Control-Allow-Origin: *` |
| `Headers` | Config | Missing security headers, unsafe CSP. |

## Exploitation

See `SOLUTIONS.md` for flags and payloads.
