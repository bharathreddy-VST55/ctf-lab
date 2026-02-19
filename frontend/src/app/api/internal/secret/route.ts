
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const headers = request.headers;

    if (headers.get('x-from-proxy') !== '1') {
        return NextResponse.json({ error: 'Access Denied. Internal Network Only.' }, { status: 403 });
    }

    return NextResponse.json({
        secret: 'CONFIDENTIAL',
        flag: 'CTF{ssrf_filtering_bypassed_successfully}'
    });
}
