
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // ── CVE FINGERPRINTS ────────────────────────────────────
                    // CVE-2021-41773 / CVE-2021-42013: Apache path traversal
                    { key: 'Server', value: 'Apache/2.4.49 (Unix)' },
                    // Old PHP version disclosure (multiple CVEs)
                    { key: 'X-Powered-By', value: 'PHP/7.2.1' },
                    // Jenkins 2.150 RCE fingerprint (CVE-2019-1003000)
                    { key: 'X-Jenkins', value: '2.150' },
                    // Struts version (CVE-2017-5638)
                    { key: 'X-Struts-Version', value: '2.3.14' },
                    // Drupal version
                    { key: 'X-Generator', value: 'Drupal 8 (https://www.drupal.org)' },

                    // ── INTENTIONALLY MISSING SECURITY HEADERS ─────────────
                    // (absence triggers Nuclei missing-header templates)
                    // NOT setting: X-Frame-Options
                    // NOT setting: X-Content-Type-Options
                    // NOT setting: Strict-Transport-Security
                    // NOT setting: Referrer-Policy
                    // NOT setting: Permissions-Policy

                    // ── VULNERABILITY: Unsafe CSP ───────────────────────────
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline'; img-src * data:; frame-ancestors *;",
                    },

                    // ── VULNERABILITY: Wildcard CORS ───────────────────────
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: '*' },
                    { key: 'Access-Control-Expose-Headers', value: '*' },

                    // ── DEBUG / INFO HEADERS ────────────────────────────────
                    { key: 'X-Debug-Mode', value: 'true' },
                    { key: 'X-Runtime', value: 'Ruby' },
                    { key: 'X-Aspnet-Version', value: '4.0.30319' },
                ],
            },
        ];
    },

    async rewrites() {
        return [
            // ── Classic vulnerability paths → API handlers ─────────────
            { source: '/.env', destination: '/api/vuln-lab/env' },
            { source: '/.git/config', destination: '/api/vuln-lab/git-config' },
            { source: '/config.json', destination: '/api/vuln-lab/config-json' },
            { source: '/uploads/:path*', destination: '/api/vuln-lab/uploads' },

            // ── Dot-file exposures ──────────────────────────────────────
            { source: '/.htpasswd', destination: '/api/vuln-lab/dot/htpasswd' },
            { source: '/.htaccess', destination: '/api/vuln-lab/dot/htaccess' },
            { source: '/.DS_Store', destination: '/api/vuln-lab/dot/ds-store' },
            { source: '/.env.local', destination: '/api/vuln-lab/dot/env-local' },
            { source: '/.env.production', destination: '/api/vuln-lab/dot/env-prod' },
            { source: '/.env.backup', destination: '/api/vuln-lab/dot/env-prod' },
            { source: '/.aws/credentials', destination: '/api/vuln-lab/dot/aws-creds' },
            { source: '/.ssh/id_rsa', destination: '/api/vuln-lab/dot/ssh-key' },
            { source: '/.npmrc', destination: '/api/vuln-lab/dot/npmrc' },
            { source: '/.netrc', destination: '/api/vuln-lab/dot/netrc' },

            // ── Other vuln-lab API paths ────────────────────────────────
            { source: '/search', destination: '/api/vuln-lab/search' },
            { source: '/echo', destination: '/api/vuln-lab/echo' },
            { source: '/fetch', destination: '/api/vuln-lab/fetch' },
            { source: '/page', destination: '/api/vuln-lab/page' },
            { source: '/open-redirect', destination: '/api/vuln-lab/open-redirect' },
            { source: '/admin', destination: '/api/vuln-lab/admin' },
            { source: '/log4j', destination: '/api/vuln-lab/log4j' },
            { source: '/wp-plugin', destination: '/api/vuln-lab/wp-plugin' },
        ];
    },
};

module.exports = nextConfig;
