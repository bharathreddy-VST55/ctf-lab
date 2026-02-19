// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates SSRF – if the URL targets AWS metadata IP, returns fake credentials.
// NO real HTTP request is ever made. Purely static/hardcoded responses.

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url') ?? '';

    const headers = {
        'X-Jenkins': '2.150',
        'X-Vuln-Simulation': 'ssrf-aws-metadata',
    };

    const internalTargets = [
        '169.254.169.254',
        'metadata',
        '::1',
        '0.0.0.0',
        '10.',
        '172.16.',
        '192.168.',
    ];

    const isInternal = internalTargets.some(t => url.toLowerCase().includes(t));

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400, headers });
    }

    if (isInternal) {
        const fakeMetadata = {
            simulation: 'EDUCATIONAL ONLY – No real HTTP request was made',
            source: url,
            response: {
                'ami-id': 'ami-0abcdef1234567890',
                'instance-id': 'FAKE_INSTANCE_ID=i-123456',
                'instance-type': 't3.micro',
                'local-ipv4': '10.0.1.100',
                'placement': { 'availability-zone': 'us-east-1a' },
                'iam': {
                    'security-credentials': {
                        'ec2-role': {
                            AccessKeyId: 'FAKE_ACCESS_KEY_ID_META',
                            SecretAccessKey: 'FAKE_SECRET_KEY_META_000',
                            Token: 'FAKE_SESSION_TOKEN_000',
                            Expiration: '2099-01-01T00:00:00Z',
                        },
                    },
                },
            },
        };
        return NextResponse.json(fakeMetadata, { status: 200, headers });
    }

    return NextResponse.json({
        simulation: 'EDUCATIONAL ONLY – No real HTTP request was made',
        url,
        status: 200,
        body: '[Simulated external page content]',
        hint: 'Try: /api/vuln-lab/fetch?url=http://169.254.169.254/latest/meta-data/',
    }, { status: 200, headers });
}
