import { NextRequest, NextResponse } from 'next/server';
import { resolveVisitorIp } from '@/features/anonymous-history/server/visitor-ip';
import { readServerEnvironment } from '@/shared/config/env';

function configurationError(error: unknown) {
    return NextResponse.json({ code: 'HISTORY_CONFIGURATION_ERROR', message: error instanceof Error ? error.message : 'History is unavailable' }, { status: 503 });
}

async function forward(request: NextRequest, path: string, init?: RequestInit) {
    try {
        const { historyApiUrl, historyFrontendToken } = readServerEnvironment();
        const response = await fetch(`${historyApiUrl}/api/v1/history/${path}`, {
            ...init,
            headers: { Authorization: historyFrontendToken, 'Content-Type': 'application/json', ...init?.headers },
            cache: 'no-store',
        });
        const body = await response.json().catch(() => ({ message: 'Invalid response from History' }));
        return NextResponse.json(body, { status: response.status, headers: response.status === 429 && response.headers.get('retry-after') ? { 'Retry-After': response.headers.get('retry-after')! } : undefined });
    } catch (error) { return configurationError(error); }
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') ?? '1';
    const pageSize = url.searchParams.get('pageSize') ?? '12';
    const query = new URLSearchParams({ ip: resolveVisitorIp(request.headers), page, pageSize });
    return forward(request, `list/anonymous?${query}`);
}

export async function POST(request: NextRequest) {
    const payload = await request.json().catch(() => ({}));
    const body = { ...payload, ip: resolveVisitorIp(request.headers) };
    return forward(request, 'generate/anonymous', { method: 'POST', body: JSON.stringify(body) });
}
