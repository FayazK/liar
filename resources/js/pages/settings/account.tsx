import AppearanceForm from '@/components/settings/appearance-form';
import PasswordForm from '@/components/settings/password-form';
import ProfileForm from '@/components/settings/profile-form';
import AppLayout from '@/layouts/app-layout';
import { BgColorsOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Head } from '@inertiajs/react';
import { Space, Tabs, theme, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { useToken } = theme;

interface AccountProps {
    mustVerifyEmail: boolean;
    status?: string;
}

type TabKey = 'profile' | 'password' | 'appearance';

const tabConfig: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'password', label: 'Password', icon: <LockOutlined /> },
    { key: 'appearance', label: 'Appearance', icon: <BgColorsOutlined /> },
];

function getTabFromHash(): TabKey {
    if (typeof window === 'undefined') return 'profile';
    const hash = window.location.hash.replace('#', '');
    if (['profile', 'password', 'appearance'].includes(hash)) {
        return hash as TabKey;
    }
    return 'profile';
}

export default function Account({ mustVerifyEmail, status }: AccountProps) {
    const { token } = useToken();
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    useEffect(() => {
        setActiveTab(getTabFromHash());

        const handleHashChange = () => {
            setActiveTab(getTabFromHash());
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleTabChange = (key: string) => {
        const tabKey = key as TabKey;
        setActiveTab(tabKey);
        window.history.replaceState(null, '', `#${tabKey}`);
    };

    const tabItems = tabConfig.map(({ key, label, icon }) => ({
        key,
        label: (
            <span>
                {icon}
                <span style={{ marginLeft: 8 }}>{label}</span>
            </span>
        ),
        children: (
            <div style={{ paddingTop: token.paddingMD }}>
                {key === 'profile' && <ProfileForm mustVerifyEmail={mustVerifyEmail} status={status} />}
                {key === 'password' && <PasswordForm />}
                {key === 'appearance' && <AppearanceForm />}
            </div>
        ),
    }));

    return (
        <AppLayout pageTitle="Account">
            <Head title="Account settings" />

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Title level={3} style={{ marginBottom: token.marginXS }}>
                        Account Settings
                    </Title>
                    <Text type="secondary">Manage your account settings, update your profile, and customize your preferences.</Text>
                </div>

                <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} destroyInactiveTabPane={false} size="large" />
            </Space>
        </AppLayout>
    );
}
