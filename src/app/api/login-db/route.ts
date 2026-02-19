
import { NextResponse } from 'next/server';
import { dangerousQuery, User } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Simulate a query construction:
        // "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"

        // Check if input mimics SQL injection
        const user = dangerousQuery(username);

        if (user) {
            // If we found a user via injection (e.g. admin)
            // Check password unless injection bypassed it (the helper assumes username field injection bypasses auth if successful match?)
            // Actually my helper `dangerousQuery` returns Admin if injection detected.

            return NextResponse.json({
                success: true,
                message: `Welcome back, ${user.username}!`,
                flag: user.role === 'admin' ? 'CTF{tables_gone_wild_sql_injection}' : undefined
            });
        }

        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}
