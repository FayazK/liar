import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types';
import UserForm from './partials/user-form';

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    return (
        <AdminLayout pageTitle={user ? `Edit User: ${user.full_name}` : 'Edit User'}>
            <UserForm user={user} isEdit />
        </AdminLayout>
    );
}
