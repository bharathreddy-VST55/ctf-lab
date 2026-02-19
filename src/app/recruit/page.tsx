
'use client';
import { useEffect, useState } from 'react';
import Slideshow from '../components/Slideshow';

type Recruit = {
    name: string;
    image: string;
    role: string;
};

export default function RecruitPage() {
    const [role, setRole] = useState<string | null>(null);
    const [recruits, setRecruits] = useState<Recruit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage or fetch profile to determine role
        // For this lab, let's rely on a simple fetch to a new profile endpoint or just check local storage if available from login
        // Or better, let's make an endpoint /api/auth/me
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => {
                setRole(data.user.role);
                fetch(`/api/recruits?faction=${data.user.role}`)
                    .then(r => r.json())
                    .then(setRecruits);
            })
            .catch(() => {
                setRole(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="container">Loading...</div>;

    if (!role) {
        return (
            <div className="container" style={{ textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>You must be registered and logged in to recruit members.</p>
                <a href="/register" className="btn" style={{ maxWidth: '200px', margin: '1rem auto' }}>Register</a>
                <a href="/login" className="btn" style={{ maxWidth: '200px', margin: '0 auto' }}>Login</a>
            </div>
        );
    }

    const slides = recruits.map(r => ({
        image: r.image,
        title: r.name,
        subtitle: r.role
    }));

    return (
        <div>
            <h1 className="page-title">{role === 'marine' ? 'MARINE HEADQUARTERS' : 'PIRATE RECRUITMENT'}</h1>

            {role === 'marine' && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p>Welcome, Officer. Here are the available units for your squad.</p>
                </div>
            )}

            {role === 'pirate' && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p>Ahoy! Build your Grand Fleet.</p>
                </div>
            )}

            <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto' }}>
                {slides.length > 0 ? (
                    <Slideshow slides={slides} />
                ) : (
                    <p>No recruits found.</p>
                )}
            </div>

            <div className="card-grid">
                {recruits.map((r, i) => (
                    <div key={i} className="card">
                        <img src={r.image} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} alt={r.name} />
                        <h3>{r.name}</h3>
                        <p>{r.role}</p>
                        <button className="btn">Recruit</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
