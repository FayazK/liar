import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import { Form } from '@inertiajs/react';
import type { InputRef } from 'antd';
import { App, Button, Input, Space, theme, Typography } from 'antd';
import { useRef } from 'react';

const { Text, Title } = Typography;
const { Password: PasswordInput } = Input;
const { useToken } = theme;

export default function PasswordForm() {
    const passwordInput = useRef<InputRef>(null);
    const currentPasswordInput = useRef<InputRef>(null);
    const { token } = useToken();
    const { message } = App.useApp();

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={4} style={{ marginBottom: token.marginXS }}>
                    Password
                </Title>
                <Text type="secondary">Update your password to keep your account secure</Text>
            </div>

            <Form
                method="put"
                action={PasswordController.update.url()}
                options={{ preserveScroll: true }}
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
                onSuccess={() => message.success('Password updated successfully!')}
            >
                {({ errors, processing }) => (
                    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                Current Password
                            </Text>
                            <PasswordInput
                                ref={currentPasswordInput}
                                name="current_password"
                                placeholder="Enter current password"
                                autoComplete="current-password"
                                status={errors.current_password ? 'error' : undefined}
                            />
                            {errors.current_password && (
                                <Text type="danger" style={{ fontSize: 12 }}>{errors.current_password}</Text>
                            )}
                        </div>

                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                New Password
                            </Text>
                            <PasswordInput
                                ref={passwordInput}
                                name="password"
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                status={errors.password ? 'error' : undefined}
                            />
                            {errors.password && (
                                <Text type="danger" style={{ fontSize: 12 }}>{errors.password}</Text>
                            )}
                        </div>

                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                Confirm New Password
                            </Text>
                            <PasswordInput
                                name="password_confirmation"
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                status={errors.password_confirmation ? 'error' : undefined}
                            />
                            {errors.password_confirmation && (
                                <Text type="danger" style={{ fontSize: 12 }}>{errors.password_confirmation}</Text>
                            )}
                        </div>

                        <div style={{ paddingTop: token.paddingSM }}>
                            <Button type="primary" htmlType="submit" loading={processing}>
                                Update Password
                            </Button>
                        </div>
                    </Space>
                )}
            </Form>
        </Space>
    );
}
