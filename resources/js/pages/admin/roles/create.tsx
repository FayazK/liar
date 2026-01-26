import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { create, index } from '@/routes/admin/roles';
import RoleForm from './partials/role-form';

export default function CreateRole() {
    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Roles', href: index.url() },
            { title: 'Create Role', href: create.url() },
        ],
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard>
                <RoleForm />
            </PageCard>
        </AdminLayout>
    );
}
