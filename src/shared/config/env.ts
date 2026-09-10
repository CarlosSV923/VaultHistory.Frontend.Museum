type PublicEnvironment = { historyApiUrl?: string; userApiUrl?: string; };

function optionalUrl(value: string | undefined, name: string): string | undefined {
    if (!value) return undefined;
    try { return new URL(value).toString().replace(/\/$/, ''); } catch { throw new Error(`${name} must be an absolute URL`); }
}

export const publicEnvironment: PublicEnvironment = {
    historyApiUrl: optionalUrl(process.env.NEXT_PUBLIC_HISTORY_API_URL, 'NEXT_PUBLIC_HISTORY_API_URL'),
    userApiUrl: optionalUrl(process.env.NEXT_PUBLIC_USER_API_URL, 'NEXT_PUBLIC_USER_API_URL'),
};

export function readServerEnvironment() {
    const frontendToken = process.env.HISTORY_FRONTEND_TOKEN;
    if (!frontendToken) throw new Error('HISTORY_FRONTEND_TOKEN is required on the server');
    return { historyFrontendToken: frontendToken };
}
