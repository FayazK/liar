import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Card, Input, Button, Space, Typography, Alert, theme, message, Modal } from 'antd';
import type { InputRef } from 'antd';
import { UserOutlined, MailOutlined, LoadingOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useRef } from 'react';

const { Title, Text } = Typography;
const { useToken } = theme;
const { confirm } = Modal;


export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();
    const passwordInput = useRef<InputRef>(null);

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to delete your account?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <Text>
                        Once your account is deleted, all of its resources and data will be permanently deleted. 
                        Please enter your password to confirm you would like to permanently delete your account.
                    </Text>
                    <Input.Password
                        ref={passwordInput}
                        placeholder="Enter your password"
                        style={{ marginTop: 16 }}
                        name="password"
                        autoComplete="current-password"
                    />
                </div>
            ),
            okText: 'Delete Account',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                // Handle account deletion logic here
                message.error('Account deletion functionality needs to be implemented');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Profile settings" />

            <SettingsLayout>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={3} style={{ marginBottom: token.marginXS }}>
                            Profile Information
                        </Title>
                        <Text type="secondary">
                            Update your account's profile information and email address.
                        </Text>
                    </div>

                    <Card title="Personal Information" style={{ width: '100%' }}>
                        <Form
                            method="patch"
                            action={ProfileController.update.url()}
                            options={{
                                preserveScroll: true,
                            }}
                            onSuccess={() => {
                                message.success('Profile updated successfully!');
                            }}
                        >
                            {({ processing, errors }) => (
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                            Full Name
                                        </Text>
                                        <Input
                                            name="name"
                                            defaultValue={auth.user.name}
                                            placeholder="Enter your full name"
                                            size="large"
                                            prefix={<UserOutlined />}
                                            required
                                            autoComplete="name"
                                            status={errors.name ? 'error' : undefined}
                                        />
                                        {errors.name && (
                                            <Alert
                                                message={errors.name}
                                                type="error"
                                                showIcon
                                                style={{ marginTop: token.marginXS }}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                            Email Address
                                        </Text>
                                        <Input
                                            name="email"
                                            type="email"
                                            defaultValue={auth.user.email}
                                            placeholder="Enter your email address"
                                            size="large"
                                            prefix={<MailOutlined />}
                                            required
                                            autoComplete="username"
                                            status={errors.email ? 'error' : undefined}
                                        />
                                        {errors.email && (
                                            <Alert
                                                message={errors.email}
                                                type="error"
                                                showIcon
                                                style={{ marginTop: token.marginXS }}
                                            />
                                        )}
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <Alert
                                            message="Email Verification Required"
                                            description={
                                                <div>
                                                    <Text>
                                                        Your email address is unverified.{' '}
                                                        <Link href={send()} as="button">
                                                            <Button type="link" style={{ padding: 0 }}>
                                                                Click here to resend the verification email.
                                                            </Button>
                                                        </Link>
                                                    </Text>
                                                    {status === 'verification-link-sent' && (
                                                        <Text type="success" style={{ display: 'block', marginTop: token.marginXS }}>
                                                            A new verification link has been sent to your email address.
                                                        </Text>
                                                    )}
                                                </div>
                                            }
                                            type="warning"
                                            showIcon
                                        />
                                    )}

                                    <div style={{ paddingTop: token.paddingMD }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={processing}
                                            icon={processing ? <LoadingOutlined /> : <UserOutlined />}
                                            size="large"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </Space>
                            )}
                        </Form>
                    </Card>

                    <Card
                        title={
                            <Text style={{ color: token.colorError }}>
                                Delete Account
                            </Text>
                        }
                        style={{ width: '100%', borderColor: token.colorErrorBorder }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Alert
                                message="Warning"
                                description="Once your account is deleted, all of its resources and data will be permanently deleted. Please proceed with caution as this cannot be undone."
                                type="error"
                                showIcon
                            />
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="large"
                                onClick={showDeleteConfirm}
                            >
                                Delete Account
                            </Button>
                        </Space>
                    </Card>
                </Space>
            </SettingsLayout>
        </AppLayout>
    );
}
