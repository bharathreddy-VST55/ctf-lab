
import { NextResponse } from 'next/server';
import { RECRUITABLE_PIRATES, MARINES } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const faction = searchParams.get('faction');

    if (faction === 'marine') {
        return NextResponse.json(MARINES);
    } else {
        // Default to pirates for anyone else
        return NextResponse.json(RECRUITABLE_PIRATES);
    }
}
