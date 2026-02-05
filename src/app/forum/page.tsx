
'use client';
import { useEffect, useState } from 'react';

type Post = {
    id: number;
    content: string;
    author: string;
    timestamp: string;
};

export default function Forum() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');

    const fetchPosts = async () => {
        const res = await fetch('/api/comments');
        if (res.ok) {
            setPosts(await res.json());
        }
    };

    useEffect(() => {
        // Set a flag in cookies to be stolen
        document.cookie = "secret_treasure='OPS{THE_ONE_PIECE_IS_IN_COOKIES}'; path=/forum";
        fetchPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newPost })
        });
        setNewPost('');
        fetchPosts();
    };

    return (
        <div>
            <h1 className="page-title">Pirate Alliance Forum</h1>
            <p style={{ textAlign: 'center' }}>Leave a message for your fleet.</p>

            <div className="card">
                <h3>Recent Messages</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {posts.map((p) => (
                        <li key={p.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--grand-line-blue)' }}>{p.author} <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 'normal' }}>{p.timestamp}</span></div>
                            {/* VULNERABILITY: Rendering stored content as HTML */}
                            <div dangerouslySetInnerHTML={{ __html: p.content }} style={{ marginTop: '0.5rem' }} />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Post Message</h3>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="We are setting sail for Elbaf..."
                        style={{ width: '100%', minHeight: '100px' }}
                    />
                    <button type="submit" className="btn">Send via Den Den Mushi</button>
                </form>
            </div>
        </div>
    );
}
