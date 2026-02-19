
import type { Metadata } from 'next'
import Link from 'next/link';
import './globals.css'

export const metadata: Metadata = {
  title: 'One Piece: The Grand Library',
  description: 'The ultimate intelligence database of the Great Pirate Era.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-wrapper">
          <nav className="navbar">
            <div className="container nav-content">
              <div className="logo">
                <Link href="/">
                  <span>🏴‍☠️ Grand Library</span>
                </Link>
              </div>
              <div className="nav-links">
                <Link href="/bounties">Bounties</Link>
                <Link href="/news">News</Link>
                <Link href="/forum">Forum</Link>
                <Link href="/archives">Archives</Link>
                <Link href="/search">Search</Link>
                <Link href="/challenges" style={{ color: '#a78bfa', fontWeight: 700 }}>🚩 Challenges</Link>
                <Link href="/marine-login" className="btn-small">Marine Login</Link>
              </div>
            </div>
          </nav>
          <main className="container main-content">
            {children}
          </main>
          <footer className="footer">
            <p style={{ marginBottom: '6px' }}>⚓ The Grand Library · Grand Line Intelligence Network</p>
            <p style={{ fontSize: '12px', opacity: 0.6 }}>
              ⚠️ INTENTIONALLY VULNERABLE CTF LAB – For educational & authorized security research only
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
