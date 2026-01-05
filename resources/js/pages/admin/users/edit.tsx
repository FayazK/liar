import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types';
import UserForm from './partials/user-form';

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    return (
        <AdminLayout>
            <PageCard header={{ title: `Edit User: ${user.full_name}` }}>
                <UserForm user={user} isEdit />
            </PageCard>
        </AdminLayout>
    );
}
