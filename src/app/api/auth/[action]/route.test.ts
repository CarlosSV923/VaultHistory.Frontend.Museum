/* @vitest-environment node */

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { NextRequest } from 'next/server';
import { POST } from './route';

describe('POST /api/auth/[action]', () => {
  const originalUserApiUrl = process.env.USER_API_URL;

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.USER_API_URL = originalUserApiUrl;
  });

  it('keeps the User JWT in an HTTP-only cookie and omits it from the JSON response', async () => {
    process.env.USER_API_URL = 'http://user.test';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ token: 'jwt-only-on-server', expiration: '2026-10-01T00:00:00.000Z' }), { status: 200, headers: { 'Content-Type': 'application/json' } })));

    const response = await POST(new NextRequest('http://frontend.test/api/auth/sign-in', { method: 'POST', body: JSON.stringify({ email: 'reader@example.com', password: 'password' }) }), { params: Promise.resolve({ action: 'sign-in' }) });

    expect(fetch).toHaveBeenCalledWith('http://user.test/api/v1/user/signin', expect.objectContaining({ method: 'POST' }));
    expect(await response.json()).toEqual({ expiresAt: '2026-10-01T00:00:00.000Z' });
    expect(response.headers.get('set-cookie')).toContain('vault_history_session=jwt-only-on-server');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  });

  it('rejects an unknown authentication operation before calling User', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(new NextRequest('http://frontend.test/api/auth/unknown', { method: 'POST', body: JSON.stringify({ email: 'reader@example.com', password: 'password' }) }), { params: Promise.resolve({ action: 'unknown' }) });

    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
