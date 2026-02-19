'use client';
import { useState } from 'react';

const PRESET_SOURCES = [
    { label: 'Marine HQ Bulletin', url: 'https://example.com/marine-news' },
    { label: 'Pirate Tribune', url: 'https://example.com/pirate-tribune' },
    { label: 'East Blue Gazette', url: 'https://example.com/east-blue-gazette' },
    { label: 'Grand Line Times', url: 'https://example.com/grand-line-times' },
];

export default function NewsCoo() {
    const [url, setUrl] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;
        setLoading(true); setError(''); setOutput('');
        try {
            const target = `/api/proxy?url=${encodeURIComponent(url)}`;
            const res = await fetch(target);
            const text = await res.text();
            if (!res.ok) {
                setError(`Server returned ${res.status}: ${text}`);
            } else {
                setOutput(text);
            }
        } catch (err) {
            setError('Failed to connect to News Coo network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#e63946', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    🗞️ Live News Network
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#e8f4f8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                    News Coo Dispatch
                </h1>
                <p style={{ color: '#7eb8d4', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px' }}>
                    The Grand Library fetches news directly from any source you specify. Our News Coo birds deliver dispatches from across the seas in real time.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Source input */}
                <div>
                    <div className="card">
                        <h3 style={{ marginTop: 0, fontSize: '15px', marginBottom: '1rem' }}>📡 Configure News Source</h3>
                        <p style={{ fontSize: '13px', color: '#7eb8d4', marginBottom: '1rem' }}>
                            Enter any URL to fetch external content. Our proxy retrieves the page on your behalf from the server side.
                        </p>
                        <form onSubmit={handleFetch}>
                            <label>News Source URL</label>
                            <input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/news"
                            />
                            <button type="submit" className="btn" disabled={loading}>
                                {loading ? 'Fetching…' : '📰 Fetch Dispatch'}
                            </button>
                        </form>
                    </div>

                    {/* Presets */}
                    <div className="card" style={{ marginTop: '16px' }}>
                        <h3 style={{ marginTop: 0, fontSize: '13px', color: '#7eb8d4' }}>Suggested Sources</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {PRESET_SOURCES.map(p => (
                                <button key={p.label} onClick={() => setUrl(p.url)} style={{
                                    textAlign: 'left', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '6px', padding: '8px 12px', color: '#7eb8d4', fontSize: '13px',
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.2s',
                                }}>
                                    <span style={{ color: '#06d6a0', fontWeight: 700 }}>→</span> {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Output */}
                <div>
                    <div className="card" style={{ minHeight: '320px' }}>
                        <h3 style={{ marginTop: 0, fontSize: '15px', marginBottom: '1rem' }}>
                            📄 Retrieved Content
                            {output && <span style={{ fontSize: '11px', color: '#06d6a0', fontWeight: 600, marginLeft: '10px' }}>RECEIVED</span>}
                        </h3>
                        {error && (
                            <div style={{ padding: '10px 14px', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '8px', color: '#e63946', fontSize: '13px', marginBottom: '12px' }}>
                                ⚠️ {error}
                            </div>
                        )}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#4a7a99' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🐦</div>
                                Dispatching News Coo…
                            </div>
                        ) : output ? (
                            <pre style={{ margin: 0, maxHeight: '400px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '11px' }}>
                                {output}
                            </pre>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#4a7a99', fontSize: '14px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>🐦</div>
                                Awaiting dispatch request…
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
