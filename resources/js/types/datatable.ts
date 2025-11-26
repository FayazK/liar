import type { Dayjs } from 'dayjs';
import type { ReactNode } from 'react';

// ============================================
// Filter Configuration Types
// ============================================

/**
 * Base filter configuration that all filters extend
 */
interface BaseFilterConfig {
    /** Unique key matching the backend filter parameter */
    key: string;
    /** Display label for the filter */
    label: string;
    /** Optional placeholder text */
    placeholder?: string;
}

/**
 * Boolean filter for true/false values (e.g., is_active)
 */
export interface BooleanFilterConfig extends BaseFilterConfig {
    type: 'boolean';
    /** Label for true option */
    trueLabel?: string;
    /** Label for false option */
    falseLabel?: string;
}

/**
 * Select filter for enum-like values
 */
export interface SelectFilterConfig extends BaseFilterConfig {
    type: 'select';
    options: Array<{
        value: string | number | boolean;
        label: string;
    }>;
}

/**
 * Date range filter
 */
export interface DateRangeFilterConfig extends BaseFilterConfig {
    type: 'dateRange';
    /** Date format for display */
    format?: string;
}

/**
 * Custom filter with render function
 */
export interface CustomFilterConfig extends BaseFilterConfig {
    type: 'custom';
    render: (props: { value: unknown; onChange: (value: unknown) => void }) => ReactNode;
}

/**
 * Union type of all filter configurations
 */
export type FilterConfig = BooleanFilterConfig | SelectFilterConfig | DateRangeFilterConfig | CustomFilterConfig;

// ============================================
// Sort State Types
// ============================================

export type SortState = { status: 'idle' } | { status: 'sorted'; field: string; direction: 'asc' | 'desc' };

// ============================================
// Error State Type
// ============================================

export interface DataTableError {
    hasError: boolean;
    message: string;
    canRetry: boolean;
}

// ============================================
// Column Definition
// ============================================

export interface DataTableColumn<T = unknown> {
    /** Display title */
    title: string;
    /** Data index for accessing record property */
    dataIndex?: string;
    /** Unique key for the column */
    key: string;
    /** Column width */
    width?: number;
    /** Enable sorting for this column */
    sorter?: boolean;
    /** Mark this column as globally searchable */
    searchable?: boolean;
    /** Mark this column as filterable (uses filter config) */
    filterable?: boolean;
    /** Render function for custom cell content */
    render?: (value: unknown, record: T, index: number) => ReactNode;
}

// ============================================
// DataTable Props
// ============================================

export interface DataTableProps<T = unknown> {
    /** API endpoint for fetching data */
    fetchUrl: string;
    /** Column definitions */
    columns: Array<DataTableColumn<T>>;
    /** Filter configurations for filterable columns */
    filters?: FilterConfig[];
    /** Search input placeholder */
    searchPlaceholder?: string;
    /** Default page size */
    defaultPageSize?: number;
    /** Additional CSS class */
    className?: string;
    /** Empty state message when no data exists */
    emptyMessage?: string;
    /** Empty state message when filters return no results */
    emptyFilterMessage?: string;
    /** Additional query parameters to include in fetch requests */
    params?: Record<string, unknown>;
}

// ============================================
// Filter State Types
// ============================================

export interface DataTableFilters {
    [key: string]: string | number | boolean | [Dayjs | null, Dayjs | null] | undefined;
}

// ============================================
// API Request Types
// ============================================

export interface DataTableQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    [filterKey: string]: unknown;
}
