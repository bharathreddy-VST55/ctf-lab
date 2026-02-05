
import { NextResponse } from 'next/server';
import { verify } from '@/lib/jwt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const token = body.token;

        if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

        const payload = verify(token);

        if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 403 });

        if (payload.role === 'admin') {
            return NextResponse.json({ success: true, flag: 'CTF{jwt_none_algorithm_bypass_success}' });
        }

        return NextResponse.json({ success: false, message: 'You are not admin', role: payload.role });
    } catch (e) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}
