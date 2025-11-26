import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';
import { Head } from '@inertiajs/react';
import { Alert, Button, Form, Input, Space, Typography, message, theme } from 'antd';
import { useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;

interface ConfirmPasswordFormData {
    password: string;
}

export default function ConfirmPassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { token } = useToken();

    const handleSubmit = async (values: ConfirmPasswordFormData) => {
        setLoading(true);
        try {
            await api.post('/confirm-password', values);
            message.success('Password confirmed successfully!');
            // Redirect back to the intended page
            window.history.back();
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
                message.error('Password confirmation failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <Space direction="vertical" size="large" className="w-full">
                <Alert
                    message="Security Check Required"
                    description="For your security, please confirm your current password to continue accessing this protected area."
                    type="info"
                    showIcon
                    icon={<SafetyOutlined />}
                />

                <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
                    <Space direction="vertical" size="middle" className="w-full">
                        <Form.Item
                            name="password"
                            label={<Text style={{ color: token.colorText }}>Current Password</Text>}
                            rules={[{ required: true, message: 'Please input your current password!' }]}
                        >
                            <Input.Password placeholder="Enter your current password" autoComplete="current-password" autoFocus size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                loading={loading}
                                icon={loading ? <LoadingOutlined /> : <SafetyOutlined />}
                            >
                                Confirm password
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
            </Space>
        </AuthLayout>
    );
}
