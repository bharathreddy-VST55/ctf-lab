'use client';
import { useState } from 'react';

export default function MarineLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/login-db', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            setResult(await res.json());
        } catch {
            setResult({ success: false, message: 'Network error — Den Den Mushi disconnected.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                {/* Logo / branding */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⚓</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a7a99', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Marine Headquarters
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e8f4f8', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
                        Officer Portal
                    </h1>
                    <p style={{ color: '#4a7a99', fontSize: '13px', margin: 0 }}>
                        Authorized Marine personnel only. Violations are logged.
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Officer Codename</label>
                            <input
                                id="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Akainu"
                                autoComplete="username"
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label>Clearance Code</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading} id="marine-login-btn">
                            {loading ? 'Authenticating…' : '🔐 Access Database'}
                        </button>
                    </form>

                    {result && (
                        <div style={{
                            marginTop: '1.25rem', padding: '12px 16px', borderRadius: '8px',
                            background: result.success ? 'rgba(6,214,160,0.1)' : 'rgba(230,57,70,0.1)',
                            border: `1px solid ${result.success ? 'rgba(6,214,160,0.3)' : 'rgba(230,57,70,0.3)'}`,
                            color: result.success ? '#06d6a0' : '#e63946',
                            fontSize: '13px', fontWeight: 600,
                        }}>
                            {result.success ? '✓' : '✗'} {result.message}
                            {result.flag && (
                                <div className="flag visible" style={{ marginTop: '10px', fontSize: '13px' }}>
                                    {result.flag}
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '12px', color: '#4a7a99' }}>
                        <p>Admiral clearance and above only.</p>
                        <p style={{ marginTop: '4px' }}>Unauthorized access attempts will be reported to CP-0.</p>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '12px', color: '#2d4f6b' }}>
                    © Marine Headquarters Intelligence Division
                </p>
            </div>
        </div>
    );
}
