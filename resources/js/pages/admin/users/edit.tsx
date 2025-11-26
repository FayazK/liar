import AdminLayout from '@/layouts/admin-layout';
import UserForm from './partials/user-form';
export default function EditUser({ user }) {
    return (
        <AdminLayout pageTitle={user ? `Edit User: ${user.full_name}` : 'Edit User'}>
            <UserForm user={user} isEdit />
        </AdminLayout>
    );
}
