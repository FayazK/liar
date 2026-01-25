import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { edit, index } from '@/routes/admin/users';
import type { User } from '@/types';
import UserForm from './partials/user-form';

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Admin', href: '/admin' },
            { title: 'Users', href: index.url() },
            { title: user.full_name, href: edit.url(user.id) },
        ],
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard header={{ title: `Edit User: ${user.full_name}` }}>
                <UserForm user={user} isEdit />
            </PageCard>
        </AdminLayout>
    );
}
