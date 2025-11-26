import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
import { LoadingOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Button, Form, Input, Space, Typography, message, theme } from 'antd';
import { useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;

interface ResetPasswordProps {
    token: string;
    email: string;
}

interface ResetPasswordFormData {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { token: themeToken } = useToken();

    const handleSubmit = async (values: Omit<ResetPasswordFormData, 'token'>) => {
        setLoading(true);
        try {
            await api.post('/reset-password', {
                ...values,
                token,
            });
            message.success('Password reset successfully!');
            // Redirect to login page
            router.visit('/login');
        } catch (error: any) {
            if (error.response?.status === 422) {
                // Validation errors
                const errors = error.response.data.errors;
                form.setFields(
                    Object.keys(errors).map((field) => ({
                        name: field,
                        errors: errors[field],
                    })),
                );
            } else {
                message.error('Failed to reset password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset password" description="Please enter your new password below">
            <Head title="Reset password" />

            <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false} initialValues={{ email }}>
                <Space direction="vertical" size="middle" className="w-full">
                    <Form.Item name="email" label={<Text style={{ color: themeToken.colorText }}>Email</Text>}>
                        <Input
                            value={email}
                            readOnly
                            size="large"
                            style={{
                                backgroundColor: themeToken.colorFillTertiary,
                                color: themeToken.colorTextSecondary,
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<Text style={{ color: themeToken.colorText }}>New Password</Text>}
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 8, message: 'Password must be at least 8 characters' },
                        ]}
                    >
                        <Input.Password placeholder="New password" autoComplete="new-password" autoFocus size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password_confirmation"
                        label={<Text style={{ color: themeToken.colorText }}>Confirm New Password</Text>}
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm new password" autoComplete="new-password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading} icon={loading ? <LoadingOutlined /> : null}>
                            Reset password
                        </Button>
                    </Form.Item>
                </Space>
            </Form>
        </AuthLayout>
    );
}
