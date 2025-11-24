import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { Card, Input, Button, Space, Typography, Alert, theme, message } from 'antd';
import type { InputRef } from 'antd';
import { LockOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Password: PasswordInput } = Input;
const { useToken } = theme;


export default function Password() {
    const passwordInput = useRef<InputRef>(null);
    const currentPasswordInput = useRef<InputRef>(null);
    const { token } = useToken();

    return (
        <AppLayout pageTitle="Password">
            <Head title="Password settings" />

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={3} style={{ marginBottom: token.marginXS }}>
                            Update Password
                        </Title>
                        <Text type="secondary">
                            Ensure your account is using a long, random password to stay secure.
                        </Text>
                    </div>

                    <Card title="Change Password" style={{ width: '100%' }}>
                        <Form
                            method="put"
                            action={PasswordController.update.url()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={['password', 'password_confirmation', 'current_password']}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }
                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            onSuccess={() => {
                                message.success('Password updated successfully!');
                            }}
                        >
                            {({ errors, processing }) => (
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                            Current Password
                                        </Text>
                                        <PasswordInput
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            placeholder="Enter your current password"
                                            autoComplete="current-password"
                                            size="large"
                                            prefix={<LockOutlined />}
                                            status={errors.current_password ? 'error' : undefined}
                                        />
                                        {errors.current_password && (
                                            <Alert
                                                message={errors.current_password}
                                                type="error"
                                                showIcon
                                                style={{ marginTop: token.marginXS }}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                            New Password
                                        </Text>
                                        <PasswordInput
                                            ref={passwordInput}
                                            name="password"
                                            placeholder="Enter your new password"
                                            autoComplete="new-password"
                                            size="large"
                                            prefix={<LockOutlined />}
                                            status={errors.password ? 'error' : undefined}
                                        />
                                        {errors.password && (
                                            <Alert
                                                message={errors.password}
                                                type="error"
                                                showIcon
                                                style={{ marginTop: token.marginXS }}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                            Confirm New Password
                                        </Text>
                                        <PasswordInput
                                            name="password_confirmation"
                                            placeholder="Confirm your new password"
                                            autoComplete="new-password"
                                            size="large"
                                            prefix={<LockOutlined />}
                                            status={errors.password_confirmation ? 'error' : undefined}
                                        />
                                        {errors.password_confirmation && (
                                            <Alert
                                                message={errors.password_confirmation}
                                                type="error"
                                                showIcon
                                                style={{ marginTop: token.marginXS }}
                                            />
                                        )}
                                    </div>

                                    <div style={{ paddingTop: token.paddingMD }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={processing}
                                            icon={processing ? <LoadingOutlined /> : <LockOutlined />}
                                            size="large"
                                        >
                                            Update Password
                                        </Button>
                                    </div>
                                </Space>
                            )}
                        </Form>
                    </Card>
                </Space>
        </AppLayout>
    );
}
