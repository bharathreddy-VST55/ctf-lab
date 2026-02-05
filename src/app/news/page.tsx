
'use client';
import { useState } from 'react';

export default function NewsCoo() {
    const [url, setUrl] = useState('');
    const [output, setOutput] = useState('');

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        const target = `/api/proxy?url=${encodeURIComponent(url)}`;
        const res = await fetch(target);
        const text = await res.text();
        setOutput(text);
    };

    return (
        <div>
            <h1 className="page-title">News Coo Delivery</h1>
            <p style={{ textAlign: 'center' }}>Order a newspaper from anywhere in the world.</p>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form onSubmit={handleFetch}>
                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="http://example.com"
                    />
                    <button type="submit" className="btn">Fetch News</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Search Result</h3>
                <pre style={{ overflow: 'auto', maxHeight: '300px', background: '#f5f5f5', padding: '1rem' }}>{output}</pre>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <p>Goal: Access internal World Government secrets at <code>/api/internal/secret</code></p>
            </div>
        </div>
    );
}
