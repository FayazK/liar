import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
import { request } from '@/routes/password';
import { Head, router } from '@inertiajs/react';
import { Alert, Button, Checkbox, Form, Input, Space, Typography, theme, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { register } from '@/routes';

const { Link, Text } = Typography;
const { useToken } = theme;

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

interface LoginFormData {
    email: string;
    password: string;
    remember?: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { token } = useToken();

    const handleSubmit = async (values: LoginFormData) => {
        setLoading(true);
        try {
            await api.post('/login', values);
            message.success('Login successful!');
            // Redirect to intended page or dashboard
            router.visit('/dashboard');
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (error.response?.status === 422) {
                // Validation errors
                const errors = error.response.data.errors;
                form.setFields(
                    Object.keys(errors).map(field => ({
                        name: field,
                        errors: errors[field],
                    }))
                );
            } else {
                message.error('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            {status && (
                <Alert
                    message={status}
                    type="success"
                    showIcon
                    style={{ marginBottom: token.marginLG }}
                />
            )}

            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
            >
                <Space direction="vertical" size="middle" className="w-full">
                    <Form.Item
                        name="email"
                        label={<Text style={{ color: token.colorText }}>Email address</Text>}
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            placeholder="email@example.com"
                            autoComplete="email"
                            autoFocus
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Text style={{ color: token.colorText }}>Password</Text>
                                {canResetPassword && (
                                    <Link
                                        href={request.url()}
                                        style={{
                                            fontSize: token.fontSizeSM,
                                            color: token.colorPrimary
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                        }
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            placeholder="Password"
                            autoComplete="current-password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox style={{ color: token.colorText }}>
                            Remember me
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                            icon={loading ? <LoadingOutlined /> : null}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Space>
            </Form>

            <div style={{ textAlign: 'center', marginTop: token.marginLG }}>
                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                    Don't have an account?{' '}
                    <Link href={register.url()} style={{ color: token.colorPrimary }}>
                        Sign up
                    </Link>
                </Text>
            </div>
        </AuthLayout>
    );
}
