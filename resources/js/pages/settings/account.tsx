import AppearanceForm from '@/components/settings/appearance-form';
import PasswordForm from '@/components/settings/password-form';
import ProfileForm from '@/components/settings/profile-form';
import { Icon } from '@/components/ui/Icon';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Menu, theme } from 'antd';
import { useEffect, useState } from 'react';

const { useToken } = theme;

interface AccountProps {
    mustVerifyEmail: boolean;
    status?: string;
}

type TabKey = 'profile' | 'password' | 'appearance';

const menuItems = [
    { key: 'profile', label: 'Profile', icon: <Icon name="user" size={18} /> },
    { key: 'password', label: 'Password', icon: <Icon name="lock" size={18} /> },
    { key: 'appearance', label: 'Appearance', icon: <Icon name="palette" size={18} /> },
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

    const handleMenuClick = (key: string) => {
        const tabKey = key as TabKey;
        setActiveTab(tabKey);
        window.history.replaceState(null, '', `#${tabKey}`);
    };

    return (
        <AppLayout pageTitle="Settings">
            <Head title="Settings" />

            <div style={{ display: 'flex', gap: token.marginLG, minHeight: 'calc(100vh - 200px)' }}>
                <div
                    style={{
                        width: 220,
                        flexShrink: 0,
                        borderRight: `1px solid ${token.colorBorderSecondary}`,
                        paddingRight: token.paddingMD,
                    }}
                >
                    <Menu
                        mode="vertical"
                        selectedKeys={[activeTab]}
                        onClick={({ key }) => handleMenuClick(key)}
                        items={menuItems}
                        style={{
                            border: 'none',
                            background: 'transparent',
                        }}
                    />
                </div>

                <div style={{ flex: 1, maxWidth: 720 }}>
                    {activeTab === 'profile' && <ProfileForm mustVerifyEmail={mustVerifyEmail} status={status} />}
                    {activeTab === 'password' && <PasswordForm />}
                    {activeTab === 'appearance' && <AppearanceForm />}
                </div>
            </div>
        </AppLayout>
    );
}
