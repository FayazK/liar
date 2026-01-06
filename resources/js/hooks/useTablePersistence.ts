import type { CustomTab, DataTableFilters, PersistedTableState, TabColumnSettings, UseTablePersistenceReturn } from '@/types/datatable';
import type { SortingState, VisibilityState } from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_PREFIX = 'datatable:';
const DEBOUNCE_MS = 500;

/**
 * Default state for a new table
 */
function getDefaultState(defaultPageSize: number): PersistedTableState {
    return {
        columnVisibility: {},
        columnOrder: [],
        filters: {},
        sorting: [],
        pageSize: defaultPageSize,
        customTabs: [],
        activeTabId: undefined,
        tabColumnSettings: {},
    };
}

/**
 * Hook for persisting DataTable state to localStorage
 */
export function useTablePersistence(persistenceKey: string | undefined, defaultPageSize: number = 15): UseTablePersistenceReturn {
    const [state, setState] = useState<PersistedTableState>(() => {
        if (!persistenceKey) {
            return getDefaultState(defaultPageSize);
        }

        try {
            const stored = localStorage.getItem(`${STORAGE_PREFIX}${persistenceKey}`);
            if (stored) {
                const parsed = JSON.parse(stored) as Partial<PersistedTableState>;
                return {
                    ...getDefaultState(defaultPageSize),
                    ...parsed,
                    pageSize: parsed.pageSize ?? defaultPageSize,
                };
            }
        } catch {
            // Invalid JSON, use default
        }

        return getDefaultState(defaultPageSize);
    });

    // Debounce timer ref
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Save to localStorage with debounce
    const saveToStorage = useCallback(
        (newState: PersistedTableState) => {
            if (!persistenceKey) return;

            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }

            saveTimerRef.current = setTimeout(() => {
                try {
                    localStorage.setItem(`${STORAGE_PREFIX}${persistenceKey}`, JSON.stringify(newState));
                } catch {
                    // localStorage full or unavailable
                }
            }, DEBOUNCE_MS);
        },
        [persistenceKey],
    );

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);

    // Update helpers
    const updateState = useCallback(
        (updater: (prev: PersistedTableState) => PersistedTableState) => {
            setState((prev) => {
                const newState = updater(prev);
                saveToStorage(newState);
                return newState;
            });
        },
        [saveToStorage],
    );

    const setColumnVisibility = useCallback(
        (visibility: VisibilityState) => {
            updateState((prev) => ({ ...prev, columnVisibility: visibility }));
        },
        [updateState],
    );

    const setColumnOrder = useCallback(
        (order: string[]) => {
            updateState((prev) => ({ ...prev, columnOrder: order }));
        },
        [updateState],
    );

    const setFilters = useCallback(
        (filters: DataTableFilters) => {
            updateState((prev) => ({ ...prev, filters }));
        },
        [updateState],
    );

    const setSorting = useCallback(
        (sorting: SortingState) => {
            updateState((prev) => ({ ...prev, sorting }));
        },
        [updateState],
    );

    const setPageSize = useCallback(
        (pageSize: number) => {
            updateState((prev) => ({ ...prev, pageSize }));
        },
        [updateState],
    );

    const setActiveTabId = useCallback(
        (tabId: string) => {
            updateState((prev) => ({ ...prev, activeTabId: tabId }));
        },
        [updateState],
    );

    const addCustomTab = useCallback(
        (tab: CustomTab) => {
            updateState((prev) => ({
                ...prev,
                customTabs: [...prev.customTabs, tab],
            }));
        },
        [updateState],
    );

    const updateCustomTab = useCallback(
        (id: string, updates: Partial<CustomTab>) => {
            updateState((prev) => ({
                ...prev,
                customTabs: prev.customTabs.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)),
            }));
        },
        [updateState],
    );

    const deleteCustomTab = useCallback(
        (id: string) => {
            updateState((prev) => {
                // Also remove column settings for deleted tab
                const newTabColumnSettings = { ...prev.tabColumnSettings };
                delete newTabColumnSettings[id];

                return {
                    ...prev,
                    customTabs: prev.customTabs.filter((tab) => tab.id !== id),
                    tabColumnSettings: newTabColumnSettings,
                    // Reset active tab if deleted
                    activeTabId: prev.activeTabId === id ? undefined : prev.activeTabId,
                };
            });
        },
        [updateState],
    );

    const setTabColumnSettings = useCallback(
        (tabId: string, settings: TabColumnSettings) => {
            updateState((prev) => ({
                ...prev,
                tabColumnSettings: {
                    ...prev.tabColumnSettings,
                    [tabId]: settings,
                },
            }));
        },
        [updateState],
    );

    const getTabColumnSettings = useCallback(
        (tabId: string): TabColumnSettings | undefined => {
            return state.tabColumnSettings[tabId];
        },
        [state.tabColumnSettings],
    );

    const reset = useCallback(() => {
        const defaultState = getDefaultState(defaultPageSize);
        setState(defaultState);
        if (persistenceKey) {
            try {
                localStorage.removeItem(`${STORAGE_PREFIX}${persistenceKey}`);
            } catch {
                // Ignore
            }
        }
    }, [persistenceKey, defaultPageSize]);

    return {
        state,
        setColumnVisibility,
        setColumnOrder,
        setFilters,
        setSorting,
        setPageSize,
        setActiveTabId,
        addCustomTab,
        updateCustomTab,
        deleteCustomTab,
        setTabColumnSettings,
        getTabColumnSettings,
        reset,
    };
}

export default useTablePersistence;
