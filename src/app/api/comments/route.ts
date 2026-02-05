
import { NextResponse } from 'next/server';
import { POSTS, Post } from '@/lib/db';

export async function GET() {
    // Return posts
    return NextResponse.json(POSTS);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.content) return NextResponse.json({ error: 'Content required' }, { status: 400 });

        const newPost: Post = {
            id: POSTS.length + 1,
            content: body.content, // VULNERABLE: No sanitization
            author: 'guest',
            timestamp: new Date().toISOString().split('T')[0]
        };
        POSTS.push(newPost);
        return NextResponse.json(newPost);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}
