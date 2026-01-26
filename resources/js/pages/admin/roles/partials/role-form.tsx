import { PermissionSelector } from '@/components/admin/PermissionSelector';
import api from '@/lib/axios';
import type { Role, SharedData } from '@/types';
import { isApiError } from '@/utils/errors';
import { router, usePage } from '@inertiajs/react';
import { App, Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

interface RoleFormValues {
    name: string;
    description?: string;
    permission_ids?: number[];
}

interface RoleFormProps {
    role?: Role;
    isEdit?: boolean;
}

export default function RoleForm({ role, isEdit = false }: RoleFormProps) {
    const { notification } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { permissions = [] } = usePage<SharedData>().props;

    useEffect(() => {
        form.setFieldsValue({
            name: role?.name || '',
            description: role?.description || '',
            permission_ids: role?.permission_ids || [],
        });
    }, [role, form]);

    const onFinish = async (values: RoleFormValues) => {
        setLoading(true);

        const method = isEdit ? 'put' : 'post';
        const url = isEdit ? `/admin/roles/${role!.id}` : '/admin/roles';

        try {
            const response = await api[method](url, values);
            notification.success({
                title: response.data.message || `Role ${isEdit ? 'updated' : 'created'} successfully`,
            });
            router.visit('/admin/roles');
        } catch (error: unknown) {
            if (isApiError(error) && error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                if (validationErrors) {
                    const formErrors = Object.keys(validationErrors).map((key) => ({
                        name: key,
                        errors: validationErrors[key],
                    }));
                    form.setFields(formErrors);
                }
                notification.error({
                    title: 'Validation Error',
                    description: error.response.data.message,
                });
            } else {
                notification.error({
                    title: 'Error',
                    description: 'An unexpected error occurred.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the role name!' }]}>
                <Input maxLength={50} />
            </Form.Item>

            <Form.Item label="Description" name="description">
                <Input.TextArea rows={4} maxLength={255} />
            </Form.Item>

            <Form.Item label="Permissions" name="permission_ids">
                <PermissionSelector permissions={permissions} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {isEdit ? 'Update Role' : 'Create Role'}
                </Button>
            </Form.Item>
        </Form>
    );
}
