
import { cookies } from 'next/headers';
import { verify } from '@/lib/jwt';

export default async function AdminPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    let authorized = false;
    let message = "Access Denied. You are not an administrator.";
    let userRole = "guest";

    if (token) {
        const payload = verify(token);
        if (payload) {
            userRole = payload.role || 'unknown';
            if (userRole === 'admin') {
                authorized = true;
                message = "Welcome, Administrator.";
            } else {
                message = `Access Denied. User role '${userRole}' is not authorized.`;
            }
        } else {
            message = "Invalid or tampered token.";
        }
    } else {
        message = "No session token found. Please login.";
    }

    return (
        <div>
            <h1 className="title">Admin Control Panel</h1>

            <div className={`card ${authorized ? 'authorized' : 'unauthorized'}`} style={{ borderColor: authorized ? 'var(--success)' : 'var(--danger)' }}>
                <h2 style={{ color: authorized ? 'var(--success)' : 'var(--danger)' }}>
                    {authorized ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                </h2>
                <p>{message}</p>

                {authorized && (
                    <div className="flag-box visible" style={{ marginTop: '2rem' }}>
                        Flag: {'CTF{horizontal_privilege_escalation_success}'}
                    </div>
                )}
            </div>

            <div className="card">
                <h3>Debug Info</h3>
                <p><strong>Current Role:</strong> {userRole}</p>
                <p><strong>Token:</strong> {token ? (token.substring(0, 15) + '...') : 'None'}</p>
            </div>
        </div>
    );
}
