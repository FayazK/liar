import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
import { login } from '@/routes';
import { LoadingOutlined } from '@ant-design/icons';
import { Head } from '@inertiajs/react';
import { Alert, Button, Form, Input, Space, Typography, message, theme } from 'antd';
import { useState } from 'react';

const { Link, Text } = Typography;
const { useToken } = theme;

interface ForgotPasswordFormData {
    email: string;
}

export default function ForgotPassword({ status }: { status?: string }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { token } = useToken();

    const handleSubmit = async (values: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            await api.post('/forgot-password', values);
            setEmailSent(true);
            message.success('Password reset link sent to your email!');
            form.resetFields();
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
                message.error('Failed to send reset link. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
            <Head title="Forgot password" />

            {status && <Alert message={status} type="success" showIcon style={{ marginBottom: token.marginLG }} />}

            {emailSent && (
                <Alert
                    message="Check your email"
                    description="We have sent a password reset link to your email address."
                    type="info"
                    showIcon
                    style={{ marginBottom: token.marginLG }}
                />
            )}

            <Space direction="vertical" size="large" className="w-full">
                <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
                    <Space direction="vertical" size="middle" className="w-full">
                        <Form.Item
                            name="email"
                            label={<Text style={{ color: token.colorText }}>Email address</Text>}
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input placeholder="email@example.com" autoComplete="email" autoFocus size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block loading={loading} icon={loading ? <LoadingOutlined /> : null}>
                                Email password reset link
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                        Or, return to{' '}
                        <Link href={login().url} style={{ color: token.colorPrimary }}>
                            log in
                        </Link>
                    </Text>
                </div>
            </Space>
        </AuthLayout>
    );
}
