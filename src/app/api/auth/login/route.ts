
import { NextResponse } from 'next/server';
import { USERS } from '@/lib/db';
import { sign } from '@/lib/jwt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const user = USERS.find(u => u.username === username && u.password === password);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate Vulnerable JWT
        const token = sign({
            id: user.id,
            username: user.username,
            role: user.role
        });

        const response = NextResponse.json({
            success: true,
            token,
            user: { username: user.username, role: user.role }
        });

        // VULNERABILITY: Setting cookie without HttpOnly or Secure flags
        // This allows XSS to steal the session
        response.cookies.set('session_token', token, {
            path: '/',
            httpOnly: false, // VULNERABLE
            secure: false,   // VULNERABLE
            sameSite: 'lax'
        });

        return response;
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
