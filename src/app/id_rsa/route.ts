
import { NextResponse } from 'next/server';

export async function GET() {
    const key = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA3...
...
...
-----END RSA PRIVATE KEY-----
    `;
    return new NextResponse(key, {
        headers: { 'Content-Type': 'text/plain' }
    });
}
