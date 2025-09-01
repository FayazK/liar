import AdminLayout from '@/layouts/admin-layout';
import UserForm from './partials/user-form';
import { Card } from 'antd';

export default function CreateUser() {
    return (
        <AdminLayout pageTitle="Create New User">
            <Card>
                <UserForm />
            </Card>
        </AdminLayout>
    );
}
