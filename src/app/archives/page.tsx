
'use client';
import { useState } from 'react';

export default function Archives() {
    const [content, setContent] = useState('');
    const [filename, setFilename] = useState('manual.txt');

    const fetchFile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/file?file=${filename}`);
            if (res.ok) {
                const text = await res.text();
                setContent(text);
            } else {
                setContent('Error: File not found or access denied.');
            }
        } catch (err) {
            setContent('Network error.');
        }
    };

    return (
        <div>
            <h1 className="page-title">World Government Archives</h1>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <p>Access public records.</p>
                <form onSubmit={fetchFile}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="manual.txt"
                        />
                        <button type="submit" className="btn" style={{ width: '100px' }}>Read</button>
                    </div>
                </form>
            </div>

            <div className="card" style={{ marginTop: '2rem', minHeight: '200px', background: '#f5f5f5', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                <h3>Document Viewer</h3>
                <hr />
                {content || 'Select a document to view...'}
            </div>

            <div className="card" style={{ marginTop: '1rem', background: '#ffebee' }}>
                <p><strong>Warning:</strong> Attempts to access system files (like <code>/etc/passwd</code>) will be logged by Cipher Pol.</p>
            </div>
        </div>
    );
}
