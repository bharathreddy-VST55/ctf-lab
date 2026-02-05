
import type { Metadata } from 'next'
import Link from 'next/link';
import './globals.css'

export const metadata: Metadata = {
  title: 'One Piece: The Grand Library',
  description: 'The ultimate database of the Great Pirate Era.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-wrapper">
          <nav className="navbar">
            <div className="container nav-content">
              <div className="logo">
                <Link href="/">
                  <span>🏴‍☠️ GRAND LIBRARY</span>
                </Link>
              </div>
              <div className="nav-links">
                <Link href="/bounties">Bounties</Link>
                <Link href="/news">News Coo</Link>
                <Link href="/forum">Pirate Forum</Link>
                <Link href="/search">Wanted Search</Link>
                <Link href="/marine-login" className="btn-small" style={{ background: 'white', color: 'var(--grand-line-blue)' }}>Marine Login</Link>
              </div>
            </div>
          </nav>
          <main className="container main-content">
            {children}
          </main>
          <footer className="footer">
            <p>The One Piece is Real! | © 2024 World Government (Just kidding)</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
