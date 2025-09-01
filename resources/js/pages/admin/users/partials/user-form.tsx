import { Form, Input, Button, Switch, DatePicker, Row, Col, notification } from 'antd';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import api from '@/lib/axios';
import { useEffect, useState } from 'react';

interface UserFormProps {
    user?: User;
    isEdit?: boolean;
}

export default function UserForm({ user, isEdit = false }: UserFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            date_of_birth: user?.date_of_birth ? dayjs(user.date_of_birth) : null,
            bio: user?.bio || '',
            timezone: user?.timezone || 'UTC',
            locale: user?.locale || 'en',
            is_active: user?.is_active ?? true,
        });
    }, [user, form]);

    const onFinish = async (values: any) => {
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
                message: response.data.message || `User ${isEdit ? 'updated' : 'created'} successfully`,
            });
            router.visit('/admin/users');
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                const formErrors = Object.keys(validationErrors).map(key => ({
                    name: key,
                    errors: validationErrors[key],
                }));
                form.setFields(formErrors);
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
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[{ required: true, message: 'Please input the first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[{ required: true, message: 'Please input the last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
            >
                <Input type="email" />
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

            <Form.Item
                label="Phone"
                name="phone"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Date of Birth"
                name="date_of_birth"
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Bio"
                name="bio"
            >
                <Input.TextArea rows={4} />
            </Form.Item>
            
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Timezone"
                        name="timezone"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Locale"
                        name="locale"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Active Status"
                name="is_active"
                valuePropName="checked"
            >
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