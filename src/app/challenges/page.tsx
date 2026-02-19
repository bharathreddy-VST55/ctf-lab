'use client';

import { useState } from 'react';
import Link from 'next/link';

const CHALLENGES = [
    // ─ Web Exploitation ──────────────────────────────────────────────────────
    {
        id: 'sqli-01',
        title: 'Wanted: Dead or Alive',
        category: 'SQL Injection',
        difficulty: 'Easy',
        points: 100,
        desc: 'The Marine HQ search system stores wanted poster data. Rumor has it the query is not quite… sanitized.',
        location: '/search',
        hint: "Try adding a single quote (' ) to the search term and watch what happens to the query.",
        flag: 'OPS{SQL_INJECTED_THE_BUSTER_CALL}',
        icon: '🔍',
        tags: ['sqli', 'error-based', 'web'],
    },
    {
        id: 'xss-01',
        title: 'The Pirate\'s Echo',
        category: 'XSS',
        difficulty: 'Easy',
        points: 75,
        desc: 'The Transponder Snail station echoes back every message to confirm delivery. No filtering. No escape.',
        location: '/transponder-snail',
        hint: 'What if your message was a <script> tag?',
        flag: 'OPS{XSS_STOLE_THE_PIRATE_KING_COOKIE}',
        icon: '📡',
        tags: ['xss', 'reflected', 'web'],
    },
    {
        id: 'lfi-01',
        title: 'World Govt Archives — Classified',
        category: 'LFI',
        difficulty: 'Medium',
        points: 150,
        desc: 'The Archives let you "view" public documents. But some paths are not meant for public eyes…',
        location: '/archives',
        hint: 'Try the filename: ../../../../etc/passwd',
        flag: 'OPS{LFI_ROOT_OF_THE_WORLD}',
        icon: '📁',
        tags: ['lfi', 'path-traversal', 'web'],
    },
    {
        id: 'ssrf-01',
        title: 'News Coo — Internal Dispatch',
        category: 'SSRF',
        difficulty: 'Hard',
        points: 250,
        desc: 'News Coo fetches news from external URLs on your behalf. What if it fetched something… internal?',
        location: '/news',
        hint: 'Try fetching http://169.254.169.254/latest/meta-data/ via the news source input.',
        flag: 'OPS{SSRF_LOOTED_AWS_METADATA}',
        icon: '🗞️',
        tags: ['ssrf', 'cloud', 'metadata'],
    },
    {
        id: 'open-redirect-01',
        title: 'Log Pose Redirect',
        category: 'Open Redirect',
        difficulty: 'Easy',
        points: 75,
        desc: 'The Log Pose navigation system redirects ships to their next destination. Destination is never validated.',
        location: '/log-pose',
        hint: "Watch the ?next= parameter. It will redirect anywhere you tell it.",
        flag: 'OPS{REDIRECT_TO_RAFTEL}',
        icon: '🧭',
        tags: ['redirect', 'phishing', 'web'],
    },
    {
        id: 'auth-01',
        title: 'Marine HQ — Unauthorized Entry',
        category: 'Broken Authentication',
        difficulty: 'Easy',
        points: 100,
        desc: 'The Marine database login was configured in a hurry. Someone forgot to change the default credentials.',
        location: '/marine-login',
        hint: "Try obvious combinations: admin/admin, akainu/justice, marine/marine123…",
        flag: 'OPS{MARINE_HEADQUARTERS_BREACHED}',
        icon: '⚖️',
        tags: ['auth', 'default-creds', 'web'],
    },
    {
        id: 'jwt-01',
        title: 'Secret Intel — Token Forgery',
        category: 'JWT Exploit',
        difficulty: 'Hard',
        points: 300,
        desc: 'Intel is locked behind a JWT. If you can forge a token with the right role claim, the secret is yours.',
        location: '/secret-intel',
        hint: "Decode the JWT at jwt.io. Check the algorithm — 'none' is always worth trying.",
        flag: 'OPS{JWT_NONE_ALGORITHM_IS_DANGEROUS}',
        icon: '🔐',
        tags: ['jwt', 'auth', 'web'],
    },
    {
        id: 'priv-esc-01',
        title: 'Marie Jois — Gorosei Access',
        category: 'Privilege Escalation',
        difficulty: 'Hard',
        points: 300,
        desc: 'Marie Jois is protected. Only Gorosei may enter. But what if you could sign your own clearance?',
        location: '/marie-jois',
        hint: "Forge a session token with role: 'gorosei'. JWT with weak secret? Try 'onepiece'.",
        flag: 'OPS{THE_VOID_CENTURY_REVEALED}',
        icon: '🏰',
        tags: ['priv-esc', 'jwt', 'auth'],
    },
    {
        id: 'forum-01',
        title: 'Crew Forum — Stored Payload',
        category: 'Stored XSS',
        difficulty: 'Medium',
        points: 200,
        desc: 'The Pirate Forum stores messages from all crew members. What a lovely place to leave a permanent gift.',
        location: '/forum',
        hint: "Post a message containing a <script> tag. Does it execute for everyone who reads it?",
        flag: 'OPS{STORED_XSS_IN_FORUM_YARRGH}',
        icon: '💬',
        tags: ['xss', 'stored', 'web'],
    },

    // ─ Misconfiguration / Recon ───────────────────────────────────────────────
    {
        id: 'recon-env',
        title: 'Exposed Treasure Map (.env)',
        category: 'Misconfiguration',
        difficulty: 'Easy',
        points: 50,
        desc: 'Every ship keeps a manifest. Some captains leave it on deck. Check common paths.',
        location: '/.env',
        hint: "Navigate directly to /.env — some ships leave their manifest out in the open.",
        flag: 'OPS{ENV_FILE_EXPOSED_TO_WORLD}',
        icon: '🗺️',
        tags: ['recon', 'misconfiguration', 'secrets'],
    },
    {
        id: 'recon-git',
        title: 'The Lost Repository (.git/config)',
        category: 'Misconfiguration',
        difficulty: 'Easy',
        points: 50,
        desc: 'Pirates keep logs of their voyages. Development crews sometimes forget to hide theirs.',
        location: '/.git/config',
        hint: "Navigate to /.git/config — if the directory is exposed, there may be credentials inside.",
        flag: 'OPS{GIT_CONFIG_HAS_CREDENTIALS}',
        icon: '📋',
        tags: ['recon', 'misconfiguration', 'git'],
    },
    {
        id: 'recon-config',
        title: 'Config in the Open (config.json)',
        category: 'Misconfiguration',
        difficulty: 'Easy',
        points: 50,
        desc: 'API keys and database passwords should never live in a public-facing JSON file…',
        location: '/config.json',
        hint: "Try /config.json — developers often leave this accessible with sensitive values.",
        flag: 'OPS{CONFIG_JSON_LEAKED_SECRETS}',
        icon: '⚙️',
        tags: ['recon', 'misconfiguration', 'api-keys'],
    },
    {
        id: 'recon-uploads',
        title: 'Unguarded Hold (/uploads)',
        category: 'Misconfiguration',
        difficulty: 'Easy',
        points: 50,
        desc: 'The cargo hold door was left open. Walk right in and see what is being stored.',
        location: '/uploads/',
        hint: "Check /uploads/ for a directory listing. What files are there?",
        flag: 'OPS{DIRECTORY_LISTING_EXPOSED}',
        icon: '📦',
        tags: ['recon', 'directory-listing', 'web'],
    },

    // ─ CVE Fingerprinting ─────────────────────────────────────────────────────
    {
        id: 'cve-jenkins',
        title: 'The Admiral\'s Shipyard (Jenkins)',
        category: 'CVE Fingerprint',
        difficulty: 'Medium',
        points: 125,
        desc: 'Every response from this server contains a signature. Something old, something vulnerable.',
        location: '/',
        hint: "Inspect HTTP response headers on any page. Look for X-Jenkins and check the version against CVE databases.",
        flag: 'OPS{JENKINS_2150_CVE_FINGERPRINTED}',
        icon: '⚙️',
        tags: ['cve', 'fingerprint', 'headers'],
    },
    {
        id: 'cve-log4j',
        title: 'The Devil\'s Lookup (Log4Shell)',
        category: 'CVE Fingerprint',
        difficulty: 'Hard',
        points: 275,
        desc: 'A well-known RCE vulnerability lurks in the logging stack. A JNDI lookup is all it takes.',
        location: '/api/vuln-lab/log4j',
        hint: "Send a request with a JNDI exploit string in the User-Agent. Check CVE-2021-44228.",
        flag: 'OPS{LOG4SHELL_DENIES_JNDI_LOOKUP}',
        icon: '💥',
        tags: ['cve', 'log4j', 'rce', 'jndi'],
    },
    {
        id: 'cve-wp',
        title: 'The Plugin Conspiracy',
        category: 'CVE Fingerprint',
        difficulty: 'Medium',
        points: 125,
        desc: 'An outdated plugin announces its version to the world. That version has a known CVE.',
        location: '/api/vuln-lab/wp-plugin',
        hint: "Call the endpoint and check the version returned. Look up CVE-2022-XXXX.",
        flag: 'OPS{WP_PLUGIN_CVE_FINGERPRINTED}',
        icon: '🔌',
        tags: ['cve', 'wordpress', 'fingerprint'],
    },

    // ─ Miscellaneous ──────────────────────────────────────────────────────────
    {
        id: 'cors-01',
        title: 'Cross-Origin Heist (CORS)',
        category: 'Misconfiguration',
        difficulty: 'Medium',
        points: 150,
        desc: 'This site allows cross-origin requests from anywhere. From your own page you can steal another user\'s data.',
        location: '/api/*',
        hint: "Check the Access-Control-Allow-Origin header. It says *. Now write a cross-origin fetch from another domain.",
        flag: 'OPS{CORS_WILDCARD_ALLOWS_THEFT}',
        icon: '🌐',
        tags: ['cors', 'misconfiguration', 'headers'],
    },
];

const CATEGORIES = ['All', ...Array.from(new Set(CHALLENGES.map(c => c.category)))];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const diffColor: Record<string, string> = {
    Easy: '#06d6a0',
    Medium: '#f4d35e',
    Hard: '#e63946',
};

const catColors = ['#8338ec', '#06d6a0', '#f4d35e', '#e63946', '#0096c7', '#ff9f1c', '#6d6875', '#3d405b'];

export default function ChallengesPage() {
    const [catFilter, setCatFilter] = useState('All');
    const [diffFilter, setDiffFilter] = useState('All');
    const [solved, setSolved] = useState<Record<string, string>>({});
    const [inputFlag, setInputFlag] = useState<Record<string, string>>({});
    const [showHint, setShowHint] = useState<Record<string, boolean>>({});
    const [showFlag, setShowFlag] = useState<Record<string, boolean>>({});

    const filtered = CHALLENGES.filter(c =>
        (catFilter === 'All' || c.category === catFilter) &&
        (diffFilter === 'All' || c.difficulty === diffFilter)
    );

    const totalPts = CHALLENGES.reduce((a, c) => a + c.points, 0);
    const earnedPts = CHALLENGES.filter(c => solved[c.id] === 'correct').reduce((a, c) => a + c.points, 0);
    const solvedCount = Object.values(solved).filter(v => v === 'correct').length;

    const submitFlag = (id: string, flag: string) => {
        const ch = CHALLENGES.find(c => c.id === id);
        if (!ch) return;
        setSolved(prev => ({ ...prev, [id]: inputFlag[id]?.trim() === ch.flag ? 'correct' : 'wrong' }));
    };

    return (
        <div>
            {/* ── Hero ── */}
            <div style={{ textAlign: 'center', padding: '3rem 1rem 2.5rem', background: 'radial-gradient(ellipse at 50% 0%, rgba(131,56,236,0.1) 0%, transparent 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem', marginLeft: '-2rem', marginRight: '-2rem' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', color: '#a78bfa', marginBottom: '12px', textTransform: 'uppercase' }}>
                    🚩 Capture The Flag
                </div>
                <h1 style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
                    Grand Line CTF — Challenge Board
                </h1>
                <p style={{ color: '#7eb8d4', maxWidth: '540px', margin: '0 auto 2rem', fontSize: '15px', lineHeight: 1.7 }}>
                    18 vulnerabilities are hidden across this platform. Exploit real weaknesses, capture flags, and prove you can navigate the Grand Line of cybersecurity.
                </p>

                {/* Score counter */}
                <div style={{ display: 'inline-flex', gap: '32px', background: 'rgba(13,27,42,0.8)', border: '1px solid rgba(131,56,236,0.3)', borderRadius: '12px', padding: '1rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a78bfa' }}>{earnedPts}</div>
                        <div style={{ fontSize: '10px', color: '#4a7a99', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Points Earned</div>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#06d6a0' }}>{solvedCount}</div>
                        <div style={{ fontSize: '10px', color: '#4a7a99', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Challenges Solved</div>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f4d35e' }}>{CHALLENGES.length}</div>
                        <div style={{ fontSize: '10px', color: '#4a7a99', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Challenges</div>
                    </div>
                </div>
            </div>

            {/* ── Filters ── */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#4a7a99', marginRight: '4px', fontWeight: 600 }}>CATEGORY:</span>
                {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCatFilter(c)} style={{
                        padding: '5px 14px', borderRadius: '20px', border: '1px solid',
                        borderColor: catFilter === c ? '#a78bfa' : 'rgba(255,255,255,0.1)',
                        background: catFilter === c ? 'rgba(131,56,236,0.15)' : 'transparent',
                        color: catFilter === c ? '#a78bfa' : '#6b7280',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{c}</button>
                ))}
                <span style={{ fontSize: '12px', color: '#4a7a99', margin: '0 4px', fontWeight: 600 }}>DIFFICULTY:</span>
                {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => setDiffFilter(d)} style={{
                        padding: '5px 14px', borderRadius: '20px', border: '1px solid',
                        borderColor: diffFilter === d ? (diffColor[d] || '#a78bfa') : 'rgba(255,255,255,0.1)',
                        background: diffFilter === d ? 'rgba(131,56,236,0.08)' : 'transparent',
                        color: diffFilter === d ? (diffColor[d] || '#a78bfa') : '#6b7280',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{d}</button>
                ))}
            </div>

            {/* ── Challenges Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px,1fr))', gap: '16px' }}>
                {filtered.map((ch, idx) => {
                    const isSolved = solved[ch.id] === 'correct';
                    const isWrong = solved[ch.id] === 'wrong';

                    return (
                        <div key={ch.id} className="card" style={{
                            borderColor: isSolved ? 'rgba(6,214,160,0.4)' : 'rgba(255,255,255,0.07)',
                            background: isSolved ? 'linear-gradient(135deg,rgba(6,214,160,0.06),rgba(13,27,42,1))' : undefined,
                        }}>
                            {/* Card header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '1.8rem', lineHeight: 1, marginTop: '2px' }}>{ch.icon}</div>
                                    <div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: catColors[idx % catColors.length], textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                                {ch.category}
                                            </span>
                                            <span style={{
                                                fontSize: '9px', fontWeight: 800, padding: '1px 6px', borderRadius: '8px',
                                                color: diffColor[ch.difficulty], border: `1px solid ${diffColor[ch.difficulty]}40`,
                                                background: `${diffColor[ch.difficulty]}12`,
                                            }}>{ch.difficulty}</span>
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '15px', color: isSolved ? '#06d6a0' : '#e8f4f8' }}>{ch.title}</h3>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isSolved ? '#06d6a0' : '#f4d35e', lineHeight: 1 }}>
                                        {isSolved ? '✓' : ch.points}
                                    </div>
                                    <div style={{ fontSize: '9px', color: '#4a7a99', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        {isSolved ? 'SOLVED' : 'pts'}
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: '13px', color: '#7eb8d4', lineHeight: 1.65, marginBottom: '14px' }}>{ch.desc}</p>

                            {/* Location */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '7px 10px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}>
                                <span style={{ fontSize: '10px', color: '#06d6a0', fontWeight: 700 }}>TARGET</span>
                                <code style={{ fontSize: '11px', color: '#7dd3fc', background: 'none', padding: 0 }}>
                                    {ch.location.startsWith('/api') ? ch.location : `http://localhost:3000${ch.location}`}
                                </code>
                                <Link href={ch.location} style={{ marginLeft: 'auto', fontSize: '10px', color: '#a78bfa', fontWeight: 700 }} target="_blank">
                                    Open →
                                </Link>
                            </div>

                            {/* Tags */}
                            <div style={{ marginBottom: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {ch.tags.map(t => (
                                    <span key={t} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,150,199,0.1)', color: '#7eb8d4', border: '1px solid rgba(0,150,199,0.15)' }}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Hint toggle */}
                            {!isSolved && (
                                <button onClick={() => setShowHint(p => ({ ...p, [ch.id]: !p[ch.id] }))} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', padding: '0 0 10px', fontWeight: 600 }}>
                                    {showHint[ch.id] ? '▼ Hide Hint' : '▶ Show Hint'}
                                </button>
                            )}
                            {showHint[ch.id] && !isSolved && (
                                <div style={{ fontSize: '12px', color: '#9ca3af', background: 'rgba(131,56,236,0.08)', border: '1px solid rgba(131,56,236,0.2)', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px', fontStyle: 'italic' }}>
                                    💡 {ch.hint}
                                </div>
                            )}

                            {/* Flag submission */}
                            {!isSolved ? (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <input
                                        value={inputFlag[ch.id] || ''}
                                        onChange={e => setInputFlag(p => ({ ...p, [ch.id]: e.target.value }))}
                                        placeholder="OPS{your_flag_here}"
                                        style={{ flex: 1, marginBottom: 0, borderColor: isWrong ? '#e63946' : undefined, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}
                                        onKeyDown={e => e.key === 'Enter' && submitFlag(ch.id, inputFlag[ch.id] || '')}
                                    />
                                    <button onClick={() => submitFlag(ch.id, inputFlag[ch.id] || '')} style={{
                                        padding: '0 16px', borderRadius: '8px', border: 'none',
                                        background: '#8338ec', color: '#fff', fontWeight: 700, cursor: 'pointer',
                                        fontSize: '13px', fontFamily: 'inherit', flexShrink: 0,
                                        transition: 'background 0.2s',
                                    }}>
                                        Submit
                                    </button>
                                </div>
                            ) : (
                                <div style={{ padding: '10px 14px', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.3)', borderRadius: '8px', color: '#06d6a0', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
                                    🎉 Challenge Solved! +{ch.points} pts
                                </div>
                            )}
                            {isWrong && (
                                <div style={{ fontSize: '11px', color: '#e63946', marginTop: '6px', fontWeight: 600 }}>
                                    ✗ Incorrect flag. Keep trying!
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Nuclei tip ── */}
            <div style={{ marginTop: '3rem', background: 'rgba(6,16,30,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem 2rem' }}>
                <h3 style={{ margin: '0 0 12px', color: '#f4d35e', fontSize: '15px' }}>🔬 Run Nuclei Against This Site</h3>
                <pre style={{ margin: 0, background: '#040a12', padding: '1rem', borderRadius: '8px', fontSize: '12px', color: '#a8ff78' }}>
                    {`# Quick scan — all categories
.\\nuclei_tool\\nuclei.exe -u http://localhost:3000 -t .\\docker-lab\\nuclei-templates\\ -duc

# Specific tags
.\\nuclei_tool\\nuclei.exe -u http://localhost:3000 -tags vulnlab,sqli,xss,ssrf -duc

# JSON output for report
.\\nuclei_tool\\nuclei.exe -u http://localhost:3000 -t .\\docker-lab\\nuclei-templates\\ -j -o results.json -duc

# Verbose mode (see all requests)
.\\nuclei_tool\\nuclei.exe -u http://localhost:3000 -t .\\docker-lab\\nuclei-templates\\ -v -duc`}
                </pre>
            </div>
        </div>
    );
}
