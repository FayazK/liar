import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import UserForm from './partials/user-form';

export default function CreateUser() {
    return (
        <AdminLayout>
            <PageCard header={{ title: 'Create New User' }}>
                <UserForm />
            </PageCard>
        </AdminLayout>
    );
}
