// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Simulates a directory listing of an /uploads/ folder.

import { NextResponse } from 'next/server';

export async function GET() {
    const html = `<!DOCTYPE html>
<html>
<head><title>Index of /uploads/</title></head>
<body>
<h1>Index of /uploads/</h1>
<pre>
Name                          Last modified         Size
──────────────────────────────────────────────────────────
<a href="../">../</a>
<a href="backup_2024-01-01.zip">backup_2024-01-01.zip</a>         2024-01-01 03:00      4.2M
<a href="database_dump.sql">database_dump.sql</a>             2024-01-15 14:22     18.7M
<a href="internal_report_Q4.pdf">internal_report_Q4.pdf</a>        2024-01-20 09:11      2.1M
<a href="config_backup.tar.gz">config_backup.tar.gz</a>          2024-01-22 00:00      1.3M
<a href="users_export.csv">users_export.csv</a>              2024-01-25 08:55    512.0K
<a href="private_key.pem">private_key.pem</a>               2024-01-25 08:56      3.2K
<a href="wp-config.php.bak">wp-config.php.bak</a>             2024-01-26 11:30      8.4K
</pre>
<p><em>SIMULATED – No real files exist. Educational lab only.</em></p>
</body>
</html>`;

    return new NextResponse(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            'X-Jenkins': '2.150',
            'X-Vuln-Simulation': 'directory-listing',
        },
    });
}
