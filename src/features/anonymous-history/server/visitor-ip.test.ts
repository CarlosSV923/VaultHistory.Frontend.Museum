import { describe, expect, it } from 'vitest';
import { resolveVisitorIp } from './visitor-ip';

describe('resolveVisitorIp', () => {
    it('uses the first forwarded address', () => {
        expect(resolveVisitorIp(new Headers({ 'x-forwarded-for': '203.0.113.8, 10.0.0.2' }))).toBe('203.0.113.8');
    });

    it('uses the local development fallback when proxy headers are absent', () => {
        expect(resolveVisitorIp(new Headers())).toBe('127.0.0.1');
    });
});
