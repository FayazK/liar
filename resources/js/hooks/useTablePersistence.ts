import axios from '@/lib/axios';
import type { CustomTab, DataTableFilters, PersistedTableState, TabColumnSettings, UseTablePersistenceReturn } from '@/types/datatable';
import type { SortingState, VisibilityState } from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_PREFIX = 'datatable:';
const LOCAL_DEBOUNCE_MS = 500;
const SERVER_DEBOUNCE_MS = 1000;

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
 * Hook for persisting DataTable state to localStorage and server
 *
 * Strategy: Optimistic localStorage-first approach
 * - On mount: Show localStorage data immediately (instant UX)
 * - Background: Fetch from server, update state if server data exists
 * - On change: Save to localStorage immediately, debounce sync to server
 */
export function useTablePersistence(persistenceKey: string | undefined, defaultPageSize: number = 15): UseTablePersistenceReturn {
    const [state, setState] = useState<PersistedTableState>(() => {
        if (!persistenceKey) {
            return getDefaultState(defaultPageSize);
        }

        // Load from localStorage immediately for instant UX
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

    // Debounce timer refs
    const localSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const serverSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const serverSyncInitialized = useRef(false);

    // Save to localStorage with debounce
    const saveToLocalStorage = useCallback(
        (newState: PersistedTableState) => {
            if (!persistenceKey) return;

            if (localSaveTimerRef.current) {
                clearTimeout(localSaveTimerRef.current);
            }

            localSaveTimerRef.current = setTimeout(() => {
                try {
                    localStorage.setItem(`${STORAGE_PREFIX}${persistenceKey}`, JSON.stringify(newState));
                } catch {
                    // localStorage full or unavailable
                }
            }, LOCAL_DEBOUNCE_MS);
        },
        [persistenceKey],
    );

    // Save to server with debounce
    const saveToServer = useCallback(
        (newState: PersistedTableState) => {
            if (!persistenceKey) return;

            if (serverSaveTimerRef.current) {
                clearTimeout(serverSaveTimerRef.current);
            }

            serverSaveTimerRef.current = setTimeout(async () => {
                try {
                    await axios.post(`/api/table-preferences/${persistenceKey}`, newState);
                } catch {
                    // Silent fail - localStorage has the data as backup
                }
            }, SERVER_DEBOUNCE_MS);
        },
        [persistenceKey],
    );

    // Load from server on mount (background sync)
    useEffect(() => {
        if (!persistenceKey || serverSyncInitialized.current) return;

        serverSyncInitialized.current = true;

        const loadFromServer = async () => {
            try {
                const response = await axios.get<{ data: PersistedTableState | null }>(`/api/table-preferences/${persistenceKey}`);
                const serverData = response.data.data;

                if (serverData) {
                    // Server has data, update state and localStorage
                    const mergedState = {
                        ...getDefaultState(defaultPageSize),
                        ...serverData,
                        pageSize: serverData.pageSize ?? defaultPageSize,
                    };

                    setState(mergedState);

                    // Update localStorage cache
                    try {
                        localStorage.setItem(`${STORAGE_PREFIX}${persistenceKey}`, JSON.stringify(mergedState));
                    } catch {
                        // Ignore localStorage errors
                    }
                }
            } catch {
                // Server unavailable, continue with localStorage data
            }
        };

        loadFromServer();
    }, [persistenceKey, defaultPageSize]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (localSaveTimerRef.current) {
                clearTimeout(localSaveTimerRef.current);
            }
            if (serverSaveTimerRef.current) {
                clearTimeout(serverSaveTimerRef.current);
            }
        };
    }, []);

    // Update helpers - saves to both localStorage and server
    const updateState = useCallback(
        (updater: (prev: PersistedTableState) => PersistedTableState) => {
            setState((prev) => {
                const newState = updater(prev);
                saveToLocalStorage(newState);
                saveToServer(newState);
                return newState;
            });
        },
        [saveToLocalStorage, saveToServer],
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
            // Clear localStorage
            try {
                localStorage.removeItem(`${STORAGE_PREFIX}${persistenceKey}`);
            } catch {
                // Ignore
            }

            // Clear server (async, fire and forget)
            axios.post(`/api/table-preferences/${persistenceKey}`, defaultState).catch(() => {
                // Silent fail
            });
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
