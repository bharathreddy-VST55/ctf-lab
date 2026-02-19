// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates error-based SQL Injection on a search endpoint.
// No real database query is executed – entirely static/hardcoded.

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';

    const injectionTriggers = ["'", '"', '--', ';', '1=1', 'union', 'select', 'drop', 'insert'];
    const isInjection = injectionTriggers.some(t => q.toLowerCase().includes(t));

    const headers = {
        'X-Jenkins': '2.150',
        'X-Vuln-Simulation': 'sql-injection-error-based',
    };

    if (isInjection) {
        const body = {
            error: true,
            message: `SQL syntax error near '${q}' at line 1`,
            details: `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '${q}' at line 1`,
            query: `SELECT * FROM products WHERE name LIKE '%${q}%'`,
            code: 1064,
            sqlstate: '42000',
            simulation: 'EDUCATIONAL ONLY – No real DB query was executed',
        };
        return NextResponse.json(body, { status: 500, headers });
    }

    return NextResponse.json({
        results: [],
        query: q,
        count: 0,
        message: `No results for: ${q}. Try adding a single quote (') to trigger the SQLi simulation.`,
    }, { status: 200, headers });
}
