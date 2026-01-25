import type { LibraryItem } from '@/types/library';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'grid' | 'list';
export type SortField = 'name' | 'date' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';

interface LibraryPersistedState {
    viewMode: ViewMode;
    sortBy: SortField;
    sortOrder: SortOrder;
    librarySidebarCollapsed: boolean;
    previewPanelVisible: boolean;
    expandedFolders: number[];
}

interface LibraryRuntimeState {
    selectedItem: LibraryItem | null;
}

interface LibraryActions {
    setViewMode: (mode: ViewMode) => void;
    setSortBy: (sort: SortField) => void;
    setSortOrder: (order: SortOrder) => void;
    toggleSort: (field: SortField) => void;
    toggleLibrarySidebar: () => void;
    setLibrarySidebarCollapsed: (collapsed: boolean) => void;
    togglePreviewPanel: () => void;
    setPreviewPanelVisible: (visible: boolean) => void;
    toggleFolderExpanded: (folderId: number) => void;
    setExpandedFolders: (folders: number[]) => void;
    setSelectedItem: (item: LibraryItem | null) => void;
    clearSelection: () => void;
}

type LibraryState = LibraryPersistedState & LibraryRuntimeState & LibraryActions;

export const useLibraryStore = create<LibraryState>()(
    persist(
        (set, get) => ({
            // Persisted state with defaults
            viewMode: 'grid',
            sortBy: 'name',
            sortOrder: 'asc',
            librarySidebarCollapsed: false,
            previewPanelVisible: false,
            expandedFolders: [],

            // Runtime state (not persisted)
            selectedItem: null,

            // Actions
            setViewMode: (mode) => set({ viewMode: mode }),

            setSortBy: (sort) => set({ sortBy: sort }),

            setSortOrder: (order) => set({ sortOrder: order }),

            toggleSort: (field) => {
                const { sortBy, sortOrder } = get();
                if (sortBy === field) {
                    // Toggle order if same field
                    set({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
                } else {
                    // New field, default to ascending (except date which defaults to desc)
                    set({
                        sortBy: field,
                        sortOrder: field === 'date' ? 'desc' : 'asc',
                    });
                }
            },

            toggleLibrarySidebar: () => set((state) => ({ librarySidebarCollapsed: !state.librarySidebarCollapsed })),

            setLibrarySidebarCollapsed: (collapsed) => set({ librarySidebarCollapsed: collapsed }),

            togglePreviewPanel: () => set((state) => ({ previewPanelVisible: !state.previewPanelVisible })),

            setPreviewPanelVisible: (visible) => set({ previewPanelVisible: visible }),

            toggleFolderExpanded: (folderId) =>
                set((state) => ({
                    expandedFolders: state.expandedFolders.includes(folderId)
                        ? state.expandedFolders.filter((id) => id !== folderId)
                        : [...state.expandedFolders, folderId],
                })),

            setExpandedFolders: (folders) => set({ expandedFolders: folders }),

            setSelectedItem: (item) => set({ selectedItem: item }),

            clearSelection: () => set({ selectedItem: null }),
        }),
        {
            name: 'library-storage',
            partialize: (state) => ({
                viewMode: state.viewMode,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder,
                librarySidebarCollapsed: state.librarySidebarCollapsed,
                previewPanelVisible: state.previewPanelVisible,
                expandedFolders: state.expandedFolders,
            }),
        },
    ),
);
