// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Default admin credentials: admin / admin123

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body as { username?: string; password?: string };

    const headers = {
        'X-Jenkins': '2.150',
        'X-Vuln-Simulation': 'default-credentials',
    };

    if (username === 'admin' && password === 'admin123') {
        return NextResponse.json({
            success: true,
            message: 'Access Granted',
            token: 'FAKE_ADMIN_TOKEN_ABC123',
            user: { id: 1, username: 'admin', role: 'superadmin' },
            flag: 'FLAG{default_creds_are_dangerous_DUMMY}',
            simulation: 'EDUCATIONAL ONLY',
        }, { status: 200, headers });
    }

    return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
        hint: 'Try admin / admin123',
    }, { status: 401, headers });
}

export async function GET() {
    return NextResponse.json({
        endpoint: '/api/vuln-lab/admin',
        method: 'POST',
        body: '{ "username": "admin", "password": "admin123" }',
        simulation: 'Default credentials – EDUCATIONAL ONLY',
    }, {
        status: 200,
        headers: { 'X-Jenkins': '2.150', 'X-Vuln-Simulation': 'default-credentials' },
    });
}
