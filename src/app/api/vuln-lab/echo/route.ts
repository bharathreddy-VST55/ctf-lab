// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates Reflected XSS – reflects the msg param WITHOUT escaping.
// This is on purpose to demonstrate the vulnerability pattern.

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const msg = searchParams.get('msg') ?? '';

    // INTENTIONALLY reflecting msg unsanitised in HTML to simulate XSS
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Echo – XSS Simulation | VulnLab</title>
  <meta charset="UTF-8">
  <style>
    body { background: #0d0d1a; color: #e0e0e0; font-family: monospace; padding: 24px; }
    .badge { background: #ff4444; color: #fff; padding: 3px 10px; border-radius: 12px; font-size: 11px; }
    pre { background: #12122a; border: 1px solid #333; padding: 16px; border-radius: 6px; }
    .reflected { background: #1a0000; border: 1px solid #ff6b6b; padding: 16px; border-radius: 6px; margin: 16px 0; }
  </style>
</head>
<body>
  <h1>📢 Echo – <span class="badge">REFLECTED XSS</span></h1>
  <p>Your message (reflected WITHOUT sanitisation):</p>
  <div class="reflected">${msg}</div>
  <p>Try: <code>/api/vuln-lab/echo?msg=&lt;script&gt;alert('XSS')&lt;/script&gt;</code></p>
  <p><small>INTENTIONALLY VULNERABLE – EDUCATIONAL USE ONLY</small></p>
</body>
</html>`;

    return new NextResponse(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'reflected-xss',
            // Intentionally no X-XSS-Protection or strict CSP
        },
    });
}
