import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { create, index } from '@/routes/admin/users';
import UserForm from './partials/user-form';

export default function CreateUser() {
    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Admin', href: '/admin' },
            { title: 'Users', href: index.url() },
            { title: 'Create User', href: create.url() },
        ],
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard>
                <UserForm />
            </PageCard>
        </AdminLayout>
    );
}
