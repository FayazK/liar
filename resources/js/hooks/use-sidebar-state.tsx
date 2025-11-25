import { useSidebarStore } from '@/stores/sidebar-store';

/**
 * Hook to manage sidebar collapsed state with localStorage persistence.
 * Uses Zustand store under the hood.
 */
export function useSidebarState() {
    const collapsed = useSidebarStore((state) => state.collapsed);
    const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
    const updateCollapsed = useSidebarStore((state) => state.setCollapsed);

    return { collapsed, toggleCollapsed, updateCollapsed } as const;
}
