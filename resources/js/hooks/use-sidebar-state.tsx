import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sidebar_collapsed';

/**
 * Hook to manage sidebar collapsed state with localStorage persistence
 */
export function useSidebarState() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = useCallback(() => {
        setCollapsed(prev => {
            const newValue = !prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
            return newValue;
        });
    }, []);

    const updateCollapsed = useCallback((value: boolean) => {
        setCollapsed(value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }, []);

    useEffect(() => {
        // Load persisted state on mount
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            try {
                setCollapsed(JSON.parse(stored));
            } catch {
                // Invalid JSON, use default
                setCollapsed(false);
            }
        }
    }, []);

    return { collapsed, toggleCollapsed, updateCollapsed } as const;
}
