
import Link from 'next/link';
import Slideshow from './components/Slideshow';
import { STRAW_HATS } from '@/lib/db';

export default function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // LFI VULNERABILITY SIMULATION ON ROOT
  // Check if '?file=...' is present in the query parameters
  const file = searchParams?.file;

  if (typeof file === 'string' && (
    file === '/etc/passwd' ||
    file === '../../etc/passwd' ||
    file === '../../../../etc/passwd'
  )) {
    // Simulate /etc/passwd response directly on the page
    return (
      <pre style={{
        background: 'white',
        color: 'black',
        padding: '1rem',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        margin: 0,
        height: '100vh'
      }}>
        {`root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
user:x:1000:1000:user:/home/user:/bin/bash
luffy:x:1001:1001:luffy:/home/sunny:/bin/bash
kaido:x:1002:1002:kaido:/home/onigashima:/bin/zsh`}
      </pre>
    );
  }

  const slides = STRAW_HATS.map(bp => ({
    image: bp.image,
    title: bp.name,
    subtitle: bp.role
  }));

  const modules = [
    { title: "Recruit Crew", path: "/recruit", icon: "🤝", desc: "Build your own pirate crew or marine unit." },
    { title: "Bounty Database", path: "/bounties", icon: "💰", desc: "View pirate details." },
    { title: "World News", path: "/news", icon: "🗞️", desc: "Fetch external news via News Coo." },
    { title: "Nakama Forum", path: "/forum", icon: "💬", desc: "Leave messages for your crew." },
    { title: "Wanted Search", path: "/search", icon: "🔍", desc: "Find pirates by name." },
    { title: "Devil Fruit Encyclopedia", path: "/devil-fruits", icon: "🍇", desc: "Search fruit powers." },
    { title: "Marine HQ", path: "/marine-login", icon: "⚖️", desc: "Authorized personnel only." },
    { title: "Secret Intel", path: "/secret-intel", icon: "📜", desc: "Decipher Poneglyphs (JWT)." },
    { title: "World Govt Archives", path: "/archives", icon: "📁", desc: "View public records (LFI)." },
    { title: "Marie Jois", path: "/marie-jois", icon: "🏰", desc: "The Holy Land (Admin)." },
  ];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ borderBottom: 'none', marginBottom: '0.5rem', fontSize: '3rem' }}>
          STRAW HAT PIRATES
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
          "I'm going to become the King of the Pirates!"
        </p>

        {/* Slideshow */}
        <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <Slideshow slides={slides} />
        </div>
      </div>

      <div className="card-grid">
        <div className="card" style={{ background: '#fff3e0', borderTop: '5px solid orange' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏴‍☠️</div>
          <h3>Join the Adventure</h3>
          <p>Create an account to start recruiting your own crew!</p>
          <Link href="/register" className="btn">
            Register / Login
          </Link>
        </div>

        {modules.map((m) => (
          <div key={m.path} className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{m.icon}</div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            <Link href={m.path} className="btn">
              Explore
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
