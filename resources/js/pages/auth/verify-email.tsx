import AuthLayout from '@/layouts/auth-layout';
import api from '@/lib/axios';
// import { logout } from '@/routes'; // Unused for now
import { LoadingOutlined, LogoutOutlined, MailOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Alert, Button, Space, Typography, message, theme } from 'antd';
import { useState } from 'react';

const { Link } = Typography;
const { useToken } = theme;

export default function VerifyEmail({ status }: { status?: string }) {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(status === 'verification-link-sent');
    const { token } = useToken();

    const handleResendEmail = async () => {
        setLoading(true);
        try {
            await api.post('/email/verification-notification');
            setEmailSent(true);
            message.success('Verification email sent!');
        } catch {
            message.error('Failed to send verification email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            router.visit('/login');
        } catch {
            // If logout fails, still redirect to login
            router.visit('/login');
        }
    };

    return (
        <AuthLayout title="Verify your email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            <Space direction="vertical" size="large" className="w-full">
                <Alert
                    message="Email Verification Required"
                    description="Before continuing, please check your email for a verification link. If you didn't receive the email, we can send you another one."
                    type="warning"
                    showIcon
                    icon={<MailOutlined />}
                />

                {emailSent && (
                    <Alert
                        message="Verification Email Sent!"
                        description="A new verification link has been sent to your email address. Please check your inbox and click the verification link."
                        type="success"
                        showIcon
                    />
                )}

                <div style={{ textAlign: 'center' }}>
                    <Space direction="vertical" size="middle">
                        <Button
                            type="default"
                            size="large"
                            onClick={handleResendEmail}
                            loading={loading}
                            icon={loading ? <LoadingOutlined /> : <MailOutlined />}
                            style={{
                                borderColor: token.colorPrimary,
                                color: token.colorPrimary,
                            }}
                        >
                            Resend verification email
                        </Button>

                        <Link
                            onClick={handleLogout}
                            style={{
                                color: token.colorTextSecondary,
                                fontSize: token.fontSizeSM,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                            }}
                        >
                            <LogoutOutlined />
                            Log out
                        </Link>
                    </Space>
                </div>
            </Space>
        </AuthLayout>
    );
}
