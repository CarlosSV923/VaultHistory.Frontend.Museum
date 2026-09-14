import { NextResponse } from 'next/server';
import { forwardResponse, historyRequest, sessionToken, unauthorizedResponse } from '@/shared/server/backend';

export async function PATCH(_request: Request, context: RouteContext<'/api/histories/[id]'>) {
    const token = await sessionToken();
    if (!token) return unauthorizedResponse();
    const { id } = await context.params;
    if (!id) return NextResponse.json({ message: 'History id is required.' }, { status: 400 });
    try { return forwardResponse(await historyRequest(`/deactivate-by-id/${encodeURIComponent(id)}`, { method: 'PATCH' }, token)); }
    catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : 'No se pudo conectar con History.' }, { status: 503 }); }
}
