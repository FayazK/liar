import DataTable from '@/components/ui/DataTable';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { create, data, edit, show } from '@/routes/admin/users';
import type { FilterConfig, User } from '@/types';
import { Link } from '@inertiajs/react';
import { Avatar, Button, Dropdown, Space, Tag, theme } from 'antd';
import React from 'react';

const { useToken } = theme;

// Filter configurations for the DataTable
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

export default function UsersIndex() {
    const { token } = useToken();

    const columns = [
        {
            title: 'User',
            dataIndex: 'full_name',
            key: 'user',
            searchable: true,
            sorter: true,
            render: (_: unknown, record: User) => (
                <Space>
                    <Avatar src={record.avatar} icon={<Icon name="user" size={16} />} size={32}>
                        {record.initials}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.full_name}</div>
                        <div style={{ color: token.colorTextSecondary, fontSize: '12px' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            filterable: true,
            sorter: true,
            render: (isActive: unknown) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            sorter: true,
            render: (phone: unknown) => (phone as string) || 'N/A',
        },
        {
            title: 'Last Login',
            dataIndex: 'last_login_at',
            key: 'last_login_at',
            width: 140,
            sorter: true,
            render: (lastLogin: unknown) => (lastLogin ? new Date(lastLogin as string).toLocaleDateString() : 'Never'),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 120,
            filterable: true,
            sorter: true,
            render: (createdAt: unknown) => new Date(createdAt as string).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: unknown, record: User) => {
                const menuItems = [
                    {
                        key: 'view',
                        label: (
                            <Link href={show.url(record.id)}>
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
                            <Link href={edit({ user: record.id }).url}>
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
                            // TODO: Implement delete confirmation modal
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

    const headerActions = (
        <Link href={create.url()}>
            <Button type="primary" icon={<Icon name="user-plus" size={16} />}>
                Add User
            </Button>
        </Link>
    );

    return (
        <AdminLayout>
            <PageCard
                header={{
                    title: 'Users',
                    actions: headerActions,
                }}
                bodyPadding="none"
            >
                <DataTable<User>
                    fetchUrl={data.url()}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search users by name or email..."
                    defaultPageSize={15}
                    emptyMessage="No users have been created yet."
                    emptyFilterMessage="No users match your search criteria."
                />
            </PageCard>
        </AdminLayout>
    );
}

UsersIndex.layout = (page: React.ReactNode) => page;
