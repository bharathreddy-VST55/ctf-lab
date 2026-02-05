
'use client';
import { useState } from 'react';

export default function MarineLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/login-db', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        setResult(await res.json());
    };

    return (
        <div>
            <h1 className="page-title">Marine HQ Login</h1>

            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <p style={{ textAlign: 'center' }}><strong>JUSTICE</strong></p>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Officer Name: </label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Akainu" />
                    </div>
                    <div>
                        <label>Password: </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn">Access Database</button>
                </form>

                {result && (
                    <div style={{ marginTop: '1rem', color: result.success ? 'green' : 'red', fontWeight: 'bold' }}>
                        {result.message}
                        {result.flag && <div className="flag visible">{result.flag}</div>}
                    </div>
                )}
            </div>

            <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.7 }}>Only Admiral level access allowed.</p>
        </div>
    );
}
