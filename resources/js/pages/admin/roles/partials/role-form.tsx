import api from '@/lib/axios';
import type { Role } from '@/types';
import { isApiError } from '@/utils/errors';
import { router } from '@inertiajs/react';
import { Button, Form, Input, notification } from 'antd';
import { useEffect, useState } from 'react';

interface RoleFormValues {
    name: string;
    description?: string;
}

interface RoleFormProps {
    role?: Role;
    isEdit?: boolean;
}

export default function RoleForm({ role, isEdit = false }: RoleFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            name: role?.name || '',
            description: role?.description || '',
        });
    }, [role, form]);

    const onFinish = async (values: RoleFormValues) => {
        setLoading(true);

        const method = isEdit ? 'put' : 'post';
        const url = isEdit ? `/admin/roles/${role!.id}` : '/admin/roles';

        try {
            const response = await api[method](url, values);
            notification.success({
                message: response.data.message || `Role ${isEdit ? 'updated' : 'created'} successfully`,
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
                    message: 'Validation Error',
                    description: error.response.data.message,
                });
            } else {
                notification.error({
                    message: 'Error',
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

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {isEdit ? 'Update Role' : 'Create Role'}
                </Button>
            </Form.Item>
        </Form>
    );
}
