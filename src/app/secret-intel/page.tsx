
'use client';
import { useState } from 'react';

export default function PoneglyphDecoder() {
    const [token, setToken] = useState('');
    const [result, setResult] = useState<any>(null);

    const getToken = async () => {
        const res = await fetch('/api/auth/token');
        const data = await res.json();
        setToken(data.token);
    };

    const submitToken = async () => {
        const res = await fetch('/api/auth/flag', {
            method: 'POST',
            body: JSON.stringify({ token })
        });
        setResult(await res.json());
    };

    return (
        <div>
            <h1 className="page-title">Ancient Poneglyph</h1>

            <div className="card">
                <h3>Decipher the Ancient Text (JWT)</h3>
                <button onClick={getToken} className="btn-small" style={{ marginBottom: '1rem' }}>Obtain Rubbing</button>
                <br />
                <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={{ width: '100%', height: '100px', fontFamily: 'monospace', background: '#333', color: '#fff' }}
                />
                <br />
                <button onClick={submitToken} className="btn">Read Poneglyph</button>
            </div>

            {result && (
                <div className="card">
                    <p>Status: {result.success ? 'Success' : 'Failed'}</p>
                    {result.message && <p>{result.message}</p>}
                    {result.flag && <div className="flag visible">{result.flag}</div>}
                </div>
            )}
        </div>
    );
}
