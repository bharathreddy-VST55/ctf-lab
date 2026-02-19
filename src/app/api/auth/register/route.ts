
import { NextResponse } from 'next/server';
import { USERS, User } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, faction } = body;

        if (!username || !password || !faction) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        if (USERS.some(u => u.username === username)) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const newUser: User = {
            id: USERS.length + 100, // Offset to not clash
            username,
            password,
            role: faction, // 'pirate' or 'marine'
            bounty: '0',
            devil_fruit: 'None'
        };

        USERS.push(newUser);

        return NextResponse.json({ success: true, message: 'Account created! Please login.' });

    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
