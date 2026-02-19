// Universal LFI/RCE vulnerability handler for multiple CVE detections
// Triggers: CVE-2025-2294, CVE-2021-24227, CVE-2015-4074, CVE-2019-7254, 
//           CVE-2021-39316, CVE-2021-28918, CVE-2020-8163, CVE-2021-32820,
//           CVE-2011-2744, CVE-2020-17530, wp-vault-local-file-inclusion

import { NextRequest, NextResponse } from 'next/server';

const FAKE_PASSWD = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
mysql:x:101:101:MySQL Server:/var/lib/mysql:/bin/false
admin:x:1000:1000:Admin User:/home/admin:/bin/bash
`;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Check for any LFI-related parameters
    const lfiParams = [
        '__kubio-site-edit-iframe-classic-template', // CVE-2025-2294
        'patron_only_image',                          // CVE-2021-24227
        'filename',                                   // CVE-2015-4074
        'c',                                          // CVE-2019-7254
        'link',                                       // CVE-2021-39316
        'file',                                       // CVE-2021-28918
        'layout',                                     // CVE-2021-32820
        'action',                                     // CVE-2011-2744
        'wpv-image',                                  // wp-vault-lfi
        'id'                                          // CVE-2020-17530
    ];

    for (const param of lfiParams) {
        const value = searchParams.get(param);
        if (value && (value.includes('passwd') || value.includes('etc') || value.includes('..') || value.includes('%'))) {
            return new NextResponse(FAKE_PASSWD, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    }

    // Check for patreon action
    if (searchParams.get('patreon_action') === 'serve_patron_only_image') {
        return new NextResponse(FAKE_PASSWD, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    // Check for option=com_helpdeskpro
    if (searchParams.get('option') === 'com_helpdeskpro') {
        return new NextResponse(FAKE_PASSWD, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    // Check for action=dzsap_download
    if (searchParams.get('action') === 'dzsap_download') {
        return new NextResponse(FAKE_PASSWD, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
}
