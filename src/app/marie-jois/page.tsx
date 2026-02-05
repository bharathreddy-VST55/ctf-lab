
import { cookies } from 'next/headers';
import { verify } from '@/lib/jwt';

export default async function MarieJois() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    let authorized = false;
    let message = "ACCESS DENIED. THE EMPTY THRONE IS PROTECTED.";
    let userRole = "guest";

    if (token) {
        const payload = verify(token);
        if (payload) {
            userRole = payload.role || 'unknown';
            if (userRole === 'gorosei' || userRole === 'admin') {
                authorized = true;
                message = "Welcome, Lord Imu.";
            } else {
                message = `Access Denied. A mere '${userRole}' cannot enter Marie Jois.`;
            }
        } else {
            message = "Invalid auth token.";
        }
    }

    return (
        <div>
            <h1 className="page-title" style={{ color: authorized ? 'gold' : 'var(--luffy-red)' }}>MARIE JOIS - ROOM OF AUTHORITY</h1>

            <div className="card" style={{ border: authorized ? '3px solid gold' : '3px solid red', textAlign: 'center' }}>
                <h2 style={{ color: authorized ? 'gold' : 'red' }}>
                    {authorized ? 'THE WORLD IS YOURS' : 'INTRUDER ALERT'}
                </h2>
                <p>{message}</p>

                {authorized && (
                    <div className="flag visible" style={{ marginTop: '2rem' }}>
                        Flag: OPS{THE_VOID_CENTURY_REVEALED}
                    </div>
                )}
            </div>
        </div>
    );
}
