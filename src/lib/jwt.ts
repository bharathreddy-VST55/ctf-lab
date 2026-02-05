
import crypto from 'crypto';

const SECRET = 'secret123'; // Weak secret

export function sign(payload: any) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const h = Buffer.from(JSON.stringify(header)).toString('base64url');
    const p = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url');
    return `${h}.${p}.${signature}`;
}

export function verify(token: string) {
    const [h, p, s] = token.split('.');
    if (!h || !p) return null;

    const header = JSON.parse(Buffer.from(h, 'base64url').toString());

    // VULNERABILITY: Accepting "none" algorithm
    if (header.alg && header.alg.toLowerCase() === 'none') {
        return JSON.parse(Buffer.from(p, 'base64url').toString());
    }

    // Normal verification
    const signature = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url');
    if (s === signature) {
        return JSON.parse(Buffer.from(p, 'base64url').toString());
    }

    return null;
}
