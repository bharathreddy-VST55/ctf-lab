
'use client';

import { useState, useEffect } from 'react';

type Slide = {
    image: string;
    title: string;
    subtitle: string;
};

export default function Slideshow({ slides, autoScroll = true }: { slides: Slide[], autoScroll?: boolean }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!autoScroll) return;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length, autoScroll]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === current ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        zIndex: index === current ? 1 : 0,
                    }}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        padding: '2rem',
                        color: 'white',
                        textAlign: 'left'
                    }}>
                        <h2 style={{ margin: 0, fontSize: '2rem', textShadow: '2px 2px 4px black', fontFamily: 'serif' }}>{slide.title}</h2>
                        <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>{slide.subtitle}</p>
                    </div>
                </div>
            ))}

            <div style={{ position: 'absolute', bottom: '10px', right: '20px', display: 'flex', gap: '5px', zIndex: 10 }}>
                {slides.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrent(i)}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: i === current ? 'var(--highlight)' : 'white',
                            cursor: 'pointer',
                            opacity: i === current ? 1 : 0.5
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
