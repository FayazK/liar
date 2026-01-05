import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import AvatarUpload from '@/components/settings/avatar-upload';
import { Icon } from '@/components/ui/Icon';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import type { InputRef } from 'antd';
import { Alert, App, Button, Divider, Input, Modal, Select, Space, theme, Typography } from 'antd';
import { useRef, useState } from 'react';

const { Text, Title } = Typography;
const { useToken } = theme;
const { confirm } = Modal;

interface ProfileFormProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function ProfileForm({ mustVerifyEmail, status }: ProfileFormProps) {
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();
    const { message } = App.useApp();
    const passwordInput = useRef<InputRef>(null);
    const [timezone, setTimezone] = useState(auth.user.timezone || 'UTC');
    const [locale, setLocale] = useState(auth.user.locale || 'en');

    const showDeleteConfirm = () => {
        confirm({
            title: 'Delete your account?',
            icon: <Icon name="alert-circle" size={22} color={token.colorError} />,
            content: (
                <div>
                    <Text type="secondary">
                        This action is permanent. All your data will be deleted and cannot be recovered.
                    </Text>
                    <Input.Password
                        ref={passwordInput}
                        placeholder="Enter your password to confirm"
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
                message.error('Account deletion functionality needs to be implemented');
            },
        });
    };

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={4} style={{ marginBottom: token.marginXS }}>
                    Profile
                </Title>
                <Text type="secondary">Update your personal information</Text>
            </div>

            <Form
                method="patch"
                action={ProfileController.update.url()}
                options={{ preserveScroll: true }}
                onSuccess={() => message.success('Profile updated successfully!')}
            >
                {({ processing, errors }) => (
                    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', gap: token.marginMD }}>
                            <div style={{ flex: 1 }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                    First Name
                                </Text>
                                <Input
                                    name="first_name"
                                    defaultValue={auth.user.first_name}
                                    placeholder="First name"
                                    required
                                    autoComplete="given-name"
                                    status={errors.first_name ? 'error' : undefined}
                                />
                                {errors.first_name && (
                                    <Text type="danger" style={{ fontSize: 12 }}>{errors.first_name}</Text>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                    Last Name
                                </Text>
                                <Input
                                    name="last_name"
                                    defaultValue={auth.user.last_name}
                                    placeholder="Last name"
                                    required
                                    autoComplete="family-name"
                                    status={errors.last_name ? 'error' : undefined}
                                />
                                {errors.last_name && (
                                    <Text type="danger" style={{ fontSize: 12 }}>{errors.last_name}</Text>
                                )}
                            </div>
                        </div>

                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                Email
                            </Text>
                            <Input
                                name="email"
                                type="email"
                                defaultValue={auth.user.email}
                                placeholder="Email address"
                                required
                                autoComplete="username"
                                status={errors.email ? 'error' : undefined}
                            />
                            {errors.email && (
                                <Text type="danger" style={{ fontSize: 12 }}>{errors.email}</Text>
                            )}
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <Alert
                                message={
                                    <span>
                                        Email not verified.{' '}
                                        <Link href={send()} as="button">
                                            <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                                                Resend verification
                                            </Button>
                                        </Link>
                                        {status === 'verification-link-sent' && (
                                            <Text type="success"> - Sent!</Text>
                                        )}
                                    </span>
                                }
                                type="warning"
                                showIcon
                            />
                        )}

                        <div style={{ display: 'flex', gap: token.marginMD }}>
                            <div style={{ flex: 1 }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                    Timezone
                                </Text>
                                <input type="hidden" name="timezone" value={timezone} />
                                <Select
                                    value={timezone}
                                    onChange={setTimezone}
                                    placeholder="Select timezone"
                                    style={{ width: '100%' }}
                                    status={errors.timezone ? 'error' : undefined}
                                    options={[
                                        { value: 'UTC', label: 'UTC' },
                                        { value: 'America/New_York', label: 'Eastern Time (ET)' },
                                        { value: 'America/Chicago', label: 'Central Time (CT)' },
                                        { value: 'America/Denver', label: 'Mountain Time (MT)' },
                                        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                                        { value: 'Europe/London', label: 'London (GMT)' },
                                        { value: 'Europe/Paris', label: 'Paris (CET)' },
                                        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
                                        { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
                                        { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
                                    ]}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                                    Language
                                </Text>
                                <input type="hidden" name="locale" value={locale} />
                                <Select
                                    value={locale}
                                    onChange={setLocale}
                                    placeholder="Select language"
                                    style={{ width: '100%' }}
                                    status={errors.locale ? 'error' : undefined}
                                    options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'es', label: 'Español' },
                                        { value: 'fr', label: 'Français' },
                                        { value: 'de', label: 'Deutsch' },
                                        { value: 'ja', label: '日本語' },
                                        { value: 'zh', label: '中文' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div style={{ paddingTop: token.paddingSM }}>
                            <Button type="primary" htmlType="submit" loading={processing}>
                                Save Changes
                            </Button>
                        </div>
                    </Space>
                )}
            </Form>

            <Divider style={{ margin: `${token.marginLG}px 0` }} />

            <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: token.marginSM, fontSize: 13 }}>
                    Profile Photo
                </Text>
                <AvatarUpload />
            </div>

            <Divider style={{ margin: `${token.marginLG}px 0` }} />

            <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: token.marginSM, fontSize: 13 }}>
                    Danger Zone
                </Text>
                <Button danger onClick={showDeleteConfirm} icon={<Icon name="trash" size={16} />}>
                    Delete Account
                </Button>
            </div>
        </Space>
    );
}
