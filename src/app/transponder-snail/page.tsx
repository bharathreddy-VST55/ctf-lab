
'use client';
import { useState } from 'react';

export default function TransponderSnail() {
    const [output, setOutput] = useState('');

    const checkCors = async () => {
        try {
            const res = await fetch('/api/auth/token');
            const headers = Array.from(res.headers.entries());
            const acao = headers.find(([key]) => key.toLowerCase() === 'access-control-allow-origin');

            if (acao && acao[1] === '*') {
                setOutput('VULNERABLE: The snail is broadcasting to EVERYONE! (*)');
            } else {
                setOutput('Secure channel established.');
            }
        } catch (e) {
            setOutput('Connection jammed.');
        }
    };

    return (
        <div>
            <h1 className="page-title">Golden Transponder Snail</h1>

            <div className="card" style={{ textAlign: 'center' }}>
                <h3>Signal Analysis (CORS)</h3>
                <p>Is this buster call signal secure?</p>
                <button onClick={checkCors} className="btn">Check Signal</button>

                {output && (
                    <div style={{ marginTop: '1rem', color: output.includes('VULNERABLE') ? 'green' : 'red', fontWeight: 'bold' }}>
                        {output}
                    </div>
                )}
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <p>Flag: <code>{'OPS{BUSTER_CALL_INITIATED_CORS}'}</code></p>
            </div>
        </div>
    )
}
