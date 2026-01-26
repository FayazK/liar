import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import { destroy, edit, index } from '@/routes/admin/roles';
import type { Role } from '@/types';
import { router } from '@inertiajs/react';
import { App, Button, Divider } from 'antd';
import RoleForm from './partials/role-form';

interface EditRoleProps {
    role: Role;
}

export default function EditRole({ role }: EditRoleProps) {
    const { modal, message } = App.useApp();

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Roles', href: index.url() },
            { title: role?.name || 'Edit', href: role?.id ? edit.url(role.id) : '#' },
        ],
    };

    const handleDelete = () => {
        modal.confirm({
            title: `Delete ${role.name}?`,
            content: 'This action cannot be undone. All users with this role will be affected.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(destroy.url(role.id));
                    message.success('Role deleted successfully');
                    router.visit(index.url());
                } catch {
                    message.error('Failed to delete role');
                }
            },
        });
    };

    if (!role?.id) {
        return null;
    }

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard>
                <RoleForm role={role} isEdit />

                <Divider />

                <div style={{ marginTop: 24 }}>
                    <h3 style={{ marginBottom: 8, fontSize: 16, fontWeight: 600, color: '#cf1322' }}>Danger Zone</h3>
                    <p style={{ marginBottom: 16, color: '#666' }}>Once you delete a role, there is no going back. Please be certain.</p>
                    <Button danger icon={<Icon name="trash" />} onClick={handleDelete}>
                        Delete Role
                    </Button>
                </div>
            </PageCard>
        </AdminLayout>
    );
}
