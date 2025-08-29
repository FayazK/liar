import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
import { login } from '@/routes';
import { Head, router } from '@inertiajs/react';
import { Button, Form, Input, Space, Typography, theme, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
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
            message.success('Account created successfully!');
            // Redirect to dashboard or email verification
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
                message.error('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />

            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
            >
                <Space direction="vertical" size="middle" className="w-full">
                    <Form.Item
                        name="first_name"
                        label={<Text style={{ color: token.colorText }}>First Name</Text>}
                        rules={[
                            { required: true, message: 'Please input your first name!' },
                            { min: 2, message: 'First name must be at least 2 characters' }
                        ]}
                    >
                        <Input
                            placeholder="First name"
                            autoComplete="given-name"
                            autoFocus
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="last_name"
                        label={<Text style={{ color: token.colorText }}>Last Name</Text>}
                        rules={[
                            { required: true, message: 'Please input your last name!' },
                            { min: 2, message: 'Last name must be at least 2 characters' }
                        ]}
                    >
                        <Input
                            placeholder="Last name"
                            autoComplete="family-name"
                            size="large"
                        />
                    </Form.Item>

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
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<Text style={{ color: token.colorText }}>Password</Text>}
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                    >
                        <Input.Password
                            placeholder="Password"
                            autoComplete="new-password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password_confirmation"
                        label={<Text style={{ color: token.colorText }}>Confirm password</Text>}
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
                        <Input.Password
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            size="large"
                        />
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
                            Create account
                        </Button>
                    </Form.Item>
                </Space>
            </Form>

            <div style={{ textAlign: 'center', marginTop: token.marginLG }}>
                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                    Already have an account?{' '}
                    <Link href={login().url} style={{ color: token.colorPrimary }}>
                        Log in
                    </Link>
                </Text>
            </div>
        </AuthLayout>
    );
}
