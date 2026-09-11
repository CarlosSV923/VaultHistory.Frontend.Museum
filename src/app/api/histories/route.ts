import { NextRequest, NextResponse } from 'next/server';
import { forwardResponse, historyRequest, sessionToken, unauthorizedResponse } from '@/shared/server/backend';

const allowedFilters = new Set(['date', 'theme', 'character', 'type', 'page', 'pageSize']);

async function requestHistory(path: string, init?: RequestInit) {
    const token = await sessionToken();
    if (!token) return unauthorizedResponse();
    try { return forwardResponse(await historyRequest(path, init, token)); }
    catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : 'No se pudo conectar con History.' }, { status: 503 }); }
}

export async function GET(request: NextRequest) {
    const source = new URL(request.url).searchParams;
    const query = new URLSearchParams();
    source.forEach((value, key) => { if (allowedFilters.has(key) && value) query.set(key, value); });
    return requestHistory(`/list${query.size ? `?${query}` : ''}`);
}

export async function POST(request: NextRequest) {
    const body = await request.text();
    if (!body) return NextResponse.json({ message: 'Indica al menos un dato para generar tu historia.' }, { status: 400 });
    return requestHistory('/generate/query', { method: 'POST', body });
}
