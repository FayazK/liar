import React from 'react';
import { Button, Space, Tag, Typography, Dropdown, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, MoreOutlined } from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import DataTable from '@/components/ui/DataTable';
import type { User } from '@/types';
import { route } from '@/wayfinder';

const { Title } = Typography;

export default function UsersIndex() {
    const columns = [
        {
            title: 'User',
            dataIndex: 'full_name',
            key: 'user',
            searchable: true,
            sorter: true,
            render: (_: any, record: User) => (
                <Space>
                    <Avatar 
                        src={record.avatar} 
                        icon={<UserOutlined />}
                        size={32}
                    >
                        {record.initials}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.full_name}</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>{record.email}</div>
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
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Last Login',
            dataIndex: 'last_login_at',
            key: 'last_login_at',
            width: 140,
            sorter: true,
            render: (lastLogin: string | null) => (
                lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never'
            ),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 120,
            filterable: true,
            sorter: true,
            render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: any, record: User) => {
                const menuItems = [
                    {
                        key: 'view',
                        label: (
                            <Link href={route('admin.users.show', { id: record.id })}>
                                <Space>
                                    <EyeOutlined />
                                    View
                                </Space>
                            </Link>
                        ),
                    },
                    {
                        key: 'edit',
                        label: (
                            <Link href={route('admin.users.edit', { id: record.id })}>
                                <Space>
                                    <EditOutlined />
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
                                <DeleteOutlined />
                                Delete
                            </Space>
                        ),
                        danger: true,
                        onClick: () => {
                            // TODO: Implement delete confirmation modal
                            console.log('Delete user:', record.id);
                        },
                    },
                ];

                return (
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '24px' 
                }}>
                    <Title level={2} style={{ margin: 0 }}>
                        Users Management
                    </Title>
                    <Button type="primary" icon={<UserOutlined />}>
                        Add User
                    </Button>
                </div>

                <DataTable<User>
                    fetchUrl={route('admin.users.data')}
                    columns={columns}
                    searchPlaceholder="Search users by name or email..."
                    defaultPageSize={15}
                />
            </div>
        </AdminLayout>
    );
}

UsersIndex.layout = (page: React.ReactNode) => page;