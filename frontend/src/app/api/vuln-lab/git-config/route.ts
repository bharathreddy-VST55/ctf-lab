// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates an exposed .git/config with embedded fake credentials.

import { NextResponse } from 'next/server';

export async function GET() {
    const body = [
        '[core]',
        '\trepositoryformatversion = 0',
        '\tfilemode = false',
        '\tbare = false',
        '\tlogallrefupdates = true',
        '\tsymlinks = false',
        '\tignorecase = true',
        '[remote "origin"]',
        '\turl = https://DUMMY_GIT_USER:DUMMY_GIT_TOKEN@github.com/fake-org/private-repo.git',
        '\tfetch = +refs/heads/*:refs/remotes/origin/*',
        '[branch "main"]',
        '\tremote = origin',
        '\tmerge = refs/heads/main',
        '[user]',
        '\tname = Dummy Developer',
        '\temail = dev@dummy-corp.internal',
    ].join('\n');

    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'git-config-exposure',
        },
    });
}
