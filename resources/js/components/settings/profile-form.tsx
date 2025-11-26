import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import AvatarUpload from '@/components/settings/avatar-upload';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { DeleteOutlined, ExclamationCircleOutlined, LoadingOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Link, usePage } from '@inertiajs/react';
import type { InputRef } from 'antd';
import { Alert, Button, Card, DatePicker, Input, message, Modal, Select, Space, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;
const { confirm } = Modal;

interface ProfileFormProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function ProfileForm({ mustVerifyEmail, status }: ProfileFormProps) {
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();
    const passwordInput = useRef<InputRef>(null);
    const [timezone, setTimezone] = useState(auth.user.timezone || 'UTC');
    const [locale, setLocale] = useState(auth.user.locale || 'en');

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to delete your account?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <Text>
                        Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm
                        you would like to permanently delete your account.
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
                message.error('Account deletion functionality needs to be implemented');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Profile Photo" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: token.paddingLG }}>
                    <AvatarUpload />
                </div>
            </Card>

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
                            <div style={{ display: 'flex', gap: token.marginMD }}>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                        First Name
                                    </Text>
                                    <Input
                                        name="first_name"
                                        defaultValue={auth.user.first_name}
                                        placeholder="Enter your first name"
                                        size="large"
                                        prefix={<UserOutlined />}
                                        required
                                        autoComplete="given-name"
                                        status={errors.first_name ? 'error' : undefined}
                                    />
                                    {errors.first_name && (
                                        <Alert message={errors.first_name} type="error" showIcon style={{ marginTop: token.marginXS }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                        Last Name
                                    </Text>
                                    <Input
                                        name="last_name"
                                        defaultValue={auth.user.last_name}
                                        placeholder="Enter your last name"
                                        size="large"
                                        prefix={<UserOutlined />}
                                        required
                                        autoComplete="family-name"
                                        status={errors.last_name ? 'error' : undefined}
                                    />
                                    {errors.last_name && (
                                        <Alert message={errors.last_name} type="error" showIcon style={{ marginTop: token.marginXS }} />
                                    )}
                                </div>
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
                                {errors.email && <Alert message={errors.email} type="error" showIcon style={{ marginTop: token.marginXS }} />}
                            </div>

                            <div style={{ display: 'flex', gap: token.marginMD }}>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                        Phone Number
                                    </Text>
                                    <Input
                                        name="phone"
                                        defaultValue={auth.user.phone}
                                        placeholder="Enter your phone number"
                                        size="large"
                                        prefix={<PhoneOutlined />}
                                        autoComplete="tel"
                                        status={errors.phone ? 'error' : undefined}
                                    />
                                    {errors.phone && <Alert message={errors.phone} type="error" showIcon style={{ marginTop: token.marginXS }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                        Date of Birth
                                    </Text>
                                    <DatePicker
                                        name="date_of_birth"
                                        defaultValue={auth.user.date_of_birth ? dayjs(auth.user.date_of_birth) : undefined}
                                        placeholder="Select your date of birth"
                                        size="large"
                                        style={{ width: '100%' }}
                                        status={errors.date_of_birth ? 'error' : undefined}
                                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                                    />
                                    {errors.date_of_birth && (
                                        <Alert message={errors.date_of_birth} type="error" showIcon style={{ marginTop: token.marginXS }} />
                                    )}
                                </div>
                            </div>

                            <div>
                                <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                    Bio
                                </Text>
                                <Input.TextArea
                                    name="bio"
                                    defaultValue={auth.user.bio}
                                    placeholder="Tell us about yourself"
                                    rows={3}
                                    maxLength={1000}
                                    showCount
                                    status={errors.bio ? 'error' : undefined}
                                />
                                {errors.bio && <Alert message={errors.bio} type="error" showIcon style={{ marginTop: token.marginXS }} />}
                            </div>

                            <div style={{ display: 'flex', gap: token.marginMD }}>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                        Timezone
                                    </Text>
                                    <input type="hidden" name="timezone" value={timezone} />
                                    <Select
                                        value={timezone}
                                        onChange={setTimezone}
                                        placeholder="Select your timezone"
                                        size="large"
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
                                    {errors.timezone && (
                                        <Alert message={errors.timezone} type="error" showIcon style={{ marginTop: token.marginXS }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', marginBottom: token.marginXS }}>
                                        Language
                                    </Text>
                                    <input type="hidden" name="locale" value={locale} />
                                    <Select
                                        value={locale}
                                        onChange={setLocale}
                                        placeholder="Select your language"
                                        size="large"
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
                                    {errors.locale && <Alert message={errors.locale} type="error" showIcon style={{ marginTop: token.marginXS }} />}
                                </div>
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
                title={<Text style={{ color: token.colorError }}>Delete Account</Text>}
                style={{ width: '100%', borderColor: token.colorErrorBorder }}
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Alert
                        message="Warning"
                        description="Once your account is deleted, all of its resources and data will be permanently deleted. Please proceed with caution as this cannot be undone."
                        type="error"
                        showIcon
                    />
                    <Button danger icon={<DeleteOutlined />} size="large" onClick={showDeleteConfirm}>
                        Delete Account
                    </Button>
                </Space>
            </Card>
        </Space>
    );
}
