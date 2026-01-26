import { debounce } from '@/lib/utils';
import type {
    CustomTab,
    DataTableFilters,
    DataTableQueryFn,
    DataTableQueryParams,
    FilterValue,
    TabConfig,
    UseDataTableReturn,
} from '@/types/datatable';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type PaginationState,
    type Row,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useTablePersistence } from './useTablePersistence';

interface UseDataTableOptions<TData> {
    queryKey: string[];
    queryFn: DataTableQueryFn<TData>;
    columns: ColumnDef<TData>[];
    persistenceKey?: string;
    defaultPageSize?: number;
    tabs?: TabConfig[];
    defaultTab?: string;
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
}

export function useDataTable<TData>({
    queryKey,
    queryFn,
    columns,
    persistenceKey,
    defaultPageSize = 15,
    tabs = [],
    defaultTab,
    enableRowSelection = false,
}: UseDataTableOptions<TData>): UseDataTableReturn<TData> {
    // Persistence
    const persistence = useTablePersistence(persistenceKey, defaultPageSize);

    // Active tab - computed first as column settings depend on it
    const initialActiveTabId = persistence.state.activeTabId || defaultTab || tabs[0]?.id || 'all';
    const [activeTabId, setActiveTabIdInternal] = useState(initialActiveTabId);

    // Get initial column settings for the active tab
    const initialTabSettings = persistence.getTabColumnSettings(initialActiveTabId);

    // Local state
    const [searchValue, setSearchValueInternal] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFiltersInternal] = useState<DataTableFilters>(persistence.state.filters);
    const [sorting, setSorting] = useState<SortingState>(persistence.state.sorting);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibilityInternal] = useState<VisibilityState>(
        initialTabSettings?.columnVisibility ?? persistence.state.columnVisibility,
    );
    const [columnOrder, setColumnOrderInternal] = useState<string[]>(initialTabSettings?.columnOrder ?? persistence.state.columnOrder);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: persistence.state.pageSize,
    });

    // Debounced search setter
    const debouncedSetSearch = useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedSearch(value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }, 300),
        [],
    );

    const setSearchValue = useCallback(
        (value: string) => {
            setSearchValueInternal(value);
            debouncedSetSearch(value);
        },
        [debouncedSetSearch],
    );

    // Get active tab filters
    const activeTab = useMemo(() => {
        const allTabs = [...tabs, ...persistence.state.customTabs];
        return allTabs.find((t) => t.id === activeTabId);
    }, [tabs, persistence.state.customTabs, activeTabId]);

    // Merge tab filters with manual filters
    const mergedFilters = useMemo(() => {
        return {
            ...(activeTab?.filters || {}),
            ...filters,
        };
    }, [activeTab, filters]);

    // Build query params
    const queryParams: DataTableQueryParams = useMemo(
        () => ({
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
            search: debouncedSearch || undefined,
            filters: Object.keys(mergedFilters).length > 0 ? mergedFilters : undefined,
            sorts: sorting.length > 0 ? sorting.map((s) => ({ column: s.id, direction: s.desc ? 'desc' : 'asc' })) : undefined,
        }),
        [pagination, debouncedSearch, mergedFilters, sorting],
    );

    // Query
    const query = useQuery({
        queryKey: [...queryKey, queryParams],
        queryFn: () => queryFn(queryParams),
        placeholderData: keepPreviousData,
    });

    // Extract data
    const data = query.data?.data ?? [];
    const totalCount = query.data?.meta?.total ?? 0;
    const pageCount = query.data?.meta?.last_page ?? 0;
    const currentPage = query.data?.meta?.current_page ?? 1;

    // Table instance
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination,
            sorting,
            rowSelection,
            columnVisibility,
            columnOrder: columnOrder.length > 0 ? columnOrder : undefined,
        },
        onPaginationChange: setPagination,
        onSortingChange: (updater) => {
            const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(newSorting);
            persistence.setSorting(newSorting);
        },
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: (updater) => {
            const newVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
            setColumnVisibilityInternal(newVisibility);
            persistence.setColumnVisibility(newVisibility);
        },
        onColumnOrderChange: (updater) => {
            const newOrder = typeof updater === 'function' ? updater(columnOrder) : updater;
            setColumnOrderInternal(newOrder);
            persistence.setColumnOrder(newOrder);
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        enableRowSelection,
        getRowId: (row) => (row as Record<string, unknown>).id as string,
    });

    // Selected rows
    const selectedRows = useMemo(() => {
        return table.getSelectedRowModel().rows;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table, rowSelection]);

    // Filter methods
    const setFilter = useCallback(
        (key: string, value: FilterValue | undefined) => {
            setFiltersInternal((prev) => {
                const newFilters = { ...prev };
                if (value === undefined) {
                    delete newFilters[key];
                } else {
                    newFilters[key] = value;
                }
                persistence.setFilters(newFilters);
                return newFilters;
            });
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
        [persistence],
    );

    const clearFilters = useCallback(() => {
        setFiltersInternal({});
        setSearchValueInternal('');
        setDebouncedSearch('');
        persistence.setFilters({});
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [persistence]);

    // Tab methods
    const setActiveTab = useCallback(
        (tabId: string) => {
            // Save current tab's column settings before switching
            if (activeTabId) {
                persistence.setTabColumnSettings(activeTabId, {
                    columnVisibility,
                    columnOrder,
                });
            }

            // Load new tab's column settings
            const newTabSettings = persistence.getTabColumnSettings(tabId);
            if (newTabSettings) {
                setColumnVisibilityInternal(newTabSettings.columnVisibility);
                setColumnOrderInternal(newTabSettings.columnOrder);
            } else {
                // Reset to defaults if no settings for this tab
                setColumnVisibilityInternal({});
                setColumnOrderInternal([]);
            }

            setActiveTabIdInternal(tabId);
            persistence.setActiveTabId(tabId);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            setRowSelection({});
        },
        [persistence, activeTabId, columnVisibility, columnOrder],
    );

    const createCustomTab = useCallback(
        (label: string, tabFilters: DataTableFilters) => {
            const newTab: CustomTab = {
                id: `custom-${Date.now()}`,
                label,
                filters: tabFilters,
                isCustom: true,
                createdAt: Date.now(),
            };
            persistence.addCustomTab(newTab);
        },
        [persistence],
    );

    const updateCustomTab = useCallback(
        (id: string, updates: Partial<CustomTab>) => {
            persistence.updateCustomTab(id, updates);
        },
        [persistence],
    );

    const deleteCustomTab = useCallback(
        (id: string) => {
            persistence.deleteCustomTab(id);
            if (activeTabId === id) {
                setActiveTabIdInternal(defaultTab || tabs[0]?.id || 'all');
            }
        },
        [persistence, activeTabId, defaultTab, tabs],
    );

    // Selection methods
    const clearSelection = useCallback(() => {
        setRowSelection({});
    }, []);

    // Column methods
    const setColumnVisibility = useCallback(
        (visibility: VisibilityState) => {
            setColumnVisibilityInternal(visibility);
            persistence.setColumnVisibility(visibility);
            // Also save to current tab's settings
            if (activeTabId) {
                persistence.setTabColumnSettings(activeTabId, {
                    columnVisibility: visibility,
                    columnOrder,
                });
            }
        },
        [persistence, activeTabId, columnOrder],
    );

    const setColumnOrder = useCallback(
        (order: string[]) => {
            setColumnOrderInternal(order);
            persistence.setColumnOrder(order);
            // Also save to current tab's settings
            if (activeTabId) {
                persistence.setTabColumnSettings(activeTabId, {
                    columnVisibility,
                    columnOrder: order,
                });
            }
        },
        [persistence, activeTabId, columnVisibility],
    );

    const resetColumnSettings = useCallback(() => {
        setColumnVisibilityInternal({});
        setColumnOrderInternal([]);
        persistence.setColumnVisibility({});
        persistence.setColumnOrder([]);
        // Also reset current tab's settings
        if (activeTabId) {
            persistence.setTabColumnSettings(activeTabId, {
                columnVisibility: {},
                columnOrder: [],
            });
        }
    }, [persistence, activeTabId]);

    // Refetch
    const refetch = useCallback(() => {
        query.refetch();
    }, [query]);

    return {
        table,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        data,
        totalCount,
        pageCount,
        currentPage,
        pageSize: pagination.pageSize,
        // Search
        searchValue,
        setSearchValue,
        // Filters
        filters,
        setFilter,
        clearFilters,
        // Tabs
        activeTabId,
        setActiveTab,
        tabs,
        customTabs: persistence.state.customTabs,
        createCustomTab,
        updateCustomTab,
        deleteCustomTab,
        // Selection
        rowSelection,
        setRowSelection,
        selectedRows,
        clearSelection,
        // Column management
        columnVisibility,
        setColumnVisibility,
        columnOrder,
        setColumnOrder,
        resetColumnSettings,
        // Refetch
        refetch,
    };
}

export default useDataTable;
