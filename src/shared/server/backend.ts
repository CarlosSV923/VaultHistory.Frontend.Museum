import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { readServerEnvironment, readUserServerEnvironment } from '@/shared/config/env';

export const sessionCookieName = 'vault_history_session';

export async function sessionToken() {
    return (await cookies()).get(sessionCookieName)?.value;
}

export function unauthorizedResponse() {
    return NextResponse.json({ message: 'Tu sesión no es válida o ha expirado. Inicia sesión para continuar.' }, { status: 401 });
}

export async function forwardResponse(response: Response) {
    const contentType = response.headers.get('content-type') ?? 'application/json';
    const body = await response.text();
    return new NextResponse(body || null, { status: response.status, headers: { 'Content-Type': contentType } });
}

export async function userRequest(path: string, init: RequestInit = {}, token?: string) {
    const { userApiUrl } = readUserServerEnvironment();
    return fetch(`${userApiUrl}/api/v1/user${path}`, {
        ...init,
        cache: 'no-store',
        headers: {
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init.headers,
        },
    });
}

export async function historyRequest(path: string, init: RequestInit = {}, token?: string) {
    const { historyApiUrl } = readServerEnvironment();
    return fetch(`${historyApiUrl}/api/v1/history${path}`, {
        ...init,
        cache: 'no-store',
        headers: {
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init.headers,
        },
    });
}
