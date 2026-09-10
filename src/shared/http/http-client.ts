export class HttpError extends Error { constructor(readonly status: number, message: string) { super(message); } }

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, init);
    if (!response.ok) throw new HttpError(response.status, `Request failed with status ${response.status}`);
    return response.json() as Promise<T>;
}
