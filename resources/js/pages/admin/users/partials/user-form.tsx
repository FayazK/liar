import AdvancedSelect from '@/components/advanced-select';
import api from '@/lib/axios';
import type { Role, User } from '@/types';
import { isApiError } from '@/utils/errors';
import { router } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Col, DatePicker, Form, Input, Row, Select, Switch } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface UserFormValues {
    first_name: string;
    last_name: string;
    email: string;
    role_id?: number | null;
    phone?: string;
    password?: string;
    password_confirmation?: string;
    date_of_birth?: Dayjs | null;
    bio?: string;
    timezone_id?: number;
    language_id?: number;
    is_active: boolean;
}

interface UserFormProps {
    user?: User;
    isEdit?: boolean;
}

export default function UserForm({ user, isEdit = false }: UserFormProps) {
    const { notification } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Fetch roles for the select dropdown
    const { data: roles } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get<{ data: Role[] }>('/admin/roles/data');
            return response.data.data;
        },
    });

    useEffect(() => {
        form.setFieldsValue({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            role_id: user?.role_id || null,
            phone: user?.phone || '',
            date_of_birth: user?.date_of_birth ? dayjs(user.date_of_birth) : null,
            bio: user?.bio || '',
            timezone_id: user?.timezone_id,
            language_id: user?.language_id,
            is_active: user?.is_active ?? true,
        });
    }, [user, form]);

    const onFinish = async (values: UserFormValues) => {
        setLoading(true);
        const requestData = {
            ...values,
            date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
        };

        const method = isEdit ? 'put' : 'post';
        const url = isEdit ? `/admin/users/${user!.id}` : '/admin/users';

        try {
            const response = await api[method](url, requestData);
            notification.success({
                title: response.data.message || `User ${isEdit ? 'updated' : 'created'} successfully`,
            });
            router.visit('/admin/users');
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
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: 'Please input the first name!' }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Last Name" name="last_name" rules={[{ required: true, message: 'Please input the last name!' }]}>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                <Input type="email" />
            </Form.Item>

            <Form.Item label="Role" name="role_id">
                <Select
                    placeholder="Select a role"
                    allowClear
                    options={roles?.map((role) => ({
                        label: role.name,
                        value: role.id,
                    }))}
                />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: !isEdit, message: 'Please input a password!' }]}
                        extra={isEdit ? 'Leave blank to keep current password' : ''}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Confirm Password"
                        name="password_confirmation"
                        dependencies={['password']}
                        rules={[
                            { required: !isEdit || !!form.getFieldValue('password'), message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Phone" name="phone">
                <Input />
            </Form.Item>

            <Form.Item label="Date of Birth" name="date_of_birth">
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Bio" name="bio">
                <Input.TextArea rows={4} />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Timezone" name="timezone_id">
                        <AdvancedSelect type="timezones" initialId={typeof user?.timezone_id === 'number' ? user.timezone_id : null} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Language" name="language_id">
                        <AdvancedSelect type="languages" initialId={typeof user?.language_id === 'number' ? user.language_id : null} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Active Status" name="is_active" valuePropName="checked">
                <Switch />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {isEdit ? 'Update User' : 'Create User'}
                </Button>
            </Form.Item>
        </Form>
    );
}
