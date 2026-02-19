// Simulated SVN wc.db exposure for Nuclei detection [svn-wc-db]
import { NextResponse } from 'next/server';

export async function GET() {
    // Fake SVN working copy database content
    const svnWcDb = `SQLite format 3
This is a simulated SVN working copy database.
Contains repository metadata and file tracking information.

REPOSITORY: https://svn.internal.virtuelity.com/repos/main
UUID: 550e8400-e29b-41d4-a716-446655440000
WC_FORMAT: 31

Files tracked:
- /trunk/src/config.php
- /trunk/src/database.php  
- /trunk/includes/secrets.php
- /trunk/.htpasswd
- /trunk/admin/credentials.txt

Last commit: r2847 by admin on 2024-01-15
`;

    return new NextResponse(svnWcDb, {
        status: 200,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="wc.db"'
        }
    });
}
