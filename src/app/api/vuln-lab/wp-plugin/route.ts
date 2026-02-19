// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates WordPress plugin version disclosure with CVE reference.

import { NextResponse } from 'next/server';

export async function GET() {
    const body = `Plugin: Contact Form Pro
Version: 1.2.3
Status: Active
CVE Reference: CVE-2022-XXXX (SQL Injection via unauthenticated request)

Vulnerable Plugin Version: 1.2.3 (CVE-2022-XXXX)

Plugin Path: /wp-content/plugins/contact-form-pro/
Author: Dummy Author <dummy@example.com>
Last Updated: 2022-03-01
Min WP Version: 5.0

Advisory:
  Title: SQL Injection in Contact Form Pro <= 1.2.3
  Severity: HIGH (CVSS: 8.8)
  Fix: Update to version 1.2.4 or later
  Reference: https://example.com/advisory/CVE-2022-XXXX (SIMULATED)`;

    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'cve-wp-plugin',
            'X-Generator': 'WordPress 6.1.1',
        },
    });
}
