// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates LFI – if file contains path traversal patterns, returns fake /etc/passwd.
// NO real files are ever read. Purely static/hardcoded responses.

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawFile = searchParams.get('file') ?? 'index.html';
    // Decode URL-encoded traversal sequences (e.g. %2F → /, %2E%2E → ..)
    const file = decodeURIComponent(rawFile).replace(/%2[Ff]/g, '/').replace(/%2[Ee]/g, '.');

    const headers = {
        'X-Jenkins': '2.150',
        'X-Vuln-Simulation': 'lfi-path-traversal',
    };

    const dangerousPatterns = [
        'etc/passwd',
        'etc/shadow',
        '../',
        '..',
        '/proc/',
        'windows/win.ini',
        'boot.ini',
    ];

    const isLFI = dangerousPatterns.some(p => file.toLowerCase().includes(p.toLowerCase()));

    if (isLFI) {
        const fakePasswd = [
            'root:x:0:0:dummy-root:/root:/bin/bash',
            'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
            'bin:x:2:2:bin:/bin:/usr/sbin/nologin',
            'sys:x:3:3:sys:/dev:/usr/sbin/nologin',
            'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
            'vulnlab:x:1000:1000:VulnLab User:/home/vulnlab:/bin/bash',
            'mysql:x:999:999:MySQL Server:/var/lib/mysql:/bin/false',
        ].join('\n');

        return new NextResponse(fakePasswd, {
            status: 200,
            headers: { ...headers, 'Content-Type': 'text/plain' },
        });
    }

    return NextResponse.json({
        file,
        content: `[Simulated content of ${file}]`,
        hint: "Try: /api/vuln-lab/page?file=../../../../etc/passwd",
        simulation: 'EDUCATIONAL ONLY – No real file was read',
    }, { status: 200, headers });
}
