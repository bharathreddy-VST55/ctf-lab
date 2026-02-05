
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // VULNERABILITY: Missing security headers (HSTS, XFO)
                    // VULNERABILITY: CSP allows unsafe-inline
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * data:;",
                    },
                    // VULNERABILITY: CORS allow all
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    }
                ],
            },
        ]
    },
}

module.exports = nextConfig
