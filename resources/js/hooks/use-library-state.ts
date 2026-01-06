import { useLibraryStore, type SortField, type SortOrder, type ViewMode } from '@/stores/library-store';
import { useCallback, useMemo } from 'react';

/**
 * Hook for accessing library state with convenient selectors and memoized values.
 */
export function useLibraryState() {
    // View preferences
    const viewMode = useLibraryStore((state) => state.viewMode);
    const sortBy = useLibraryStore((state) => state.sortBy);
    const sortOrder = useLibraryStore((state) => state.sortOrder);

    // UI state
    const librarySidebarCollapsed = useLibraryStore((state) => state.librarySidebarCollapsed);
    const previewPanelVisible = useLibraryStore((state) => state.previewPanelVisible);
    const expandedFolders = useLibraryStore((state) => state.expandedFolders);
    const selectedItem = useLibraryStore((state) => state.selectedItem);

    // Actions
    const setViewMode = useLibraryStore((state) => state.setViewMode);
    const setSortBy = useLibraryStore((state) => state.setSortBy);
    const setSortOrder = useLibraryStore((state) => state.setSortOrder);
    const toggleSort = useLibraryStore((state) => state.toggleSort);
    const toggleLibrarySidebar = useLibraryStore((state) => state.toggleLibrarySidebar);
    const setLibrarySidebarCollapsed = useLibraryStore((state) => state.setLibrarySidebarCollapsed);
    const togglePreviewPanel = useLibraryStore((state) => state.togglePreviewPanel);
    const setPreviewPanelVisible = useLibraryStore((state) => state.setPreviewPanelVisible);
    const toggleFolderExpanded = useLibraryStore((state) => state.toggleFolderExpanded);
    const setExpandedFolders = useLibraryStore((state) => state.setExpandedFolders);
    const setSelectedItem = useLibraryStore((state) => state.setSelectedItem);
    const clearSelection = useLibraryStore((state) => state.clearSelection);

    // Computed values
    const isGridView = useMemo(() => viewMode === 'grid', [viewMode]);
    const isListView = useMemo(() => viewMode === 'list', [viewMode]);
    const hasSelection = useMemo(() => selectedItem !== null, [selectedItem]);

    // Check if a folder is expanded
    const isFolderExpanded = useCallback((folderId: number) => expandedFolders.includes(folderId), [expandedFolders]);

    // Get sort params for API calls
    const sortParams = useMemo(
        () => ({
            sort_by: sortBy === 'date' ? 'created_at' : sortBy,
            sort_dir: sortOrder,
        }),
        [sortBy, sortOrder],
    );

    return {
        // State
        viewMode,
        sortBy,
        sortOrder,
        librarySidebarCollapsed,
        previewPanelVisible,
        expandedFolders,
        selectedItem,

        // Computed
        isGridView,
        isListView,
        hasSelection,
        sortParams,

        // Actions
        setViewMode,
        setSortBy,
        setSortOrder,
        toggleSort,
        toggleLibrarySidebar,
        setLibrarySidebarCollapsed,
        togglePreviewPanel,
        setPreviewPanelVisible,
        toggleFolderExpanded,
        setExpandedFolders,
        setSelectedItem,
        clearSelection,
        isFolderExpanded,
    };
}

// Re-export types for convenience
export type { SortField, SortOrder, ViewMode };
