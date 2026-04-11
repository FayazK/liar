import axios from '@/lib/axios';

function getCsrfToken(): string {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

export async function streamGeneration(
    url: string,
    body: Record<string, unknown>,
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: string) => void,
    signal?: AbortSignal,
): Promise<void> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
                Accept: 'text/event-stream',
            },
            body: JSON.stringify(body),
            signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            onError(errorData?.message ?? `Request failed with status ${response.status}`);
            return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            onError('No response stream available');
            return;
        }

        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            onChunk(text);
        }
        onComplete();
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        onError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}

export async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
    const response = await axios.post<T>(url, body);
    return response.data;
}
