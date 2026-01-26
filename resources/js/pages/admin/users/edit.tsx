import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import { destroy, edit, index } from '@/routes/admin/users';
import type { User } from '@/types';
import { router } from '@inertiajs/react';
import { App, Button, Divider } from 'antd';
import UserForm from './partials/user-form';

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const { modal, message } = App.useApp();

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Admin', href: '/admin' },
            { title: 'Users', href: index.url() },
            { title: user?.full_name || 'Edit', href: user?.id ? edit.url(user.id) : '#' },
        ],
    };

    const handleDelete = () => {
        modal.confirm({
            title: `Delete ${user.full_name}?`,
            content: 'This action cannot be undone. The user will lose access to the system.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(destroy.url(user.id));
                    message.success('User deleted successfully');
                    router.visit(index.url());
                } catch {
                    message.error('Failed to delete user');
                }
            },
        });
    };

    if (!user?.id) {
        return null;
    }

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard header={{ title: `Edit User: ${user.full_name}` }}>
                <UserForm user={user} isEdit />

                <Divider />

                <div style={{ marginTop: 24 }}>
                    <h3 style={{ marginBottom: 8, fontSize: 16, fontWeight: 600, color: '#cf1322' }}>Danger Zone</h3>
                    <p style={{ marginBottom: 16, color: '#666' }}>Once you delete a user, there is no going back. Please be certain.</p>
                    <Button danger icon={<Icon name="trash" />} onClick={handleDelete}>
                        Delete User
                    </Button>
                </div>
            </PageCard>
        </AdminLayout>
    );
}
