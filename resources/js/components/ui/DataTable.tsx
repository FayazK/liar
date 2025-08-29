import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Select, DatePicker, Space, Typography, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableProps, TableColumnType } from 'antd';
import axios from '@/lib/axios';
import { DataTableProps, DataTableFilters, LaravelPaginatedResponse } from '@/types';
import { debounce } from '@/lib/utils';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface DataTableState<T> {
    data: T[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        showSizeChanger: boolean;
        showQuickJumper: boolean;
        showTotal: (total: number, range: [number, number]) => string;
    };
}

function DataTable<T extends Record<string, any>>({
    fetchUrl,
    columns,
    searchPlaceholder = "Search...",
    defaultPageSize = 15,
    className = ""
}: DataTableProps<T>) {
    const [state, setState] = useState<DataTableState<T>>({
        data: [],
        loading: false,
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

    const fetchData = useCallback(async (params: {
        page?: number;
        per_page?: number;
        search?: string;
        filters?: DataTableFilters;
        sort_by?: string;
        sort_direction?: 'asc' | 'desc';
    } = {}) => {
        setState(prev => ({ ...prev, loading: true }));

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
                    if (value !== undefined && value !== null && value !== '') {
                        if (Array.isArray(value)) {
                            queryParams.set(key, JSON.stringify(value));
                        } else {
                            queryParams.set(key, value.toString());
                        }
                    }
                });
            }

            const url = `${fetchUrl}?${queryParams.toString()}`;
            const response = await axios.get<LaravelPaginatedResponse<T>>(url);

            setState(prev => ({
                ...prev,
                data: response.data.data,
                loading: false,
                pagination: {
                    ...prev.pagination,
                    current: response.data.meta.current_page,
                    total: response.data.meta.total,
                    pageSize: response.data.meta.per_page,
                },
            }));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setState(prev => ({ ...prev, loading: false, data: [] }));
        }
    }, [fetchUrl]);

    const debouncedFetchData = useCallback(
        debounce((params: Parameters<typeof fetchData>[0]) => {
            fetchData(params);
        }, 300),
        [fetchData]
    );

    useEffect(() => {
        fetchData({
            page: 1,
            per_page: defaultPageSize,
        });
    }, [fetchData, defaultPageSize]);

    useEffect(() => {
        const params = {
            page: state.pagination.current,
            per_page: state.pagination.pageSize,
            search: search || undefined,
            filters: Object.keys(filters).length > 0 ? filters : undefined,
            sort_by: sorter.field ? String(sorter.field) : undefined,
            sort_direction: sorter.order === 'ascend' ? 'asc' as const : sorter.order === 'descend' ? 'desc' as const : undefined,
        };

        if (search) {
            debouncedFetchData({ ...params, page: 1 });
        } else {
            fetchData(params);
        }
    }, [search, filters, sorter, fetchData, debouncedFetchData, state.pagination.current, state.pagination.pageSize]);

    const handleTableChange: TableProps<T>['onChange'] = (pagination, _, sorter) => {
        setState(prev => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                current: pagination.current || 1,
                pageSize: pagination.pageSize || defaultPageSize,
            },
        }));

        if (Array.isArray(sorter)) {
            setSorter(sorter[0] || {});
        } else {
            setSorter(sorter || {});
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setState(prev => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const handleFilter = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
        setState(prev => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const clearFilters = () => {
        setSearch('');
        setFilters({});
        setSorter({});
        setState(prev => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    // Process columns to add sorting and filtering
    const processedColumns: TableColumnType<T>[] = columns.map(col => {
        const column: TableColumnType<T> = {
            ...col,
            sorter: col.sorter ? true : false,
        };

        return column;
    });

    const renderSearchAndFilters = () => {
        const searchableColumns = columns.filter(col => col.searchable);
        const filterableColumns = columns.filter(col => col.filterable);

        if (searchableColumns.length === 0 && filterableColumns.length === 0) {
            return null;
        }

        return (
            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
                <Space wrap>
                    {searchableColumns.length > 0 && (
                        <Input
                            placeholder={searchPlaceholder}
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                    )}

                    {filterableColumns.map(col => {
                        if (col.dataIndex === 'is_active') {
                            return (
                                <Select
                                    key={col.key}
                                    placeholder={`Filter by ${col.title}`}
                                    value={filters[col.dataIndex]}
                                    onChange={(value) => handleFilter(col.dataIndex, value)}
                                    style={{ width: 150 }}
                                    allowClear
                                >
                                    <Select.Option value={true}>Active</Select.Option>
                                    <Select.Option value={false}>Inactive</Select.Option>
                                </Select>
                            );
                        }

                        if (col.dataIndex === 'created_at') {
                            return (
                                <RangePicker
                                    key={col.key}
                                    placeholder={['Start Date', 'End Date']}
                                    value={filters[col.dataIndex]}
                                    onChange={(dates) => handleFilter(col.dataIndex, dates)}
                                    style={{ width: 240 }}
                                />
                            );
                        }

                        return null;
                    })}

                    {(search || Object.keys(filters).length > 0) && (
                        <a onClick={clearFilters}>Clear all filters</a>
                    )}
                </Space>
            </Space>
        );
    };

    return (
        <Card className={className}>
            {renderSearchAndFilters()}
            
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

            {state.pagination.total > 0 && (
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Text type="secondary">
                        Showing {state.pagination.current === 1 ? 1 : (state.pagination.current - 1) * state.pagination.pageSize + 1} to{' '}
                        {Math.min(state.pagination.current * state.pagination.pageSize, state.pagination.total)} of{' '}
                        {state.pagination.total} entries
                    </Text>
                </div>
            )}
        </Card>
    );
}

export default DataTable;