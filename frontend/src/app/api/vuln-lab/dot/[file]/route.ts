// INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
// Handles all "dot-file" paths: .htpasswd, .htaccess, .DS_Store, .env.local, etc.
// All secrets are FAKE dummy values.

import { NextResponse } from 'next/server';

const FAKE_RESPONSES: Record<string, { body: string; ct: string }> = {
    htpasswd: {
        ct: 'text/plain',
        body: `admin:$apr1$xyz123ab$FaKePaSsWoRdHaSh1234567890
webmaster:$apr1$abc456cd$FaKePaSsWoRdHaSh0987654321
developer:$2y$10$FaKeBcRyPtHaSh/FaKeBcRyPtHaSh/FaKeBcRyPtHaShhhhhhhhh
root:$apr1$def789ef$FaKePaSsWoRdHaSh1122334455
# FLAG: OPS{HTPASSWD_EXPOSED_CREDENTIALS}`,
    },
    htaccess: {
        ct: 'text/plain',
        body: `# Apache .htaccess Configuration
# VULNERABILITY: Exposed server configuration
Options -Indexes
ServerSignature Off

AuthType Basic
AuthName "Grand Library Admin"
AuthUserFile /etc/.htpasswd
Require valid-user

RewriteEngine On
RewriteRule ^admin/(.*)$ /admin/index.php?q=$1 [L,QSA]
RewriteRule ^\.env - [F,L]
RewriteRule ^\.git - [F,L]

<Files "*.sql">
    Order Allow,Deny
    Deny from all
</Files>

# FAKE_SECRET_KEY=grand_library_htaccess_abc123
SetEnv DB_PASSWORD FAKE_DB_PASS_htaccess`,
    },
    'ds-store': {
        ct: 'application/octet-stream',
        body: '\x00\x00\x00\x01\x42\x75\x64\x31\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00DSDB\x00\x00\x00\x01Grand_Library/.env\x00backup.sql\x00admin/\x00config.json\x00',
    },
    'env-local': {
        ct: 'text/plain',
        body: `# VULNERABILITY: Exposed .env.local file
APP_NAME="Grand Library"
APP_ENV=local
APP_KEY=FAKE_APP_KEY_base64abc123==
APP_DEBUG=true
APP_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=grand_library
DB_USERNAME=root
DB_PASSWORD=FAKE_LOCAL_DB_PASS_abc123

JWT_SECRET=FAKE_JWT_LOCAL_SECRET_xyz789
NEXTAUTH_SECRET=FAKE_NEXTAUTH_SECRET_dev
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=FAKE_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=FAKE_GOOGLE_SECRET_abc

STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_TEST_KEY_abc123
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET

REDIS_URL=redis://localhost:6379
# FLAG: OPS{ENV_LOCAL_SECRETS_EXPOSED}`,
    },
    'env-prod': {
        ct: 'text/plain',
        body: `# VULNERABILITY: Exposed .env.production
APP_NAME="Grand Library"
APP_ENV=production
APP_KEY=FAKE_APP_KEY_PROD_base64xyz==
APP_DEBUG=false
APP_URL=https://grand-library.onepiecelab.local

DB_CONNECTION=mysql
DB_HOST=db.grand-library.internal
DB_PORT=3306
DB_DATABASE=grand_library_prod
DB_USERNAME=dbadmin
DB_PASSWORD=FAKE_PROD_DB_PASS_Xk9!mQ2@

JWT_SECRET=FAKE_PROD_JWT_SECRET_onepiece1337
NEXTAUTH_SECRET=FAKE_PROD_NEXTAUTH_SECRET_xyz

AWS_ACCESS_KEY_ID=FAKAKIA1234567890FAKE
AWS_SECRET_ACCESS_KEY=FAKESECRET/FakeKey/FakeAWS+abc123XYZ
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=grand-library-prod-uploads

STRIPE_SECRET_KEY=sk_live_FAKE_LIVE_STRIPE_KEY_abc123xyz
MAILGUN_SECRET=FAKE_MAILGUN_SECRET_key_abc

SENTRY_DSN=https://FAKESENTRYKEY@o123456.ingest.sentry.io/789012`,
    },
    'aws-creds': {
        ct: 'text/plain',
        body: `[default]
aws_access_key_id = FAKAKIA1234567890ABCD
aws_secret_access_key = FAKESECRETKEY/FakeAWS+ABCdef123456fake
region = us-east-1
output = json

[production]
aws_access_key_id = FAKAKIAPROD1234567890
aws_secret_access_key = FAKEPRODsecret/Key+productionFake1234
region = us-east-1

[staging]
aws_access_key_id = FAKAKIASTG1234567890
aws_secret_access_key = FAKESTAGsecret/Key+stagingFake5678
# FLAG: OPS{AWS_CREDENTIALS_EXPOSED}`,
    },
    'ssh-key': {
        ct: 'text/plain',
        body: `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAA FAKEKEY FAKEFAKEFAKE FAKEFAKEFAKEFAKE
FAKEKEYFORCTFLABGRANDLIBR ARYONEPIECECTFLABFAKEDATA FAKEFAKEKEY
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
FAKEFAKEFAKEFAKEFAKEFAKEF AKEFAKEFAKEFAKEFAKEFAKEFA KEFAKEFAKEKEY
-----END OPENSSH PRIVATE KEY-----
# INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
# FLAG: OPS{SSH_KEY_EXPOSED}`,
    },
    npmrc: {
        ct: 'text/plain',
        body: `# VULNERABILITY: Exposed .npmrc with auth token
registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=FAKE_NPM_AUTH_TOKEN_abc123xyz789
//npm.pkg.github.com/:_authToken=FAKE_GITHUB_PKG_TOKEN_ghp_abc123
always-auth=true
email=admin@grand-library.local
# FLAG: OPS{NPMRC_AUTH_TOKEN_LEAKED}`,
    },
    netrc: {
        ct: 'text/plain',
        body: `machine github.com
  login admin
  password FAKE_GITHUB_TOKEN_ghp_abc123xyz789

machine registry.npmjs.org
  login admin
  password FAKE_NPM_TOKEN_abc123

machine grand-library.internal
  login dbadmin
  password FAKE_DB_PASS_Xk9mQ2`,
    },
};

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ file: string }> }
) {
    const { file } = await params;
    const data = FAKE_RESPONSES[file];
    if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return new NextResponse(data.body, {
        status: 200,
        headers: { 'Content-Type': data.ct },
    });
}
