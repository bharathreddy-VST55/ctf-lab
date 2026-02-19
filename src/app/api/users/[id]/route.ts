
import { NextResponse } from 'next/server';
import { USERS } from '@/lib/db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const idStr = params.id;
    const id = parseInt(idStr);

    // VULNERABILITY: No authorization check to see if the requester owns this ID.
    const user = USERS.find(u => u.id === id);

    if (user) {
        return NextResponse.json(user);
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
