// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates a config.json exposed with API keys and passwords.
// All values are FAKE/DUMMY – no real secrets.

import { NextResponse } from 'next/server';

export async function GET() {
    const config = {
        app: 'VulnLab',
        version: '1.0.0',
        environment: 'production',
        api: {
            key: 'FAKE_API_KEY_12345',
            endpoint: 'https://api.dummy-corp.internal/v2',
            timeout: 30,
        },
        database: {
            host: 'db.internal',
            port: 5432,
            name: 'appdb',
            password: 'DUMMY_DB_PASS',
        },
        stripe: {
            publishable: 'FAKE_STRIPE_PK_000',
            secret: 'FAKE_STRIPE_SK_000',
        },
        slack_webhook: 'https://hooks.slack.com/services/FAKE/WEBHOOK/TOKEN000',
        github_token: 'FAKE_GH_TOKEN_000000000000000000000',
    };

    return NextResponse.json(config, {
        status: 200,
        headers: {
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'config-json-exposure',
        },
    });
}
