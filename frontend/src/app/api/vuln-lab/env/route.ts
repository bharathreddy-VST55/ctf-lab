// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates an accidentally exposed .env file.
// All values are FAKE/DUMMY – no real credentials.

import { NextResponse } from 'next/server';

export async function GET() {
    const body = [
        'APP_ENV=production',
        'APP_DEBUG=false',
        'DB_HOST=db.internal',
        'DB_PORT=5432',
        'DB_NAME=appdb',
        'DB_USER=appuser',
        'DB_PASSWORD=DUMMY_DB_PASS',
        'AWS_ACCESS_KEY_ID=FAKE_ACCESS_KEY_000',
        'AWS_SECRET_ACCESS_KEY=FAKE_SECRET_000',
        'JWT_SECRET=DUMMY_JWT_SECRET_XYZ',
        'STRIPE_SECRET_KEY=FAKE_STRIPE_KEY_000',
        'SENDGRID_API_KEY=FAKE_SG_KEY_0000000',
    ].join('\n');

    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'env-exposure',
        },
    });
}
