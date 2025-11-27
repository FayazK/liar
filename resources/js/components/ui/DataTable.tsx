import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Space, Typography, Button, notification, theme } from 'antd';
import { Icon } from '@/components/ui/Icon';
import type { TableProps, TableColumnType, InputRef } from 'antd';
import type { Dayjs } from 'dayjs';
import axios from '@/lib/axios';
import { debounce } from '@/lib/utils';
import { EmptyState } from './data-table/EmptyState';
import { FilterRenderer } from './data-table/filters';
import type {
    DataTableProps,
    DataTableFilters,
    FilterConfig,
    DataTableError,
} from '@/types/datatable';
import type { LaravelPaginatedResponse } from '@/types';

const { Text } = Typography;
const { useToken } = theme;

interface DataTableState<T> {
    data: T[];
    loading: boolean;
    error: DataTableError | null;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        showSizeChanger: boolean;
        showQuickJumper: boolean;
        showTotal: (total: number, range: [number, number]) => string;
    };
}

function DataTable<T extends Record<string, unknown>>({
    fetchUrl,
    columns,
    filters: filterConfigs = [],
    searchPlaceholder = 'Search...',
    defaultPageSize = 15,
    emptyMessage,
    emptyFilterMessage,
    params: additionalParams = {},
}: DataTableProps<T>) {
    const { token } = useToken();
    const searchInputRef = useRef<InputRef>(null);

    const [state, setState] = useState<DataTableState<T>>({
        data: [],
        loading: false,
        error: null,
        pagination: {
            current: 1,
            pageSize: defaultPageSize,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        },
    });

    const [search, setSearch] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilters>({});
    const [sorter, setSorter] = useState<{
        field?: string | number;
        order?: 'ascend' | 'descend';
    }>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const fetchData = async (params: {
        page?: number;
        per_page?: number;
        search?: string;
        filters?: DataTableFilters;
        sort_by?: string;
        sort_direction?: 'asc' | 'desc';
    } = {}): Promise<void> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.set('page', params.page.toString());
            if (params.per_page) queryParams.set('per_page', params.per_page.toString());
            if (params.search) queryParams.set('search', params.search);
            if (params.sort_by) queryParams.set('sort_by', params.sort_by);
            if (params.sort_direction) queryParams.set('sort_direction', params.sort_direction);

            // Add filters to query params
            if (params.filters) {
                Object.entries(params.filters).forEach(([key, value]) => {
                    if (value === undefined || value === null || value === '') {
                        return;
                    }
                    if (Array.isArray(value)) {
                        // Handle date range - convert Dayjs to string
                        const dateStrings = value.map((d) =>
                            d && typeof d === 'object' && 'format' in d
                                ? (d as Dayjs).format('YYYY-MM-DD')
                                : d
                        );
                        queryParams.set(key, JSON.stringify(dateStrings));
                    } else {
                        queryParams.set(key, String(value));
                    }
                });
            }

            // Add additional params from props
            Object.entries(additionalParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.set(key, String(value));
                }
            });

            const url = `${fetchUrl}?${queryParams.toString()}`;
            const response = await axios.get<LaravelPaginatedResponse<T>>(url);

            setState((prev) => ({
                ...prev,
                data: response.data.data,
                loading: false,
                error: null,
                pagination: {
                    ...prev.pagination,
                    current: response.data.meta.current_page,
                    total: response.data.meta.total,
                    pageSize: response.data.meta.per_page,
                },
            }));
            setIsInitialLoad(false);
        } catch (error) {
            let errorMessage = 'An unexpected error occurred while loading data.';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || 'Unable to load data. Please try again.';
            }

            notification.error({
                message: 'Failed to Load Data',
                description: errorMessage,
                duration: 5,
            });

            setState((prev) => ({
                ...prev,
                loading: false,
                data: [],
                error: {
                    hasError: true,
                    message: errorMessage,
                    canRetry: true,
                },
            }));
            setIsInitialLoad(false);
        }
    };

    const debouncedFetchData = (params: {
        page?: number;
        per_page?: number;
        search?: string;
        filters?: DataTableFilters;
        sort_by?: string;
        sort_direction?: 'asc' | 'desc';
    }): void => {
        const debouncedFn = debounce(() => {
            fetchData(params);
        }, 300);
        debouncedFn();
    };

    // Initial load
    useEffect(() => {
        fetchData({
            page: 1,
            per_page: defaultPageSize,
        });
    }, [defaultPageSize]);

    // Refetch on filter/search/sort changes
    useEffect(() => {
        if (isInitialLoad) return;

        const params = {
            page: currentPage,
            per_page: pageSize,
            search: search || undefined,
            filters: Object.keys(filters).length > 0 ? filters : undefined,
            sort_by: sorter.field ? String(sorter.field) : undefined,
            sort_direction:
                sorter.order === 'ascend'
                    ? ('asc' as const)
                    : sorter.order === 'descend'
                      ? ('desc' as const)
                      : undefined,
        };

        if (search) {
            debouncedFetchData({ ...params, page: 1 });
        } else {
            fetchData(params);
        }
    }, [search, filters, sorter, currentPage, pageSize]);

    const handleRetry = (): void => {
        setState((prev) => ({ ...prev, error: null }));
        fetchData({
            page: currentPage,
            per_page: pageSize,
            search: search || undefined,
            filters: Object.keys(filters).length > 0 ? filters : undefined,
            sort_by: sorter.field ? String(sorter.field) : undefined,
            sort_direction:
                sorter.order === 'ascend'
                    ? ('asc' as const)
                    : sorter.order === 'descend'
                      ? ('desc' as const)
                      : undefined,
        });
    };

    const handleTableChange: TableProps<T>['onChange'] = (pagination, _, sorterResult) => {
        const newPage = pagination.current || 1;
        const newPageSize = pagination.pageSize || defaultPageSize;

        setCurrentPage(newPage);
        setPageSize(newPageSize);

        setState((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                current: newPage,
                pageSize: newPageSize,
            },
        }));

        if (Array.isArray(sorterResult)) {
            const firstSorter = sorterResult[0];
            if (firstSorter && firstSorter.field) {
                setSorter({
                    field: firstSorter.field as string | number,
                    order: firstSorter.order as 'ascend' | 'descend' | undefined
                });
            } else {
                setSorter({});
            }
        } else if (sorterResult && sorterResult.field) {
            setSorter({
                field: sorterResult.field as string | number,
                order: sorterResult.order as 'ascend' | 'descend' | undefined
            });
        } else {
            setSorter({});
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const handleFilter = (key: string, value: unknown) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value as DataTableFilters[string],
        }));
        setCurrentPage(1);
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const clearFilters = () => {
        setSearch('');
        setFilters({});
        setSorter({});
        setCurrentPage(1);
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
        // Return focus to search input for accessibility
        searchInputRef.current?.focus();
    };

    // Process columns to add sorting
    const processedColumns: TableColumnType<T>[] = columns.map((col) => ({
        ...col,
        sorter: col.sorter ? true : false,
    }));

    // Check if any columns are searchable or filterable
    const hasSearchableColumns = columns.some((col) => col.searchable);
    const hasActiveFilters = search || Object.keys(filters).length > 0;

    const renderSearchAndFilters = () => {
        if (!hasSearchableColumns && filterConfigs.length === 0) {
            return null;
        }

        return (
            <div
                role="search"
                aria-label="Table filters"
                style={{
                    marginBottom: token.marginMD,
                    padding: token.paddingSM,
                    backgroundColor: token.colorBgLayout,
                    borderRadius: token.borderRadiusLG,
                }}
            >
                <Space wrap>
                    {hasSearchableColumns && (
                        <Input
                            ref={searchInputRef}
                            placeholder={searchPlaceholder}
                            prefix={<Icon name="search" size={16} aria-hidden="true" />}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                            aria-label="Search table data"
                            id="datatable-search"
                        />
                    )}

                    {filterConfigs.map((config) => (
                        <FilterRenderer
                            key={config.key}
                            config={config}
                            value={filters[config.key]}
                            onChange={handleFilter}
                        />
                    ))}

                    {hasActiveFilters && (
                        <Button
                            type="link"
                            onClick={clearFilters}
                            aria-label="Clear all active filters"
                        >
                            Clear all filters
                        </Button>
                    )}
                </Space>
            </div>
        );
    };

    const renderContent = () => {
        // Error state
        if (state.error?.hasError) {
            return (
                <EmptyState
                    type="error"
                    errorMessage={state.error.message}
                    onRetry={handleRetry}
                />
            );
        }

        // Empty state (no data at all or no results from filters)
        if (!state.loading && state.data.length === 0) {
            return (
                <EmptyState
                    type={hasActiveFilters ? 'no-results' : 'no-data'}
                    searchTerm={search}
                    hasFilters={Object.keys(filters).length > 0}
                    onClearFilters={clearFilters}
                    emptyMessage={emptyMessage}
                    emptyFilterMessage={emptyFilterMessage}
                />
            );
        }

        // Table with data
        return (
            <Table<T>
                columns={processedColumns}
                dataSource={state.data}
                pagination={state.pagination}
                loading={state.loading}
                onChange={handleTableChange}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                size="middle"
            />
        );
    };

    return (
        <>
            {renderSearchAndFilters()}

            {/* Screen reader announcement for loading/results */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            >
                {state.loading
                    ? 'Loading data...'
                    : `Showing ${state.data.length} of ${state.pagination.total} items`}
            </div>

            {renderContent()}

            {state.pagination.total > 0 && !state.error?.hasError && (
                <div
                    style={{
                        marginTop: token.marginMD,
                        paddingTop: token.paddingSM,
                        borderTop: `1px solid ${token.colorBorderSecondary}`,
                        textAlign: 'right',
                    }}
                >
                    <Text type="secondary">
                        Showing{' '}
                        {state.pagination.current === 1
                            ? 1
                            : (state.pagination.current - 1) * state.pagination.pageSize + 1}{' '}
                        to{' '}
                        {Math.min(
                            state.pagination.current * state.pagination.pageSize,
                            state.pagination.total
                        )}{' '}
                        of {state.pagination.total} entries
                    </Text>
                </div>
            )}
        </>
    );
}

export default DataTable;
