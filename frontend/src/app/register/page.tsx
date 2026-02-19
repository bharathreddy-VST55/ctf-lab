
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [faction, setFaction] = useState('pirate');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, faction })
        });
        const data = await res.json();
        if (data.success) {
            setMessage('Success! ' + data.message);
            setTimeout(() => router.push('/login'), 1500);
        } else {
            setMessage('Error: ' + data.error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h1 className="page-title">New Recruit</h1>
            <div className="card">
                <form onSubmit={handleRegister}>
                    <label>Pirate Name / Marine Rank:</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} required />

                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

                    <label>Allegiance:</label>
                    <select
                        value={faction}
                        onChange={e => setFaction(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}
                    >
                        <option value="pirate">Pirate</option>
                        <option value="marine">Marine</option>
                    </select>

                    <button type="submit" className="btn">Join Faction</button>
                </form>
                {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
            </div>
        </div>
    );
}
