import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import { destroy, edit, index } from '@/routes/admin/users';
import type { User } from '@/types';
import { router } from '@inertiajs/react';
import { App } from 'antd';
import { useRef, useState } from 'react';
import type { UserFormRef } from './partials/user-form';
import UserForm from './partials/user-form';

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const { modal, message } = App.useApp();
    const formRef = useRef<UserFormRef>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = () => {
        formRef.current?.submit();
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

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Users', href: index.url() },
            { title: user?.full_name || 'Edit', href: user?.id ? edit.url(user.id) : '#' },
        ],
        actionButtons: [
            {
                label: 'Delete',
                icon: 'trash',
                danger: true,
                onClick: handleDelete,
            },
            {
                label: 'Update',
                icon: 'check',
                type: 'primary',
                onClick: handleUpdate,
                loading: isSubmitting,
            },
        ],
    };

    if (!user?.id) {
        return null;
    }

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard>
                <UserForm ref={formRef} user={user} isEdit onSubmittingChange={setIsSubmitting} hideSubmitButton />
            </PageCard>
        </AdminLayout>
    );
}
