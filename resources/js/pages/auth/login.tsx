import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { LoadingOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Alert, Button, Checkbox, Flex, Form, Input, Typography, message, theme } from 'antd';
import { useState } from 'react';

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
            message.success('Sign in successful');
            // Redirect to intended page or dashboard
            router.visit('/dashboard');
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
                message.error('Sign in failed. Please check your email and password.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Sign in to your account" description="Enter your email and password to continue">
            <Head title="Sign in" />

            {status && <Alert message={status} type="success" showIcon style={{ marginBottom: token.marginMD }} />}

            <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
                <Form.Item
                    name="email"
                    label={<Text style={{ color: token.colorText, fontSize: token.fontSize }}>Email address</Text>}
                    rules={[
                        { required: true, message: 'Please enter your email address' },
                        { type: 'email', message: 'Please enter a valid email address' },
                    ]}
                    style={{ marginBottom: token.marginLG }}
                >
                    <Input placeholder="email@example.com" autoComplete="email" autoFocus size="large" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={<Text style={{ color: token.colorText, fontSize: token.fontSize }}>Password</Text>}
                    rules={[{ required: true, message: 'Please enter your password' }]}
                    style={{ marginBottom: token.marginMD }}
                >
                    <Input.Password placeholder="Enter your password" autoComplete="current-password" size="large" />
                </Form.Item>

                <Flex justify="space-between" align="center" style={{ marginBottom: token.marginLG }}>
                    <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Checkbox>
                            <Text style={{ color: token.colorText, fontSize: token.fontSize }}>Remember me</Text>
                        </Checkbox>
                    </Form.Item>

                    {canResetPassword && (
                        <Link
                            href={request.url()}
                            style={{
                                fontSize: token.fontSize,
                                color: token.colorPrimary,
                            }}
                        >
                            Forgot password?
                        </Link>
                    )}
                </Flex>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" size="large" block loading={loading} icon={loading ? <LoadingOutlined /> : null}>
                        Sign in
                    </Button>
                </Form.Item>
            </Form>

            <Flex
                justify="center"
                align="center"
                style={{
                    marginTop: token.marginLG,
                    paddingTop: token.paddingLG,
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
                    Don't have an account?{' '}
                    <Link href={register.url()} style={{ color: token.colorPrimary, fontWeight: 500 }}>
                        Create account
                    </Link>
                </Text>
            </Flex>
        </AuthLayout>
    );
}
