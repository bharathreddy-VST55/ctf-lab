'use client';
import { useState } from 'react';

export default function TransponderSnail() {
    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState<{ to: string; message: string }[]>([]);
    const [corsResult, setCorsResult] = useState('');
    const [corsChecked, setCorsChecked] = useState(false);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSent(prev => [{ to: to || 'Broadcast', message }, ...prev]);
        setTo('');
        setMessage('');
    };

    const checkCors = async () => {
        try {
            const res = await fetch('/api/auth/token');
            const acao = res.headers.get('access-control-allow-origin');
            if (acao === '*') {
                setCorsResult('⚠️ Signal is OPEN — Access-Control-Allow-Origin: * detected. All origins can read this.');
            } else {
                setCorsResult('✓ Channel is restricted to verified origins.');
            }
        } catch {
            setCorsResult('Could not connect to signal tower.');
        }
        setCorsChecked(true);
    };

    return (
        <div>
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#06d6a0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    🐌 Den Den Mushi Network
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#e8f4f8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                    Golden Transponder Snail
                </h1>
                <p style={{ color: '#7eb8d4', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px' }}>
                    Secure sea-to-sea communications powered by Den Den Mushi technology. Send encrypted dispatches to any crew member or broadcast across all frequencies.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Compose */}
                <div>
                    <div className="card">
                        <h3 style={{ marginTop: 0, fontSize: '15px', marginBottom: '1rem' }}>📤 Send Dispatch</h3>
                        <form onSubmit={sendMessage}>
                            <label>Recipient (leave blank to broadcast)</label>
                            <input value={to} onChange={e => setTo(e.target.value)} placeholder="Nami, Zoro, Luffy…" />
                            <label>Message</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Write your dispatch here…"
                                rows={4}
                                style={{ resize: 'vertical' }}
                            />
                            <button type="submit" className="btn">🐌 Send via Den Den Mushi</button>
                        </form>
                    </div>

                    {/* CORS diagnostic */}
                    <div className="card" style={{ marginTop: '16px' }}>
                        <h3 style={{ marginTop: 0, fontSize: '14px' }}>🔒 Signal Security Diagnostics</h3>
                        <p style={{ fontSize: '13px', color: '#7eb8d4', marginBottom: '12px' }}>
                            Test whether the communications channel is broadcasting to unauthorized parties.
                        </p>
                        <button onClick={checkCors} className="btn" style={{ background: corsChecked ? 'rgba(255,255,255,0.08)' : undefined }}>
                            Run Signal Check
                        </button>
                        {corsResult && (
                            <div style={{
                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                background: corsResult.includes('OPEN') ? 'rgba(244,211,94,0.1)' : 'rgba(6,214,160,0.08)',
                                border: corsResult.includes('OPEN') ? '1px solid rgba(244,211,94,0.3)' : '1px solid rgba(6,214,160,0.2)',
                                color: corsResult.includes('OPEN') ? '#f4d35e' : '#06d6a0',
                            }}>
                                {corsResult}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message log — XSS renders here without sanitization */}
                <div className="card" style={{ minHeight: '400px' }}>
                    <h3 style={{ marginTop: 0, fontSize: '15px', marginBottom: '1rem' }}>
                        📨 Received Dispatches
                        {sent.length > 0 && (
                            <span style={{ fontSize: '11px', background: '#e63946', color: '#fff', padding: '2px 7px', borderRadius: '10px', marginLeft: '10px', fontWeight: 700 }}>
                                {sent.length}
                            </span>
                        )}
                    </h3>
                    {sent.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#4a7a99', padding: '3rem 1rem' }}>
                            <div style={{ fontSize: '2rem', opacity: 0.5, marginBottom: '8px' }}>🐌</div>
                            No dispatches received yet…
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {sent.map((msg, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '12px 14px' }}>
                                    <div style={{ fontSize: '11px', color: '#4a7a99', marginBottom: '6px', fontWeight: 600 }}>
                                        TO: {msg.to} · {new Date().toLocaleTimeString()}
                                    </div>
                                    {/* XSS VULNERABILITY: dangerouslySetInnerHTML renders all HTML/JS unescaped */}
                                    <div
                                        style={{ fontSize: '14px', color: '#e8f4f8', lineHeight: 1.6 }}
                                        dangerouslySetInnerHTML={{ __html: msg.message }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
