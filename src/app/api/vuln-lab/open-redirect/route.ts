// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates Open Redirect – redirects to any unvalidated `next` URL.

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const next = searchParams.get('next') ?? '/';

    // VULNERABILITY: Open Redirect – no validation of the target URL
    return NextResponse.redirect(next, {
        status: 302,
        headers: {
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'open-redirect',
        },
    });
}
