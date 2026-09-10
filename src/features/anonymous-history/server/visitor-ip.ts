export function resolveVisitorIp(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    return forwarded || headers.get('x-real-ip') || '127.0.0.1';
}
