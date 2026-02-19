
import { NextResponse } from 'next/server';
import { sign } from '@/lib/jwt';

export async function GET() {
    const token = sign({ user: 'guest', role: 'user' });
    const response = NextResponse.json({ token });

    // Also set cookie
    response.cookies.set('auth_token', token, { httpOnly: false, path: '/' }); // VULNERABLE: Not HttpOnly

    return response;
}
