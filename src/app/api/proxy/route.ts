
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) return NextResponse.json({ error: 'Missing url param' }, { status: 400 });

    // VULNERABILITY: Weak Blacklist
    const blacklist = ['localhost', '127.0.0.1', '::1'];

    if (blacklist.some(b => url.includes(b))) {
        return NextResponse.json({ error: 'Blocked: Internal network access prohibited.' }, { status: 403 });
    }

    try {
        const res = await fetch(url, {
            headers: {
                'X-From-Proxy': '1' // Automatically authenticates internal requests if you can hit them
            }
        });

        const text = await res.text();
        return new NextResponse(text, { status: 200 }); // Reflects body
    } catch (e) {
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
