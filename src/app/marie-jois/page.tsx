
import { cookies } from 'next/headers';
import { verify } from '@/lib/jwt';

export default async function MarieJois() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    let authorized = false;
    let userRole = 'guest';
    let message = 'CLEARANCE DENIED';
    let detail = 'This facility requires Gorosei-level clearance or above. Your credentials have been logged.';

    if (token) {
        const payload = verify(token);
        if (payload) {
            userRole = payload.role || 'unknown';
            if (userRole === 'gorosei' || userRole === 'admin') {
                authorized = true;
                message = 'WELCOME, LORD IMU';
                detail = 'The Empty Throne recognises you. All World Government secrets are at your disposal.';
            } else {
                message = 'INSUFFICIENT CLEARANCE';
                detail = `Role '${userRole}' does not meet the required Gorosei clearance level. This incident has been reported to CP-0.`;
            }
        } else {
            message = 'INVALID TOKEN';
            detail = 'Your authentication token could not be verified. Tampering detected.';
        }
    }

    return (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '560px', textAlign: 'center' }}>
                {/* Crest */}
                <div style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}>
                    {authorized ? '🏛️' : '🔒'}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a7a99', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    World Government · Holy Land
                </div>
                <h1 style={{
                    fontSize: '1.8rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase',
                    color: authorized ? '#ffd700' : '#e63946', margin: '0 0 0.5rem'
                }}>
                    Marie Jois
                </h1>
                <p style={{ color: '#4a7a99', fontSize: '13px', marginBottom: '2rem' }}>
                    Authorisation Gateway — Room of Authority
                </p>

                <div className="card" style={{
                    border: `2px solid ${authorized ? 'rgba(255,215,0,0.4)' : 'rgba(230,57,70,0.3)'}`,
                    background: authorized
                        ? 'linear-gradient(135deg,rgba(255,215,0,0.06),rgba(13,27,42,1))'
                        : 'linear-gradient(135deg,rgba(230,57,70,0.06),rgba(13,27,42,1))',
                    textAlign: 'left',
                }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                            background: authorized ? 'rgba(255,215,0,0.15)' : 'rgba(230,57,70,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                        }}>
                            {authorized ? '✓' : '✗'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '15px', color: authorized ? '#ffd700' : '#e63946', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                {message}
                            </div>
                            <div style={{ fontSize: '13px', color: '#7eb8d4', lineHeight: 1.6 }}>{detail}</div>
                        </div>
                    </div>

                    <hr />

                    <div style={{ fontSize: '12px', color: '#4a7a99' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <span>Session Token: <code>{token ? `${token.substring(0, 16)}…` : 'none'}</code></span>
                            <span>Role Detected: <code>{userRole}</code></span>
                            <span>Required Role: <code>gorosei</code></span>
                            <span>Status: <code style={{ color: authorized ? '#06d6a0' : '#e63946' }}>{authorized ? 'GRANTED' : 'DENIED'}</code></span>
                        </div>
                    </div>

                    {authorized && (
                        <div className="flag visible" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            🏆 OPS{'{THE_VOID_CENTURY_REVEALED}'}
                        </div>
                    )}
                </div>

                {!authorized && (
                    <p style={{ marginTop: '1.5rem', fontSize: '12px', color: '#2d4f6b', lineHeight: 1.7 }}>
                        Obtain a valid session token from <code>/marine-login</code> and forge the role claim.<br />
                        The JWT algorithm or signing secret may be weaker than you think.
                    </p>
                )}
            </div>
        </div>
    );
}
