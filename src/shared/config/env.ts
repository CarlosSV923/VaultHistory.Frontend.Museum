type PublicEnvironment = { historyApiUrl?: string; };

function optionalUrl(value: string | undefined, name: string): string | undefined {
    if (!value) return undefined;
    try { return new URL(value).toString().replace(/\/$/, ''); } catch { throw new Error(`${name} must be an absolute URL`); }
}

export const publicEnvironment: PublicEnvironment = {
    historyApiUrl: optionalUrl(process.env.NEXT_PUBLIC_HISTORY_API_URL, 'NEXT_PUBLIC_HISTORY_API_URL'),
};

export function readServerEnvironment() {
    const frontendToken = process.env.HISTORY_FRONTEND_TOKEN;
    const historyApiUrl = optionalUrl(
        process.env.HISTORY_API_URL ?? process.env.NEXT_PUBLIC_HISTORY_API_URL,
        'HISTORY_API_URL',
    );
    if (!frontendToken) throw new Error('HISTORY_FRONTEND_TOKEN is required on the server');
    if (!historyApiUrl) throw new Error('HISTORY_API_URL is required on the server');
    return { historyApiUrl, historyFrontendToken: frontendToken };
}

export function readUserServerEnvironment() {
    const userApiUrl = optionalUrl(
        process.env.USER_API_URL,
        'USER_API_URL',
    );
    if (!userApiUrl) throw new Error('USER_API_URL is required on the server');
    return { userApiUrl };
}
