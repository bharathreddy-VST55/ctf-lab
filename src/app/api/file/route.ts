
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    // 1. Simulated /etc/passwd content
    const FAKE_PASSWD = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
user:x:1000:1000:user:/home/user:/bin/bash
luffy:x:1001:1001:luffy:/home/sunny:/bin/bash
kaido:x:1002:1002:kaido:/home/onigashima:/bin/zsh`;

    // 2. Simulated Safe Files
    const SAFE_FILES: Record<string, string> = {
        'manual.txt': 'World Government Archive Access Manual\n\n1. Do not look for the Void Century.\n2. Do not ask about Ohara.\n3. Authorized personnel only.',
        'bounties.txt': 'Recent Bounties:\nLuffy: 3B\nBuggy: 3.1B\n...',
    };

    // 3. VULNERABILITY: Simulated LFI
    // Reacts ONLY to specific /etc/passwd payloads as requested
    if (file === '/etc/passwd' || file === '../../etc/passwd' || file === '../../../../etc/passwd') {
        return new NextResponse(FAKE_PASSWD, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    // 4. Handle "safe" files
    if (file && SAFE_FILES[file]) {
        return new NextResponse(SAFE_FILES[file], {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    // 5. Default 404
    return new NextResponse('File not found.', { status: 404 });
}
