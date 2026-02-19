
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (url) {
        // VULNERABILITY: Open Redirect
        return NextResponse.redirect(url);
    }

    return NextResponse.json({ error: 'Missing url param' });
}
