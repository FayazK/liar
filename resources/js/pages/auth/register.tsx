import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
import { login } from '@/routes';
import { LoadingOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Button, Flex, Form, Input, Typography, message, theme } from 'antd';
import { useState } from 'react';

const { Link, Text } = Typography;
const { useToken } = theme;

interface RegisterFormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { token } = useToken();

    const handleSubmit = async (values: RegisterFormData) => {
        setLoading(true);
        try {
            await api.post('/register', values);
            message.success('Account created successfully');
            // Redirect to dashboard or email verification
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
                message.error('Account creation failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details to get started">
            <Head title="Create account" />

            <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
                <Form.Item
                    name="first_name"
                    label={<Text style={{ color: token.colorText, fontSize: token.fontSize }}>First name</Text>}
                    rules={[
                        { required: true, message: 'Please enter your first name' },
                        { min: 2, message: 'First name must be at least 2 characters' },
                    ]}
                    style={{ marginBottom: token.marginLG }}
                >
                    <Input placeholder="Enter your first name" autoComplete="given-name" autoFocus size="large" />
                </Form.Item>

                <Form.Item
                    name="last_name"
                    label={<Text style={{ color: token.colorText, fontSize: token.fontSize }}>Last name</Text>}
                    rules={[
                        { required: true, message: 'Please enter your last name' },
                        { min: 2, message: 'Last name must be at least 2 characters' },
                    ]}
                    style={{ marginBottom: token.marginLG }}
                >
                    <Input placeholder="Enter your last name" autoComplete="family-name" size="large" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label={<Text style={{ color: token.colorText, fontSize: token.fontSize }}>Email address</Text>}
                    rules={[
                        { required: true, message: 'Please enter your email address' },
                        { type: 'email', message: 'Please enter a valid email address' },
                    ]}
                    style={{ marginBottom: token.marginLG }}
                >
                    <Input placeholder="email@example.com" autoComplete="email" size="large" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={<Text style={{ color: token.colorText, fontSize: token.fontSize }}>Password</Text>}
                    rules={[
                        { required: true, message: 'Please enter your password' },
                        { min: 8, message: 'Password must be at least 8 characters' },
                    ]}
                    style={{ marginBottom: token.marginLG }}
                >
                    <Input.Password placeholder="Create a password" autoComplete="new-password" size="large" />
                </Form.Item>

                <Form.Item
                    name="password_confirmation"
                    label={<Text style={{ color: token.colorText, fontSize: token.fontSize }}>Confirm password</Text>}
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                    style={{ marginBottom: token.marginLG }}
                >
                    <Input.Password placeholder="Confirm your password" autoComplete="new-password" size="large" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" size="large" block loading={loading} icon={loading ? <LoadingOutlined /> : null}>
                        Create account
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
                    Already have an account?{' '}
                    <Link href={login().url} style={{ color: token.colorPrimary, fontWeight: 500 }}>
                        Sign in
                    </Link>
                </Text>
            </Flex>
        </AuthLayout>
    );
}
