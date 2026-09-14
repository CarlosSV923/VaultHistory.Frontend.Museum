import { NextResponse } from 'next/server';
import { sessionCookieName } from '@/shared/server/backend';

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookieName, '', { httpOnly: true, path: '/', expires: new Date(0) });
    return response;
}
