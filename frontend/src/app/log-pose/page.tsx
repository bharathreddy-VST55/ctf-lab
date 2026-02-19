
import Link from 'next/link';

export default function LogPose() {
    return (
        <div>
            <h1 className="page-title">Log Pose Navigation</h1>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <p>Set your course.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/api/redirect?url=/">
                        <button className="btn-small">Sail Home</button>
                    </Link>
                    <Link href="/api/redirect?url=https://onepiece.fandom.com">
                        <button className="btn-small">Sail to Wiki</button>
                    </Link>
                </div>
                <p style={{ marginTop: '2rem' }}>Warning: Do not follow currents to unknown waters (Open Redirect).</p>
            </div>
        </div>
    );
}
