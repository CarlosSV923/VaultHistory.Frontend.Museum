'use client';

export async function responseMessage(response: Response, fallback: string) {
    const body = await response.json().catch(() => null) as { message?: string; Message?: string } | null;
    return body?.message ?? body?.Message ?? fallback;
}

export function isSessionExpired(response: Response) {
    return response.status === 401;
}
