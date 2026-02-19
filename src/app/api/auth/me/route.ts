
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from '@/lib/jwt';
import { USERS } from '@/lib/db';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verify(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    return NextResponse.json({ user: payload });
}
