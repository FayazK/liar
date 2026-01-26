import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import { create, data, edit, index } from '@/routes/admin/roles';
import type { Role } from '@/types';
import { router } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { App, Badge, Button, Dropdown, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Fetch roles data
const fetchRoles = async (): Promise<Role[]> => {
    const response = await axios.get<{ data: Role[] }>(data.url());
    return response.data.data;
};

export default function RolesIndex() {
    const { modal, message } = App.useApp();

    // Fetch roles using TanStack Query
    const { data: roles, isLoading, refetch } = useQuery({
        queryKey: ['roles'],
        queryFn: fetchRoles,
    });

    // ContentHeader configuration
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
        actionIcons: [
            { icon: 'refresh', tooltip: 'Refresh', onClick: () => refetch() },
        ],
    };

    // Handle delete role
    const handleDelete = (role: Role) => {
        modal.confirm({
            title: `Delete ${role.name}?`,
            content: 'This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(`/admin/roles/${role.id}`);
                    message.success('Role deleted successfully');
                    refetch();
                } catch {
                    message.error('Failed to delete role');
                }
            },
        });
    };

    // Column definitions
    const columns: ColumnsType<Role> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Users',
            dataIndex: 'users_count',
            key: 'users_count',
            width: 100,
            align: 'center',
            sorter: (a, b) => (a.users_count || 0) - (b.users_count || 0),
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions_count',
            key: 'permissions_count',
            width: 120,
            align: 'center',
            sorter: (a, b) => (a.permissions_count || 0) - (b.permissions_count || 0),
            render: (count: number) => <Badge count={count} showZero color="blue" />,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, role) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'edit',
                                label: 'Edit',
                                icon: <Icon name="edit" size={14} />,
                                onClick: () => router.visit(edit.url(role.id)),
                            },
                            {
                                type: 'divider',
                            },
                            {
                                key: 'delete',
                                label: 'Delete',
                                icon: <Icon name="trash" size={14} />,
                                danger: true,
                                onClick: () => handleDelete(role),
                            },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button type="text" icon={<Icon name="dots-vertical" size={16} />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard>
                <Table
                    columns={columns}
                    dataSource={roles}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        pageSize: 50,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} roles`,
                    }}
                />
            </PageCard>
        </AdminLayout>
    );
}
