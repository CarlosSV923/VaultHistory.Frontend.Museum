/* @vitest-environment node */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ cookies: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: mocks.cookies }));

import { NextRequest } from 'next/server';
import { GET } from './route';

describe('GET /api/histories', () => {
  const originalHistoryApiUrl = process.env.HISTORY_API_URL;
  const originalHistoryToken = process.env.HISTORY_FRONTEND_TOKEN;

  beforeEach(() => {
    process.env.HISTORY_API_URL = 'http://history.test';
    process.env.HISTORY_FRONTEND_TOKEN = 'internal-token-not-exposed';
    mocks.cookies.mockResolvedValue({ get: () => ({ value: 'reader-jwt' }) });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    process.env.HISTORY_API_URL = originalHistoryApiUrl;
    process.env.HISTORY_FRONTEND_TOKEN = originalHistoryToken;
  });

  it('forwards only allowed filters and the HTTP-only cookie token to History', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ histories: [], meta: { page: 2, pageSize: 12, total: 0, totalPages: 0 } }), { status: 200, headers: { 'Content-Type': 'application/json' } })));

    const response = await GET(new NextRequest('http://frontend.test/api/histories?page=2&theme=misterio&unexpected=value'));

    expect(fetch).toHaveBeenCalledWith('http://history.test/api/v1/history/list?page=2&theme=misterio', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer reader-jwt' }), cache: 'no-store' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ meta: { page: 2 } });
  });

  it('fails closed when no authenticated cookie exists', async () => {
    mocks.cookies.mockResolvedValue({ get: () => undefined });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET(new NextRequest('http://frontend.test/api/histories'));

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
