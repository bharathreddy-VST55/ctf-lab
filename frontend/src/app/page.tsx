import Link from 'next/link';
import Slideshow from './components/Slideshow';
import { STRAW_HATS } from '@/lib/db';

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // LFI VULNERABILITY SIMULATION ON ROOT
  const resolvedParams = await searchParams;
  const file = resolvedParams?.file;
  if (typeof file === 'string' && (
    file === '/etc/passwd' ||
    file === '../../etc/passwd' ||
    file === '../../../../etc/passwd' ||
    file.includes('etc/passwd')
  )) {
    return (
      <pre style={{ background: '#000', color: '#0f0', padding: '1.5rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0, minHeight: '100vh' }}>
        {`root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
user:x:1000:1000:user:/home/user:/bin/bash
luffy:x:1001:1001:luffy:/home/sunny:/bin/bash
kaido:x:1002:1002:kaido:/home/onigashima:/bin/zsh
# FLAG: OPS{LFI_ROOT_OF_THE_WORLD}`}
      </pre>
    );
  }

  const slides = STRAW_HATS.map(bp => ({
    image: bp.image,
    title: bp.name,
    subtitle: bp.role
  }));

  const features = [
    { title: "Bounty Database", path: "/bounties", icon: "💰", desc: "Browse the World Government's official bounty registry for all known pirates.", badge: null },
    { title: "News Coo Network", path: "/news", icon: "🗞️", desc: "Live dispatches from the News Coo across all four seas and the Grand Line.", badge: "LIVE" },
    { title: "Crew Forum", path: "/forum", icon: "💬", desc: "Open message board — share intel with allies across the pirate world.", badge: null },
    { title: "Wanted Search", path: "/search", icon: "🔍", desc: "Search pirates by name, epithet or bounty range. Powered by our database.", badge: null },
    { title: "Transponder Snail", path: "/transponder-snail", icon: "🐌", desc: "Den Den Mushi communications hub for sea-to-sea messaging.", badge: null },
    { title: "Devil Fruit Index", path: "/devil-fruits", icon: "🍇", desc: "Encyclopaedia of all charted Devil Fruits and their users.", badge: null },
    { title: "World Govt Archives", path: "/archives", icon: "📁", desc: "Access classified World Government records and public documentation.", badge: "RESTRICTED" },
    { title: "Log Pose Station", path: "/log-pose", icon: "🧭", desc: "Route planner and island navigator for Grand Line traversal.", badge: null },
    { title: "Secret Intel", path: "/secret-intel", icon: "📜", desc: "Encrypted intelligence drops — decipher if you can.", badge: "ENCRYPTED" },
    { title: "Marie Jois Portal", path: "/marie-jois", icon: "🏰", desc: "Restricted Holy Land access. Gorosei clearance required.", badge: "CLASSIFIED" },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{
        textAlign: 'center',
        padding: '5rem 1rem 4rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(230,57,70,0.12) 0%, transparent 65%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '3rem',
        marginLeft: '-2rem',
        marginRight: '-2rem',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e63946', marginBottom: '16px' }}>
          ⚓ Grand Line Intelligence Network
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          THE GRAND LIBRARY
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#7eb8d4', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          The most comprehensive database of the Great Pirate Era — bounties, records, intel, and classified World Government archives.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/bounties" className="btn" style={{ width: 'auto', padding: '0.8rem 2rem' }}>Browse Bounties</Link>
          <Link href="/register" className="btn-outline">Join the Crew →</Link>
        </div>
      </div>

      {/* ── Slideshow ── */}
      <div style={{ maxWidth: '820px', margin: '0 auto 4rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <Slideshow slides={slides} />
      </div>

      {/* ── Stats bar ── */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '3.5rem', background: 'rgba(13,27,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        {[
          { n: '1,500+', l: 'Pirates Listed' },
          { n: '4', l: 'Blue Seas' },
          { n: '100+', l: 'Devil Fruits' },
          { n: '∞', l: 'Adventures' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '1.5rem 1rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f4d35e', lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: '11px', color: '#4a7a99', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Modules grid ── */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#4a7a99', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>
          Available Systems
        </h2>
      </div>

      <div className="card-grid">
        {/* Register CTA */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #1a0a0e 0%, #200d10 100%)', borderColor: 'rgba(230,57,70,0.25)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1 }}>🏴‍☠️</div>
          <h3 style={{ color: '#e63946' }}>Join the Adventure</h3>
          <p>Become a Pirate or Marine and start your journey across the Grand Line. Register to access all features.</p>
          <Link href="/register" className="btn" style={{ marginTop: '1rem' }}>Register / Login</Link>
        </div>

        {features.map((m) => (
          <div key={m.path} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '2rem', lineHeight: 1 }}>{m.icon}</div>
              {m.badge && (
                <span style={{
                  fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em',
                  padding: '2px 7px', borderRadius: '10px', textTransform: 'uppercase',
                  background: m.badge === 'LIVE' ? 'rgba(6,214,160,0.15)' : m.badge === 'CLASSIFIED' ? 'rgba(230,57,70,0.15)' : 'rgba(131,56,236,0.15)',
                  color: m.badge === 'LIVE' ? '#06d6a0' : m.badge === 'CLASSIFIED' ? '#e63946' : '#a78bfa',
                  border: `1px solid ${m.badge === 'LIVE' ? 'rgba(6,214,160,0.3)' : m.badge === 'CLASSIFIED' ? 'rgba(230,57,70,0.3)' : 'rgba(131,56,236,0.3)'}`,
                }}>{m.badge}</span>
              )}
            </div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            <Link href={m.path} className="btn" style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.06)', color: '#e8f4f8' }}>
              Access →
            </Link>
          </div>
        ))}

        {/* CTF Challenge Board CTA */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #0a0d1e 0%, #0d1232 100%)', borderColor: 'rgba(131,56,236,0.3)', gridColumn: 'span 1' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚩</div>
          <h3 style={{ color: '#a78bfa' }}>CTF Challenge Board</h3>
          <p style={{ color: '#7eb8d4' }}>18 challenges hidden across this platform. Exploit real vulnerabilities. Capture flags. Prove your worth.</p>
          <Link href="/challenges" className="btn" style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #6d28d9, #4c1d95)' }}>
            View Challenges →
          </Link>
        </div>
      </div>

      {/* ── Warning note ── */}
      <div style={{ marginTop: '3rem', padding: '1rem 1.5rem', background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: '10px', fontSize: '13px', color: '#7eb8d4', textAlign: 'center' }}>
        ⚠️ This is an <strong style={{ color: '#f4d35e' }}>intentionally vulnerable</strong> CTF lab. All data is fictional. Do not use against real systems.
      </div>
    </div>
  );
}
