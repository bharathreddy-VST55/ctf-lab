'use client';
import { useState } from 'react';

const PUBLIC_DOCS = [
    'marine-handbook.txt',
    'grand-line-report-2024.txt',
    'bounty-regulations.txt',
    'navigation-manual.txt',
    'crew-recruitment-policy.txt',
];

export default function Archives() {
    const [filename, setFilename] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchFile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!filename.trim()) return;
        setLoading(true); setError(''); setContent('');
        try {
            const res = await fetch(`/api/file?file=${encodeURIComponent(filename)}`);
            const text = await res.text();
            if (res.ok) {
                setContent(text);
            } else {
                setError(`Access restricted: ${text}`);
            }
        } catch {
            setError('Network error — could not reach archive server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#8338ec', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    📁 Classified Records
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#e8f4f8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                    World Government Archives
                </h1>
                <p style={{ color: '#7eb8d4', fontSize: '15px', lineHeight: 1.6, maxWidth: '520px' }}>
                    Access the official World Government document repository. Public records are available to all registered users. Classified materials require higher clearance.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Sidebar — public docs */}
                <div>
                    <div className="card">
                        <h3 style={{ marginTop: 0, fontSize: '14px', marginBottom: '12px', color: '#7eb8d4' }}>📂 Public Documents</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {PUBLIC_DOCS.map(doc => (
                                <button key={doc} onClick={() => setFilename(doc)} style={{
                                    textAlign: 'left', background: filename === doc ? 'rgba(131,56,236,0.15)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${filename === doc ? 'rgba(131,56,236,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                    borderRadius: '6px', padding: '8px 12px', color: filename === doc ? '#a78bfa' : '#7eb8d4',
                                    fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
                                }}>
                                    📄 {doc}
                                </button>
                            ))}
                        </div>
                        <hr />
                        <p style={{ fontSize: '11px', color: '#4a7a99', margin: 0, lineHeight: 1.6 }}>
                            Enter any document name or path in the viewer to the right.
                        </p>
                    </div>
                </div>

                {/* Document viewer */}
                <div>
                    <div className="card">
                        <h3 style={{ marginTop: 0, fontSize: '15px', marginBottom: '16px' }}>📄 Document Viewer</h3>
                        <form onSubmit={fetchFile} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                            <input
                                value={filename}
                                onChange={e => setFilename(e.target.value)}
                                placeholder="Enter document path…"
                                style={{ flex: 1, marginBottom: 0, fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                            />
                            <button type="submit" className="btn" style={{ width: 'auto', padding: '0 20px' }} disabled={loading}>
                                {loading ? '…' : 'Read'}
                            </button>
                        </form>

                        {error && (
                            <div style={{ padding: '10px 14px', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '8px', color: '#e63946', fontSize: '13px', marginBottom: '12px' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div style={{ minHeight: '300px', background: '#040a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a8ff78', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}>
                            {loading ? (
                                <span style={{ color: '#4a7a99' }}>Retrieving document…</span>
                            ) : content || (
                                <span style={{ color: '#4a7a99' }}>Select or enter a document path to view its contents.</span>
                            )}
                        </div>

                        <div style={{ marginTop: '12px', fontSize: '12px', color: '#4a7a99', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Cipher Pol monitoring active</span>
                            <span>Classification: World Government</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
