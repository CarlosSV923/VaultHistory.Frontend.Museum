import { NextRequest, NextResponse } from 'next/server';
import { forwardResponse, sessionToken, unauthorizedResponse, userRequest } from '@/shared/server/backend';

export async function POST(request: NextRequest) {
    const token = await sessionToken();
    if (!token) return unauthorizedResponse();
    const body = await request.text();
    if (!body) return NextResponse.json({ message: 'Indica la contraseña actual y la nueva contraseña.' }, { status: 400 });
    try { return forwardResponse(await userRequest('/change-password', { method: 'POST', body }, token)); }
    catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : 'No se pudo conectar con User.' }, { status: 503 }); }
}
