import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import DataTable from '@/components/ui/DataTable';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import { create, data, edit, index } from '@/routes/admin/roles';
import type { LaravelPaginatedResponse, Role } from '@/types';
import type { DataTableQueryParams, FilterConfig } from '@/types/datatable';
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from 'antd';
import React from 'react';

// Filter configurations
const filters: FilterConfig[] = [
    {
        type: 'dateRange',
        key: 'created_at',
        label: 'Created Date',
    },
];

// Query function for server-side pagination
const fetchRoles = async (params: DataTableQueryParams): Promise<LaravelPaginatedResponse<Role>> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.per_page) queryParams.set('per_page', params.per_page.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.filters) queryParams.set('filters', JSON.stringify(params.filters));
    if (params.sorts && params.sorts.length > 0) {
        queryParams.set('sorts', JSON.stringify(params.sorts));
    }

    const response = await axios.get<LaravelPaginatedResponse<Role>>(`${data.url()}?${queryParams.toString()}`);
    return response.data;
};

export default function RolesIndex() {
    const contentHeader: ContentHeaderProps = {
        primaryAction: {
            label: 'Add Role',
            icon: 'plus',
            onClick: () => router.visit(create.url()),
        },
        breadcrumb: [
            { title: 'Admin', href: '/admin' },
            { title: 'Roles', href: index.url() },
        ],
    };

    // Column definitions
    const columns: ColumnDef<Role>[] = [
        {
            id: 'name',
            header: 'Name',
            accessorKey: 'name',
            enableSorting: true,
            cell: ({ getValue }) => <div style={{ fontWeight: 500 }}>{getValue() as string}</div>,
        },
        {
            id: 'description',
            header: 'Description',
            accessorKey: 'description',
            enableSorting: true,
            cell: ({ getValue }) => {
                const description = getValue() as string | null;
                return description || <span style={{ color: '#999' }}>No description</span>;
            },
        },
        {
            id: 'users_count',
            header: 'Users',
            accessorKey: 'users_count',
            enableSorting: true,
            size: 100,
            cell: ({ getValue }) => {
                const count = (getValue() as number) || 0;
                return <div style={{ textAlign: 'center' }}>{count}</div>;
            },
        },
        {
            id: 'permissions_count',
            header: 'Permissions',
            accessorKey: 'permissions_count',
            enableSorting: true,
            size: 120,
            cell: ({ getValue }) => {
                const count = (getValue() as number) || 0;
                return <Badge count={count} showZero color="blue" />;
            },
        },
    ];

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard header={{ title: 'Roles' }} bodyPadding="none">
                <DataTable<Role>
                    queryKey={['admin', 'roles']}
                    queryFn={fetchRoles}
                    columns={columns}
                    enableColumnVisibility
                    filters={filters}
                    persistenceKey="admin-roles-table"
                    searchPlaceholder="Search roles by name or description..."
                    defaultPageSize={15}
                    emptyMessage="No roles have been created yet."
                    emptyFilterMessage="No roles match your search criteria."
                    onRowClick={(row) => router.visit(edit.url(row.original.id))}
                />
            </PageCard>
        </AdminLayout>
    );
}

RolesIndex.layout = (page: React.ReactNode) => page;
