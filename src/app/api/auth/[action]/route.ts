import { NextRequest, NextResponse } from 'next/server';
import { forwardResponse, sessionCookieName, userRequest } from '@/shared/server/backend';

const actions = { 'sign-in': 'signin', register: 'signup' } as const;
type Action = keyof typeof actions;

export async function POST(request: NextRequest, context: RouteContext<'/api/auth/[action]'>) {
    const { action } = await context.params;
    if (!(action in actions)) return NextResponse.json({ message: 'Authentication action not found.' }, { status: 404 });

    const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!payload || typeof payload.email !== 'string' || typeof payload.password !== 'string') {
        return NextResponse.json({ message: 'Email y contraseña son obligatorios.' }, { status: 400 });
    }

    try {
        const response = await userRequest(`/${actions[action as Action]}`, { method: 'POST', body: JSON.stringify(payload) });
        if (!response.ok) return forwardResponse(response);
        const result = await response.json() as { token?: string; expiration?: string };
        if (!result.token || !result.expiration) return NextResponse.json({ message: 'User returned an invalid session response.' }, { status: 502 });

        const expiresAt = new Date(result.expiration);
        if (Number.isNaN(expiresAt.valueOf())) return NextResponse.json({ message: 'User returned an invalid session expiry.' }, { status: 502 });
        const responseToClient = NextResponse.json({ expiresAt: expiresAt.toISOString() }, { status: 200 });
        responseToClient.cookies.set(sessionCookieName, result.token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            expires: expiresAt,
        });
        return responseToClient;
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : 'No se pudo conectar con User.' }, { status: 503 });
    }
}
