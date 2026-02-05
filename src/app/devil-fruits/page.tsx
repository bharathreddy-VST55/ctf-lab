
'use client';
import { useEffect, useState } from 'react';

export default function DevilFruits() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        // VULNERABILITY: Directly using hash content in innerHTML
        const handleHash = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const sink = document.getElementById('fruit-sink');
                if (sink) {
                    sink.innerHTML = decodeURIComponent(hash);
                }
            }
        };

        window.addEventListener('hashchange', handleHash);
        handleHash();

        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    return (
        <div>
            <h1 className="page-title">Devil Fruit Encyclopedia</h1>

            <div className="card">
                <h3>Current Selection:</h3>
                <div id="fruit-sink" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Gomu Gomu no Mi</div>
            </div>

            <div className="card">
                <p>Filter by hash (e.g., #MeraMera).</p>
            </div>

            <div className="flag" id="flag">
                {'OPS{DOM_XSS_IS_REAL}'}
            </div>
        </div>
    );
}
