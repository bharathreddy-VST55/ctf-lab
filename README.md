# 🏴‍☠️ Grand Library — CTF Lab

> **⚠️ INTENTIONALLY VULNERABLE — For educational & authorized security research only**

A realistic-looking CTF (Capture the Flag) web application with 40+ Nuclei-detectable vulnerabilities embedded naturally across the UI.

---

## 📁 Project Structure

```
ctf-lab/
├── frontend/          ← Next.js web app (React + TypeScript)
│   ├── src/
│   │   ├── app/       ← Pages (challenges, news, archives, etc.)
│   │   ├── app/api/   ← Next.js API routes (vulnerable endpoints)
│   │   └── middleware.ts ← 40+ fake vulnerable endpoints for Nuclei
│   ├── public/        ← Static files (robots.txt, crossdomain.xml)
│   ├── next.config.js ← CVE-fingerprint headers + dot-file rewrites
│   ├── vercel.json    ← Vercel deployment config
│   └── package.json
│
├── backend/           ← Python Flask vulnerable API (Docker-based)
│   ├── app.py         ← Flask app with SQLi, SSRF, LFI, XSS targets
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── reset.sh / reset.bat
│   └── README.md
│
├── .github/workflows/ ← CI/CD (GitHub Actions)
├── .gitignore
└── README.md          ← You are here
```

---

## 🚀 How to Run

### Option A — Frontend Only (Next.js)

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at → **http://localhost:3000**

---

### Option B — Backend Only (Python Flask + Docker)

```powershell
cd backend

# Using Docker (recommended)
docker-compose up --build

# OR run directly with Python
pip install -r requirements.txt
python app.py
```

Backend runs at → **http://localhost:5000**

---

### Option C — Full Stack (Both Together)

Open **two terminals**:

**Terminal 1 — Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

**Terminal 2 — Backend:**
```powershell
cd backend
docker-compose up --build
```

---

## ☁️ Deploying Frontend to Vercel

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy from the frontend folder
cd frontend
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and set:
- **Root Directory** → `frontend`
- Framework: **Next.js** (auto-detected)

---

## 🔍 Running Nuclei Scans

```powershell
# Scan local dev server
nuclei -u http://localhost:3000 -duc -rl 5

# Scan live Vercel deployment
nuclei -u https://your-app.vercel.app -duc -rl 10

# Save results
nuclei -u http://localhost:3000 -duc -j -o scan-results.json
```

---

## 🎯 CTF Challenges

Visit `/challenges` at **http://localhost:3000/challenges** for the full challenge board — 18 challenges across 7 categories:

| Category | Count |
|----------|-------|
| SQL Injection | 2 |
| XSS | 2 |
| SSRF | 2 |
| JWT / Auth | 2 |
| LFI | 2 |
| Exposed Endpoints | 4 |
| Misc | 4 |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Backend | Python 3, Flask, SQLite |
| Containerization | Docker, Docker Compose |
| Deployment | Vercel (frontend) |
| Scanning | Nuclei (local only) |
