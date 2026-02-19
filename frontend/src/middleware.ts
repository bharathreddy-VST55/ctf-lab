import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const j = (d: object, s = 200) =>
    new NextResponse(JSON.stringify(d, null, 2), { status: s, headers: { 'Content-Type': 'application/json' } });
const h = (html: string, s = 200) =>
    new NextResponse(html, { status: s, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
const t = (txt: string, s = 200) =>
    new NextResponse(txt, { status: s, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
const xml = (x: string) =>
    new NextResponse(x, { status: 200, headers: { 'Content-Type': 'application/xml' } });

export function middleware(req: NextRequest) {
    const p = req.nextUrl.pathname;

    /* ───────────────────────────────────────────
       1. SPRING BOOT ACTUATOR (CRITICAL)
    ─────────────────────────────────────────── */
    if (p === '/actuator' || p === '/actuator/') {
        return j({
            _links: {
                self: { href: '/actuator', templated: false },
                health: { href: '/actuator/health', templated: false },
                env: { href: '/actuator/env', templated: false },
                heapdump: { href: '/actuator/heapdump', templated: false },
                trace: { href: '/actuator/trace', templated: false },
                httptrace: { href: '/actuator/httptrace', templated: false },
                mappings: { href: '/actuator/mappings', templated: false },
                metrics: { href: '/actuator/metrics', templated: false },
                info: { href: '/actuator/info', templated: false },
                beans: { href: '/actuator/beans', templated: false },
                configprops: { href: '/actuator/configprops', templated: false },
                loggers: { href: '/actuator/loggers', templated: false },
                shutdown: { href: '/actuator/shutdown', templated: false },
            },
        });
    }

    if (p === '/actuator/env') {
        return j({
            activeProfiles: ['production'],
            propertySources: [
                {
                    name: 'systemEnvironment',
                    properties: {
                        DB_HOST: { value: 'db.grand-library.internal' },
                        DB_PASSWORD: { value: 'FAKE_DB_PASS_Xk9!mQ2@' },
                        API_SECRET: { value: 'FAKE_API_SECRET_7f3a9b1c' },
                        JWT_SECRET: { value: 'FAKE_JWT_SECRET_onepiece' },
                        AWS_ACCESS_KEY_ID: { value: 'FAKAKIA1234567890FAKE' },
                        AWS_SECRET_ACCESS_KEY: { value: 'FAKESECRET/FakeKey/FakeAWS+abc123' },
                        REDIS_PASSWORD: { value: 'FAKE_REDIS_PASS_r3d1s' },
                        SMTP_PASSWORD: { value: 'FAKE_SMTP_PASS_smtp99' },
                    },
                },
            ],
        });
    }

    if (p === '/actuator/health') {
        return j({ status: 'UP', components: { db: { status: 'UP', details: { database: 'MySQL', validationQuery: 'isValid()' } }, redis: { status: 'UP' }, diskSpace: { status: 'UP', details: { total: 107374182400, free: 52000000000 } } } });
    }

    if (p === '/actuator/trace' || p === '/actuator/httptrace') {
        return j({ traces: [{ timestamp: '2026-02-19T08:30:00Z', principal: { name: 'admin' }, session: { id: 'FAKE_SESSION_aB3xK9mQz1' }, request: { method: 'POST', uri: 'http://192.168.1.121:3000/api/admin/users', headers: { Authorization: ['Bearer FAKE_TOKEN_xyz'] } }, response: { status: 200 } }, { timestamp: '2026-02-19T08:29:55Z', principal: { name: 'luffy' }, session: { id: 'FAKE_SESSION_cD5tR7pWm2' }, request: { method: 'GET', uri: 'http://192.168.1.121:3000/api/bounties' }, response: { status: 200 } }] });
    }

    if (p === '/actuator/mappings') {
        return j({ contexts: { application: { mappings: { dispatcherServlets: { dispatcherServlet: [{ handler: 'ResourceHttpRequestHandler', predicate: '{ [/static/**]}' }, { handler: 'AdminController#getAllUsers()', predicate: '{ [/api/admin/users], methods=[GET]}' }, { handler: 'AdminController#deleteUser()', predicate: '{ [/api/admin/users/{id}], methods=[DELETE]}' }] } } } } });
    }

    if (p.startsWith('/actuator/heapdump')) {
        return new NextResponse('JAVA PROFILE 1.0.1\n\x00\x00\x00\x08FAKE_HEAP_DUMP_GRAND_LIBRARY', { status: 200, headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="heapdump.hprof"' } });
    }

    if (p === '/actuator/info') {
        return j({ app: { name: 'grand-library', version: '1.0.0', description: 'Grand Line Intelligence Network' }, build: { version: '1.0.0', artifact: 'grand-library', name: 'Grand Library', time: '2026-01-01T00:00:00Z' } });
    }

    if (p === '/actuator/metrics') {
        return j({ names: ['jvm.memory.used', 'jvm.memory.max', 'http.server.requests', 'process.cpu.usage', 'system.cpu.usage', 'db.queries.active'] });
    }

    if (p === '/actuator/beans') {
        return j({ contexts: { application: { beans: { dataSource: { type: 'com.zaxxer.hikari.HikariDataSource', resource: 'class path resource [application.yml]' }, jwtService: { type: 'com.grandlibrary.security.JwtService' }, adminController: { type: 'com.grandlibrary.controller.AdminController' } } } } });
    }

    if (p === '/actuator/loggers') {
        return j({ levels: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'], loggers: { ROOT: { configuredLevel: 'INFO', effectiveLevel: 'INFO' }, 'com.grandlibrary': { configuredLevel: 'DEBUG', effectiveLevel: 'DEBUG' } } });
    }

    if (p === '/actuator/shutdown') {
        return j({ message: 'Shutting down, bye...' });
    }

    if (p === '/actuator/configprops') {
        return j({ contexts: { application: { beans: { 'spring.datasource': { prefix: 'spring.datasource', properties: { url: 'jdbc:mysql://db.grand-library.internal:3306/grand_library', username: 'dbadmin', password: 'FAKE_DB_PASS_Xk9!mQ2@' } } } } } });
    }

    /* ───────────────────────────────────────────
       2. SWAGGER / OPENAPI
    ─────────────────────────────────────────── */
    if (p === '/v2/api-docs' || p === '/api-docs' || p === '/swagger.json') {
        return j({
            swagger: '2.0',
            info: { title: 'Grand Library API', description: 'One Piece CTF Lab API', version: '1.0.0', contact: { email: 'admin@grand-library.local' } },
            host: '192.168.1.121:3000',
            basePath: '/api',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            paths: {
                '/admin/users': { get: { summary: 'List all users (admin only)', tags: ['Admin'] } },
                '/admin/config': { get: { summary: 'Get server config', tags: ['Admin'] } },
                '/users/login': { post: { summary: 'Login and get JWT token', tags: ['Auth'] } },
                '/bounties': { get: { summary: 'List all bounties', tags: ['Public'] } },
                '/internal/secret': { get: { summary: 'Internal secrets endpoint', tags: ['Internal'] } },
            },
        });
    }

    if (p === '/v3/api-docs') {
        return j({ openapi: '3.0.1', info: { title: 'Grand Library API', version: '1.0.0' }, paths: { '/api/admin': { get: { summary: 'Admin endpoint' } }, '/api/users': { get: { summary: 'Get users' } } }, components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } } });
    }

    if (p === '/swagger-ui.html' || p === '/swagger-ui/' || p === '/swagger-ui/index.html') {
        return h(`<!DOCTYPE html><html><head><title>Swagger UI - Grand Library</title>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"/>
</head><body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
<script>SwaggerUIBundle({url:"/v2/api-docs",dom_id:"#swagger-ui",presets:[SwaggerUIBundle.presets.apis],layout:"BaseLayout"})</script>
</body></html>`);
    }

    /* ───────────────────────────────────────────
       3. GRAPHQL INTROSPECTION
    ─────────────────────────────────────────── */
    if (p === '/graphql') {
        const body = req.method === 'POST' ? { data: { __schema: { queryType: { name: 'Query' }, mutationType: { name: 'Mutation' }, subscriptionType: null, types: [{ kind: 'OBJECT', name: 'Query', fields: [{ name: 'user', args: [{ name: 'id', type: { name: 'ID' } }] }, { name: 'bounties', args: [] }, { name: 'admin', args: [{ name: 'token', type: { name: 'String' } }] }] }, { kind: 'OBJECT', name: 'User', fields: [{ name: 'id' }, { name: 'username' }, { name: 'password_hash' }, { name: 'role' }, { name: 'email' }] }, { kind: 'OBJECT', name: 'Mutation', fields: [{ name: 'login', args: [{ name: 'username' }, { name: 'password' }] }, { name: 'createUser', args: [{ name: 'input', type: { name: 'UserInput' } }] }] }] } } } : { data: null, errors: [{ message: 'Must provide query string.' }] };
        return j(body);
    }

    /* ───────────────────────────────────────────
       4. ELASTICSEARCH
    ─────────────────────────────────────────── */
    if (p === '/_cat/indices' || p === '/_cat/indices/') {
        return t(`green open grand_library_users abc123xyz 1 0 1542  0 1.2mb 1.2mb
green open bounties_index       def456uvw 1 0  842  0 0.8mb 0.8mb
green open forum_posts          ghi789rst 1 0 3201  0 2.1mb 2.1mb
yellow open admin_audit_log     jkl012mno 1 1  201  0 0.3mb 0.3mb`);
    }

    if (p === '/_cat/nodes' || p === '/_cat/health') {
        return t(`epoch      timestamp cluster       status node.total node.data
1708339200 14:00:00  grand-cluster green          1         1`);
    }

    if (p === '/_cluster/health') {
        return j({ cluster_name: 'grand-library-cluster', status: 'green', number_of_nodes: 1, number_of_data_nodes: 1, active_primary_shards: 4, active_shards: 4 });
    }



    /* ───────────────────────────────────────────
       5. APACHE SOLR
    ─────────────────────────────────────────── */
    if (p.startsWith('/solr')) {
        return j({ responseHeader: { status: 0, QTime: 3 }, initFailures: {}, status: { grand_library: { name: 'grand_library', instanceDir: '/opt/solr/server/solr/grand_library/', dataDir: '/opt/solr/server/solr/grand_library/data/', config: 'solrconfig.xml', schema: 'managed-schema', startTime: '2026-01-01T00:00:00Z', uptime: 5184000000 } } });
    }

    /* ───────────────────────────────────────────
       6. JOLOKIA JMX
    ─────────────────────────────────────────── */
    if (p.startsWith('/jolokia')) {
        return j({ request: { type: 'list' }, value: { 'java.lang': { 'type=Memory': { desc: 'Information on the management interface of the MBean', attr: { HeapMemoryUsage: { rw: false, type: 'javax.management.openmbean.CompositeData', desc: 'Current heap memory usage' }, NonHeapMemoryUsage: { rw: false, type: 'javax.management.openmbean.CompositeData' } } } }, 'com.grandlibrary': { 'type=Application': { attr: { AdminPassword: { rw: true, type: 'java.lang.String', desc: 'FAKE_ADMIN_PASS_jolokia' } } } } }, status: 200, timestamp: 1708339200 });
    }

    /* ───────────────────────────────────────────
       7. ADMIN PANELS
    ─────────────────────────────────────────── */
    if (p.startsWith('/jenkins')) {
        return h(`<!DOCTYPE html><html><head><title>Dashboard [Jenkins]</title>
<link rel="stylesheet" href="/jenkins/static/main.css"/>
</head><body><div id="page-body">
<div id="login-field"><h1>Sign in to Jenkins</h1>
<form method="post" action="/j_spring_security_check">
<input type="text" name="j_username" placeholder="Username"/>
<input type="password" name="j_password" placeholder="Password"/>
<input type="submit" value="Sign in" class="btn"/>
</form></div>
<div id="footer"><span class="jenkins_ver">Jenkins ver. 2.150</span></div>
</div></body></html>`);
    }

    if (p.startsWith('/grafana')) {
        return h(`<!DOCTYPE html><html><head><title>Grafana</title></head><body>
<div class="login-content grafana-app">
<div ng-controller="LoginCtrl">
<h1 class="logo-text">Grafana</h1>
<input type="text" name="user" ng-model="formModel.user" placeholder="email or username"/>
<input type="password" name="password" ng-model="formModel.password"/>
<button ng-click="submit()">Log in</button>
</div></div>
<script src="public/build/grafana.main.js"></script>
<script>window.__grafana_version__='8.3.4';</script>
</body></html>`);
    }

    if (p.startsWith('/kibana')) {
        return h(`<!DOCTYPE html><html><head><title>Kibana</title></head><body>
<kbn-app><kbn-chrome>
<script>window.KIBANA_VERSION='7.10.0';window.KIBANA_BUILD_NUMBER='32517';
window.KIBANA_COMMIT_SHA='d3ef3d3';</script>
<div class="login-form"><h1>Kibana</h1>
<input type="text" name="username" placeholder="Username"/>
<input type="password" name="password" placeholder="Password"/>
</div></kbn-chrome></kbn-app>
</body></html>`);
    }

    if (p.startsWith('/portainer')) {
        return h(`<!DOCTYPE html><html><head><title>Portainer</title></head><body>
<div ng-app="portainer" ng-controller="AuthenticationController">
<div class="logo"><img src="/images/logo_alt.svg" alt="Portainer" /></div>
<h1>Portainer</h1>
<input type="text" ng-model="formValues.Username" placeholder="Username"/>
<input type="password" ng-model="formValues.Password" placeholder="Password"/>
<button ng-click="authenticateUser()">Log in</button>
</div></body></html>`);
    }

    if (p === '/wp-login.php' || p.startsWith('/wp-admin')) {
        return h(`<!DOCTYPE html><html><head>
<title>Log In &#8249; Grand Library &#8212; WordPress</title>
<link rel="stylesheet" href="/wp-includes/css/buttons.css"/>
</head><body class="login">
<div id="login"><h1><a href="https://wordpress.org/">Grand Library</a></h1>
<form name="loginform" id="loginform" action="/wp-login.php" method="post">
<p><label>Username or Email Address<br/>
<input type="text" name="log" id="user_login" size="20"/></label></p>
<p><label>Password<br/>
<input type="password" name="pwd" id="user_pass" size="20"/></label></p>
<p class="submit"><input type="submit" name="wp-submit" id="wp-submit" value="Log In"/>
<input type="hidden" name="redirect_to" value="/wp-admin/"/>
<input type="hidden" name="testcookie" value="1"/>
</p></form>
<p id="backtoblog"><a href="/">&#8592; Go to Grand Library</a></p>
</div>
<script>var wpLoginL10n={"user_login_required":"Please enter your username."};</script>
</body></html>`);
    }

    if (p.startsWith('/phpmyadmin')) {
        return h(`<!DOCTYPE html><html><head>
<title>phpMyAdmin</title>
<link rel="stylesheet" type="text/css" href="phpmyadmin.css"/>
</head><body>
<div id="pma_navigation"><div id="pma_navigation_header">
<a class="pma_navigation_tree" href="index.php">phpMyAdmin</a>
</div></div>
<div id="pma_main_container">
<div class="login-form"><h2>phpMyAdmin</h2>
<form action="index.php" method="post">
<input type="text" name="pma_username" id="input_username" placeholder="Username"/>
<input type="password" name="pma_password" id="input_password" placeholder="Password"/>
<input type="hidden" name="server" value="1"/>
<input type="submit" value="Go" id="input_go"/>
</form>
<div>phpMyAdmin 5.1.3</div>
</div></div>
</body></html>`);
    }

    if (p === '/adminer.php' || p.startsWith('/adminer')) {
        return h(`<!DOCTYPE html><html><head>
<title>Adminer</title>
<script src="adminer.js"></script>
</head><body>
<div id="login"><form action="adminer.php" method="post">
<table><tr><th>System</th><td><select name="auth[driver]">
<option value="server">MySQL</option><option value="pgsql">PostgreSQL</option>
</select></td></tr>
<tr><th>Server</th><td><input type="text" name="auth[server]" value="localhost"/></td></tr>
<tr><th>Username</th><td><input type="text" name="auth[username]" value="root"/></td></tr>
<tr><th>Password</th><td><input type="password" name="auth[password]"/></td></tr>
<tr><th>Database</th><td><input type="text" name="auth[db]" value="grand_library"/></td></tr>
<tr><td></td><td><input type="submit" value="Login"/></td></tr>
</table></form>
<p>Adminer 4.8.1</p></div>
</body></html>`);
    }

    if (p.startsWith('/manager/html') || p.startsWith('/manager/')) {
        const auth = req.headers.get('authorization');
        if (!auth) {
            return new NextResponse(
                `<html><head><title>401 Unauthorized</title></head><body><h1>401 Unauthorized</h1><p>This server could not verify that you are authorized to access the document requested.</p></body></html>`,
                { status: 401, headers: { 'Content-Type': 'text/html', 'WWW-Authenticate': 'Basic realm="Tomcat Manager Application"' } }
            );
        }
        return h(`<html><head><title>Tomcat Web Application Manager</title></head><body>
<h1>Tomcat Web Application Manager</h1>
<p>Apache Tomcat/9.0.65</p>
</body></html>`);
    }

    /* ───────────────────────────────────────────
       8. EXPOSED FILES
    ─────────────────────────────────────────── */
    if (p === '/server-status') {
        return h(`<!DOCTYPE html><html><head><title>Apache Status</title></head><body>
<h1>Apache Server Status for 192.168.1.121</h1>
<dl><dt>Server Version: <b>Apache/2.4.49 (Unix)</b></dt>
<dt>Server MPM: <b>event</b></dt>
<dt>Server Built: <b>Jan 01 2026 00:00:00</b></dt>
</dl>
<pre>Total Accesses: 12345   Total Traffic: 67 MB
Requests per second: 2.34
Bytes per second: 1234
Bytes per request: 528</pre>
<table border="0"><tr><th>Srv</th><th>PID</th><th>Acc</th><th>M</th><th>Request</th></tr>
<tr><td>0-0</td><td>1234</td><td>0/12/34</td><td>W</td><td>GET /api/admin/users HTTP/1.1</td></tr>
</table>
</body></html>`);
    }

    if (p === '/phpinfo.php' || p === '/info.php' || p === '/php-info.php') {
        return h(`<!DOCTYPE html><html><head><title>phpinfo()</title></head><body>
<table border="0" cellpadding="3" width="600">
<tr class="h"><td colspan="2"><h1 class="p">PHP Version 7.2.1</h1></td></tr>
<tr><td>System</td><td>Linux grand-library 5.15.0 #1 SMP x86_64</td></tr>
<tr><td>PHP Extension</td><td>Core, date, ereg, libxml, openssl, pcre, sqlite3, zlib</td></tr>
<tr><td>PHP Version</td><td>7.2.1</td></tr>
<tr><td>Loaded Configuration File</td><td>/etc/php/7.2/apache2/php.ini</td></tr>
</table>
<h2>phpinfo() output</h2>
<h2>Environment</h2>
<table><tr><td>DB_PASSWORD</td><td>FAKE_DB_PASS</td></tr>
<tr><td>APP_SECRET</td><td>FAKE_APP_SECRET</td></tr>
</table>
</body></html>`);
    }

    if (p === '/package.json' || p === '/package-lock.json') {
        return j({ name: 'grand-library', version: '1.0.0', description: 'Grand Line Intelligence Network', main: 'server.js', scripts: { start: 'node server.js', dev: 'next dev', build: 'next build' }, dependencies: { next: '16.1.6', react: '19.2.3', express: '4.18.2', jsonwebtoken: '8.5.1', mysql2: '3.6.1', axios: '1.6.2' }, devDependencies: { typescript: '5.3.3' }, engines: { node: '>=18.0.0' } });
    }

    if (p === '/composer.json') {
        return j({ name: 'grandlibrary/app', description: 'Grand Library application', require: { 'php': '>=7.2', 'laravel/framework': '^9.0', 'tymon/jwt-auth': '^2.0', 'intervention/image': '^2.7' }, config: { 'process-timeout': 0 }, extra: { 'laravel': { 'providers': ['App\\Providers\\AppServiceProvider'] } } });
    }

    if (p === '/Dockerfile') {
        return t(`FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

# VULNERABILITY: secrets in Dockerfile
ENV DB_PASSWORD=FAKE_DB_PASS_Xk9mQ2
ENV API_SECRET=FAKE_SECRET_abc123xyz
ENV JWT_SECRET=FAKE_JWT_onepiece_1337
ENV REDIS_URL=redis://:FAKE_REDIS_PASS@redis:6379/0
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "server.js"]`);
    }

    if (p === '/docker-compose.yml' || p === '/docker-compose.yaml') {
        return t(`version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - DB_PASSWORD=FAKE_DB_PASS_Xk9!mQ2
      - JWT_SECRET=FAKE_JWT_SECRET_onepiece
      - API_SECRET=FAKE_API_SECRET_abc123

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: FAKE_ROOT_PASS_R00t!
      MYSQL_DATABASE: grand_library
      MYSQL_USER: dbadmin
      MYSQL_PASSWORD: FAKE_DB_PASS_Xk9!mQ2

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass FAKE_REDIS_PASS_r3d1s`);
    }

    if (p === '/backup.sql' || p === '/dump.sql' || p === '/db.sql' || p === '/database.sql' || p === '/grand_library.sql') {
        return t(`-- MySQL dump 10.19  Distrib 8.0.36, for Linux (x86_64)
-- Host: localhost    Database: grand_library
-- Server version: 8.0.36
-- VULNERABILITY: Exposed SQL Backup — OPS{SQL_BACKUP_EXPOSED}
CREATE TABLE \`users\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`username\` varchar(100) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`role\` varchar(50) DEFAULT 'user',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB;

INSERT INTO \`users\` VALUES
(1,'admin','FAKE_HASH_5f4dcc3b5aa765d61d8327deb882cf99','admin'),
(2,'luffy','FAKE_HASH_d8578edf8458ce06fbc5bb76a58c5ca4','captain'),
(3,'nami','FAKE_HASH_abc123def456ghi789jkl012mno345pq','navigator');

CREATE TABLE \`api_keys\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`service\` varchar(100) DEFAULT NULL,
  \`key_value\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB;

INSERT INTO \`api_keys\` VALUES
(1,'stripe','FAKE_STRIPE_KEY_sk_live_abcdef123456'),
(2,'aws','FAKE_AWS_KEY_AKIA1234567890ABCD');`);
    }

    if (p === '/id_rsa' || p === '/private_key.pem' || p === '/server.key' || p === '/key.pem') {
        return t(`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0FAKE1PRIVATE2KEY3FOR4CTF5LAB6GRAND7LIBRARY8ONE
PIECE9CTF0ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
FAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKE
+FAKEKEY/FAKEKEY+FAKEKEY/FAKEKEY+FAKEKEY/FAKEKEY+FAKEKEY/FAKE==
-----END RSA PRIVATE KEY-----
# FLAG: OPS{SSH_PRIVATE_KEY_EXPOSED}`);
    }

    /* ───────────────────────────────────────────
       9. SPRING TRACE / H2 / CONSOLE
    ─────────────────────────────────────────── */
    if (p === '/trace') {
        return j({ traces: [{ timestamp: '2026-02-19T08:30:00Z', info: { method: 'GET', path: '/api/admin/users', headers: { request: { Authorization: 'Bearer FAKE_TOKEN' } }, timeTaken: '12' } }] });
    }

    if (p === '/h2-console' || p === '/h2-console/') {
        return h(`<!DOCTYPE html><html><head><title>H2 Console</title></head><body>
<script>location.href='/h2-console/login.jsp'</script>
<h1>H2 Database Engine</h1>
<p>H2 Console - Web-based database management</p>
<form method="POST" action="login.jsp">
<input type="text" name="url" value="jdbc:h2:~/grand_library"/>
<input type="text" name="user" value="sa"/>
<input type="password" name="password"/>
<input type="submit" value="Connect"/>
</form>
<p>H2 Console 2.1.214</p>
</body></html>`);
    }

    if (p === '/console') {
        return h(`<!DOCTYPE html><html><head><title>Grails Console</title></head><body>
<div id="main-content"><h1>Groovy/Grails Console</h1>
<div id="console-wrapper"><textarea id="code"></textarea>
<input type="button" value="Execute" id="execute"/>
</div></div></body></html>`);
    }

    /* ───────────────────────────────────────────
       10. PROFILER / DEBUG PANELS
    ─────────────────────────────────────────── */
    if (p.startsWith('/_profiler')) {
        return h(`<!DOCTYPE html><html><head><title>Symfony Profiler</title></head><body>
<div id="sfwdt"><div class="sfwdt-link">Symfony</div>
<table class="sfwdt-profile">
<tr><th>Request</th><td>GET /_profiler</td></tr>
<tr><th>Status</th><td>200</td></tr>
<tr><th>Controller</th><td>App\\Controller\\HomeController::index</td></tr>
<tr><th>Route</th><td>app_home</td></tr>
<tr><th>DB Queries</th><td>12 (FAKE_DB_PASS used)</td></tr>
</table></div></body></html>`);
    }

    if (p.startsWith('/telescope')) {
        return h(`<!DOCTYPE html><html><head><title>Laravel Telescope</title></head><body>
<div id="app"><telescope-application>
<h2>Laravel Telescope</h2>
<span class="version">Telescope 4.9</span>
</telescope-application></div>
<script src="/vendor/telescope/app.js"></script>
</body></html>`);
    }

    if (p.startsWith('/horizon')) {
        return h(`<!DOCTYPE html><html><head><title>Laravel Horizon</title></head><body>
<div id="app"><horizon-application>
<h2>Laravel Horizon</h2>
</horizon-application></div>
<script src="/vendor/horizon/app.js"></script>
</body></html>`);
    }

    if (p.startsWith('/debug')) {
        return j({ environment: 'development', debug: true, app_key: 'FAKE_APP_KEY_base64encoded==', db_connection: 'mysql', db_host: '127.0.0.1', db_password: 'FAKE_DEBUG_PASS', session_driver: 'file', cache_driver: 'redis', queue_connection: 'redis', redis_password: 'FAKE_REDIS_PASS' });
    }



    /* ───────────────────────────────────────────
       12. CERTIFICATE / MISC
    ─────────────────────────────────────────── */
    if (p === '/crossdomain.xml') {
        return xml(`<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
<!-- VULNERABILITY: Wildcard Flash cross-domain policy -->
<cross-domain-policy>
  <allow-access-from domain="*" />
  <allow-http-request-headers-from domain="*" headers="*" />
</cross-domain-policy>`);
    }

    if (p === '/clientaccesspolicy.xml') {
        return xml(`<?xml version="1.0" encoding="utf-8"?>
<!-- VULNERABILITY: Wildcard Silverlight cross-domain policy -->
<access-policy>
  <cross-domain-access>
    <policy>
      <allow-from http-request-headers="*">
        <domain uri="*"/>
      </allow-from>
      <grant-to>
        <resource path="/" include-subpaths="true"/>
      </grant-to>
    </policy>
  </cross-domain-access>
</access-policy>`);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/actuator/:path*',
        '/v2/api-docs', '/v3/api-docs', '/api-docs', '/swagger.json', '/swagger-ui.html', '/swagger-ui/:path*',
        '/graphql',
        '/_cat/:path*', '/_cluster/:path*',
        '/solr/:path*',
        '/jolokia/:path*',
        '/jenkins/:path*',
        '/grafana/:path*',
        '/kibana/:path*',
        '/portainer/:path*',
        '/wp-login.php', '/wp-admin/:path*',
        '/phpmyadmin/:path*',
        '/adminer.php', '/adminer/:path*',
        '/manager/:path*',
        '/_profiler/:path*',
        '/telescope/:path*',
        '/horizon/:path*',
        '/debug/:path*',
        '/server-status',
        '/phpinfo.php', '/info.php', '/php-info.php',
        '/backup.sql', '/dump.sql', '/db.sql', '/database.sql', '/grand_library.sql',
        '/package.json', '/package-lock.json',
        '/composer.json',
        '/Dockerfile',
        '/docker-compose.yml', '/docker-compose.yaml',
        '/id_rsa', '/private_key.pem', '/server.key', '/key.pem',
        '/trace',
        '/h2-console', '/h2-console/:path*',
        '/console',
        '/crossdomain.xml',
        '/clientaccesspolicy.xml',
    ],
};
