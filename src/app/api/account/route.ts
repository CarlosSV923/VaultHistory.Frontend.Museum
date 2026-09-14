import { NextRequest, NextResponse } from 'next/server';
import { forwardResponse, sessionCookieName, sessionToken, unauthorizedResponse, userRequest } from '@/shared/server/backend';

async function authenticatedUserRequest(path: string, init?: RequestInit) {
    const token = await sessionToken();
    if (!token) return unauthorizedResponse();
    try { return forwardResponse(await userRequest(path, init, token)); }
    catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : 'No se pudo conectar con User.' }, { status: 503 }); }
}

export async function GET() { return authenticatedUserRequest(''); }

export async function PUT(request: NextRequest) {
    const body = await request.text();
    if (!body) return NextResponse.json({ message: 'No hay cambios para guardar.' }, { status: 400 });
    return authenticatedUserRequest('', { method: 'PUT', body });
}

export async function DELETE() {
    const response = await authenticatedUserRequest('', { method: 'DELETE' });
    if (response.ok) response.cookies.set(sessionCookieName, '', { httpOnly: true, path: '/', expires: new Date(0) });
    return response;
}
