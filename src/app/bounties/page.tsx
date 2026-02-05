
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BountyViewer() {
    const [data, setData] = useState<any>(null);
    const [id, setId] = useState(2); // Default to Luffy

    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(r => r.json())
            .then(setData);
    }, [id]);

    return (
        <div>
            <h1 className="page-title">Pirate Database</h1>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3>View Profile</h3>
                <label>Enter ID: </label>
                <input
                    type="number"
                    value={id}
                    onChange={(e) => setId(parseInt(e.target.value))}
                    style={{ width: '80px', display: 'inline-block', marginLeft: '10px' }}
                />

                {data && (
                    <div style={{ marginTop: '2rem', border: '5px solid var(--treasure-gold)', padding: '1rem', background: '#fff8e1', position: 'relative' }}>
                        {data.error ? (
                            <p style={{ color: 'red' }}>Profile not found.</p>
                        ) : (
                            <>
                                <h2 style={{ color: 'var(--luffy-red)', marginTop: 0, textTransform: 'uppercase', fontSize: '2rem', fontFamily: 'serif' }}>WANTED</h2>
                                <div style={{ width: '100%', height: '300px', position: 'relative', margin: '1rem 0', background: '#333' }}>
                                    {data.image ? (
                                        <img src={data.image} alt={data.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>No Image</div>
                                    )}
                                </div>
                                <h2 style={{ color: 'var(--text-main)', marginTop: 0 }}>{data.username}</h2>
                                <p><strong>Role:</strong> {data.role}</p>
                                <p><strong>Bounty:</strong> ฿{data.bounty}</p>
                                <p><strong>Devil Fruit:</strong> {data.devil_fruit}</p>
                                <p><strong>Secret Ambition:</strong> {data.secret_ambition}</p>
                                <h3 style={{ textTransform: 'uppercase', borderTop: '2px solid black', paddingTop: '10px' }}>DEAD OR ALIVE</h3>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                <p>Tip: Who sits on the Empty Throne? (ID: 1)</p>
            </div>
        </div>
    );
}
