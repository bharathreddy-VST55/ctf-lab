// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates Log4Shell (CVE-2021-44228) JNDI lookup error disclosure.
// No real JNDI lookup is performed – response is purely static.

import { NextResponse } from 'next/server';

export async function GET() {
    const body = `ERROR 2024-01-01 00:00:00,000 [main] log4j.core.net.JndiLookup
Error: JNDI lookup attempted: \${jndi:ldap://dummy-server/a}

log4j2 version : 2.14.1 (VULNERABLE – simulation only)
Lookup blocked : false (simulation)
RCE executed   : NO – response is static/hardcoded

Affected versions: log4j-core 2.0-beta9 through 2.14.1
Patch: Upgrade to 2.17.1 or later
CVE: CVE-2021-44228 (CVSS 10.0 – CRITICAL)

[SIMULATED – No real JNDI lookup was performed]`;

    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'log4shell-cve-2021-44228',
        },
    });
}
