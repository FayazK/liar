import { useCallback, useRef, useState } from 'react';
import { streamGeneration } from '../lib/ai-api';

interface UseAiGenerationReturn {
    generate: (url: string, body: Record<string, unknown>) => void;
    result: string;
    isGenerating: boolean;
    error: string | null;
    abort: () => void;
    reset: () => void;
}

export function useAiGeneration(): UseAiGenerationReturn {
    const [result, setResult] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const abort = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        setIsGenerating(false);
    }, []);

    const reset = useCallback(() => {
        setResult('');
        setError(null);
        setIsGenerating(false);
    }, []);

    const generate = useCallback(
        (url: string, body: Record<string, unknown>) => {
            abort();
            setResult('');
            setError(null);
            setIsGenerating(true);

            const controller = new AbortController();
            abortControllerRef.current = controller;

            streamGeneration(
                url,
                body,
                (chunk) => setResult((prev) => prev + chunk),
                () => setIsGenerating(false),
                (err) => {
                    setError(err);
                    setIsGenerating(false);
                },
                controller.signal,
            );
        },
        [abort],
    );

    return { generate, result, isGenerating, error, abort, reset };
}
