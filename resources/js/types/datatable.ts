import type { ColumnDef, Row, RowSelectionState, SortingState, Table, VisibilityState } from '@tanstack/react-table';
import type { Dayjs } from 'dayjs';
import type { ReactNode } from 'react';
import type { LaravelPaginatedResponse } from './index';

// ============================================
// Filter Operator Types
// ============================================

export type FilterOperator =
    | 'eq'
    | 'neq'
    | 'contains'
    | 'starts_with'
    | 'ends_with'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'between'
    | 'in'
    | 'not_in'
    | 'is_null'
    | 'is_not_null';

// ============================================
// Filter Value Types
// ============================================

export interface FilterValue {
    operator: FilterOperator;
    value: string | number | boolean | string[] | [string | null, string | null];
}

export type DataTableFilters = Record<string, FilterValue | string | number | boolean | [Dayjs | null, Dayjs | null] | undefined>;

// ============================================
// Tab Configuration
// ============================================

export interface TabConfig {
    /** Unique identifier for the tab */
    id: string;
    /** Display label */
    label: string;
    /** Filters to apply when tab is active */
    filters: DataTableFilters;
    /** Whether this is a user-created custom tab */
    isCustom?: boolean;
    /** Optional icon */
    icon?: ReactNode;
    /** Optional badge count */
    badge?: number | string;
    /** Column visibility for this tab */
    columnVisibility?: VisibilityState;
    /** Column order for this tab */
    columnOrder?: string[];
}

export interface CustomTab extends TabConfig {
    isCustom: true;
    createdAt: number;
}

// ============================================
// Bulk Actions
// ============================================

export interface BulkActionConfig<TData = unknown> {
    /** Unique key for the action */
    key: string;
    /** Display label */
    label: string;
    /** Optional icon */
    icon?: ReactNode;
    /** Whether this is a dangerous action (shown in red) */
    danger?: boolean;
    /** Callback when action is triggered */
    onClick: (selectedRows: Row<TData>[]) => void | Promise<void>;
    /** Whether the action is disabled */
    isDisabled?: (selectedRows: Row<TData>[]) => boolean;
}

// ============================================
// Per-Tab Column Settings
// ============================================

export interface TabColumnSettings {
    columnVisibility: VisibilityState;
    columnOrder: string[];
}

// ============================================
// Persisted State
// ============================================

export interface PersistedTableState {
    columnVisibility: VisibilityState;
    columnOrder: string[];
    filters: DataTableFilters;
    sorting: SortingState;
    pageSize: number;
    customTabs: CustomTab[];
    activeTabId?: string;
    /** Per-tab column settings (keyed by tab ID) */
    tabColumnSettings: Record<string, TabColumnSettings>;
}

// ============================================
// Sort Configuration
// ============================================

export interface SortColumn {
    column: string;
    direction: 'asc' | 'desc';
}

// ============================================
// Filter Configuration Types (for UI rendering)
// ============================================

interface BaseFilterConfig {
    key: string;
    label: string;
    placeholder?: string;
}

export interface BooleanFilterConfig extends BaseFilterConfig {
    type: 'boolean';
    trueLabel?: string;
    falseLabel?: string;
}

export interface SelectFilterConfig extends BaseFilterConfig {
    type: 'select';
    options: Array<{
        value: string | number | boolean;
        label: string;
    }>;
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
    type: 'dateRange';
    format?: string;
}

export interface CustomFilterConfig extends BaseFilterConfig {
    type: 'custom';
    render: (props: { value: unknown; onChange: (value: unknown) => void }) => ReactNode;
}

export type FilterConfig = BooleanFilterConfig | SelectFilterConfig | DateRangeFilterConfig | CustomFilterConfig;

// ============================================
// DataTable Error State
// ============================================

export interface DataTableError {
    hasError: boolean;
    message: string;
    canRetry: boolean;
}

// ============================================
// DataTable Query Parameters
// ============================================

export interface DataTableQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: DataTableFilters;
    sorts?: SortColumn[];
    // Legacy format support
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
}

// ============================================
// DataTable Query Function
// ============================================

export type DataTableQueryFn<TData> = (params: DataTableQueryParams) => Promise<LaravelPaginatedResponse<TData>>;

// ============================================
// Main DataTable Props
// ============================================

export interface DataTableProps<TData> {
    // Data fetching
    /** Unique key for query caching */
    queryKey: string[];
    /** Function to fetch data */
    queryFn: DataTableQueryFn<TData>;

    // Column definition
    /** TanStack Table column definitions */
    columns: ColumnDef<TData>[];

    // Tab system
    /** Preset tabs */
    tabs?: TabConfig[];
    /** Default active tab ID */
    defaultTab?: string;
    /** Enable user-created custom tabs */
    enableCustomTabs?: boolean;

    // Features
    /** Enable row selection (checkboxes) */
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
    /** Enable column visibility toggle */
    enableColumnVisibility?: boolean;
    /** Enable column reordering */
    enableColumnOrdering?: boolean;
    /** Enable search input */
    enableSearch?: boolean;

    // Bulk actions
    /** Bulk action configurations */
    bulkActions?: BulkActionConfig<TData>[];

    // Persistence
    /** Key for localStorage persistence */
    persistenceKey?: string;

    // UI customization
    /** Search input placeholder */
    searchPlaceholder?: string;
    /** Message when no data exists */
    emptyMessage?: string;
    /** Message when filters return no results */
    emptyFilterMessage?: string;
    /** Default page size */
    defaultPageSize?: number;

    // Filter UI
    /** Filter configurations for UI rendering */
    filters?: FilterConfig[];

    // Callbacks
    /** Called when a row is clicked */
    onRowClick?: (row: Row<TData>) => void;
}

// ============================================
// Hook Return Types
// ============================================

export interface UseDataTableReturn<TData> {
    table: Table<TData>;
    isLoading: boolean;
    isFetching: boolean;
    error: Error | null;
    data: TData[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
    pageSize: number;
    // Search
    searchValue: string;
    setSearchValue: (value: string) => void;
    // Filters
    filters: DataTableFilters;
    setFilter: (key: string, value: FilterValue | undefined) => void;
    clearFilters: () => void;
    // Tabs
    activeTabId: string;
    setActiveTab: (tabId: string) => void;
    tabs: TabConfig[];
    customTabs: CustomTab[];
    createCustomTab: (label: string, filters: DataTableFilters) => void;
    updateCustomTab: (id: string, updates: Partial<CustomTab>) => void;
    deleteCustomTab: (id: string) => void;
    // Selection
    rowSelection: RowSelectionState;
    setRowSelection: (selection: RowSelectionState) => void;
    selectedRows: Row<TData>[];
    clearSelection: () => void;
    // Column management
    columnVisibility: VisibilityState;
    setColumnVisibility: (visibility: VisibilityState) => void;
    columnOrder: string[];
    setColumnOrder: (order: string[]) => void;
    resetColumnSettings: () => void;
    // Refetch
    refetch: () => void;
}

export interface UseTablePersistenceReturn {
    state: PersistedTableState;
    setColumnVisibility: (visibility: VisibilityState) => void;
    setColumnOrder: (order: string[]) => void;
    setFilters: (filters: DataTableFilters) => void;
    setSorting: (sorting: SortingState) => void;
    setPageSize: (size: number) => void;
    setActiveTabId: (tabId: string) => void;
    addCustomTab: (tab: CustomTab) => void;
    updateCustomTab: (id: string, tab: Partial<CustomTab>) => void;
    deleteCustomTab: (id: string) => void;
    setTabColumnSettings: (tabId: string, settings: TabColumnSettings) => void;
    getTabColumnSettings: (tabId: string) => TabColumnSettings | undefined;
    reset: () => void;
}
