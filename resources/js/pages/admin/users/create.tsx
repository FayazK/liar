import AdminLayout from '@/layouts/admin-layout';
import { Card } from 'antd';
import UserForm from './partials/user-form';

export default function CreateUser() {
    return (
        <AdminLayout pageTitle="Create New User">
            <Card>
                <UserForm />
            </Card>
        </AdminLayout>
    );
}
