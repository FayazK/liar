import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import DataTable from '@/components/ui/DataTable';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import axios from '@/lib/axios';
import { create, data, edit, index, show } from '@/routes/admin/users';
import type { LaravelPaginatedResponse, User } from '@/types';
import type { DataTableQueryParams, FilterConfig, TabConfig } from '@/types/datatable';
import { Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { App, Avatar, Button, Dropdown, Space, Tag, theme } from 'antd';
import React from 'react';

const { useToken } = theme;

// Tab configurations for preset filters
const tabs: TabConfig[] = [
    {
        id: 'all',
        label: 'All Users',
        filters: {},
    },
    {
        id: 'active',
        label: 'Active',
        filters: {
            is_active: { operator: 'eq', value: true },
        },
    },
    {
        id: 'inactive',
        label: 'Inactive',
        filters: {
            is_active: { operator: 'eq', value: false },
        },
    },
];

// Filter configurations for the toolbar
const filters: FilterConfig[] = [
    {
        type: 'boolean',
        key: 'is_active',
        label: 'Status',
        trueLabel: 'Active',
        falseLabel: 'Inactive',
    },
    {
        type: 'dateRange',
        key: 'created_at',
        label: 'Created Date',
    },
];

// Query function to fetch users data
const fetchUsers = async (params: DataTableQueryParams): Promise<LaravelPaginatedResponse<User>> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.per_page) queryParams.set('per_page', params.per_page.toString());
    if (params.search) queryParams.set('search', params.search);

    // Handle filters in new format
    if (params.filters) {
        queryParams.set('filters', JSON.stringify(params.filters));
    }

    // Handle sorts
    if (params.sorts && params.sorts.length > 0) {
        queryParams.set('sorts', JSON.stringify(params.sorts));
    }

    const response = await axios.get<LaravelPaginatedResponse<User>>(`${data.url()}?${queryParams.toString()}`);
    return response.data;
};

export default function UsersIndex() {
    const { token } = useToken();
    const { message } = App.useApp();

    // ContentHeader configuration
    const contentHeader: ContentHeaderProps = {
        primaryAction: {
            label: 'Add User',
            icon: 'user-plus',
            onClick: () => router.visit(create.url()),
        },
        breadcrumb: [
            { title: 'Admin', href: '/admin' },
            { title: 'Users', href: index.url() },
        ],
        actionIcons: [
            { icon: 'refresh', tooltip: 'Refresh', onClick: () => router.reload() },
        ],
    };

    // Column definitions using TanStack Table format
    const columns: ColumnDef<User>[] = [
        {
            id: 'full_name',
            header: 'User',
            accessorKey: 'full_name',
            enableSorting: true,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <Space>
                        <Avatar src={user.avatar} icon={<Icon name="user" size={16} />} size={32}>
                            {user.initials}
                        </Avatar>
                        <div>
                            <div style={{ fontWeight: 500 }}>{user.full_name}</div>
                            <div style={{ color: token.colorTextSecondary, fontSize: '12px' }}>{user.email}</div>
                        </div>
                    </Space>
                );
            },
        },
        {
            id: 'is_active',
            header: 'Status',
            accessorKey: 'is_active',
            enableSorting: true,
            size: 100,
            cell: ({ getValue }) => {
                const isActive = getValue() as boolean;
                return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>;
            },
        },
        {
            id: 'phone',
            header: 'Phone',
            accessorKey: 'phone',
            enableSorting: true,
            size: 150,
            cell: ({ getValue }) => (getValue() as string) || 'N/A',
        },
        {
            id: 'last_login_at',
            header: 'Last Login',
            accessorKey: 'last_login_at',
            enableSorting: true,
            size: 140,
            cell: ({ getValue }) => {
                const lastLogin = getValue() as string | null;
                return lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never';
            },
        },
        {
            id: 'created_at',
            header: 'Created',
            accessorKey: 'created_at',
            enableSorting: true,
            size: 120,
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 100,
            enableSorting: false,
            cell: ({ row }) => {
                const user = row.original;
                const menuItems = [
                    {
                        key: 'view',
                        label: (
                            <Link href={show.url(user.id)}>
                                <Space>
                                    <Icon name="eye" size={16} />
                                    View
                                </Space>
                            </Link>
                        ),
                    },
                    {
                        key: 'edit',
                        label: (
                            <Link href={edit({ user: user.id }).url}>
                                <Space>
                                    <Icon name="edit" size={16} />
                                    Edit
                                </Space>
                            </Link>
                        ),
                    },
                    {
                        type: 'divider' as const,
                    },
                    {
                        key: 'delete',
                        label: (
                            <Space>
                                <Icon name="trash" size={16} />
                                Delete
                            </Space>
                        ),
                        danger: true,
                        onClick: () => {
                            message.info('Delete functionality coming soon');
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                        <Button type="text" icon={<Icon name="dots" size={16} />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard
                header={{
                    title: 'Users',
                }}
                bodyPadding="none"
            >
                <DataTable<User>
                    queryKey={['admin', 'users']}
                    queryFn={fetchUsers}
                    columns={columns}
                    tabs={tabs}
                    defaultTab="all"
                    enableCustomTabs
                    enableColumnVisibility
                    enableColumnOrdering
                    filters={filters}
                    persistenceKey="admin-users-table"
                    searchPlaceholder="Search users by name or email..."
                    defaultPageSize={15}
                    emptyMessage="No users have been created yet."
                    emptyFilterMessage="No users match your search criteria."
                />
            </PageCard>
        </AdminLayout>
    );
}

// Import AdminLayout here to fix the usage
import AdminLayout from '@/layouts/admin-layout';

UsersIndex.layout = (page: React.ReactNode) => page;
