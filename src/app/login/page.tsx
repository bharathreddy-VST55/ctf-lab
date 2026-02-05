
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                // VULNERABILITY: Storing in localStorage (XSS accessible)
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_role', data.user.role);

                // Redirect to dashboard
                router.push('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Secure Login</h2>
                    <p className="text-dim">Enter your credentials to access the system.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(244, 63, 94, 0.1)',
                            color: 'var(--danger)',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-full">
                        Authenticate
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                    <p className="text-dim">Forgot password? <a href="#">Reset via Email</a></p>
                </div>
            </div>

            <div className="card" style={{ marginTop: '1rem', opacity: 0.8 }}>
                <h4 style={{ color: 'var(--secondary)' }}>Debug Info</h4>
                <p style={{ fontSize: '0.8rem' }}>
                    This login sets a <code>session_token</code> cookie (lacks HttpOnly) and stores the token in <code>localStorage</code>.
                </p>
            </div>
        </div>
    );
}
