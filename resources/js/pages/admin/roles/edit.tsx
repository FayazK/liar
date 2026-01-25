import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { edit, index } from '@/routes/admin/roles';
import type { Role } from '@/types';
import RoleForm from './partials/role-form';

interface EditRoleProps {
    role: Role;
}

export default function EditRole({ role }: EditRoleProps) {
    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Admin', href: '/admin' },
            { title: 'Roles', href: index.url() },
            { title: role.name, href: edit.url(role.id) },
        ],
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard header={{ title: `Edit Role: ${role.name}` }}>
                <RoleForm role={role} isEdit />
            </PageCard>
        </AdminLayout>
    );
}
