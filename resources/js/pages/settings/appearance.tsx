import { Head } from '@inertiajs/react';
import { Card, Typography, Space, Segmented, theme } from 'antd';
import { BulbOutlined, BulbFilled, DesktopOutlined } from '@ant-design/icons';
import { useAppearance, type Appearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { appearance } from '@/routes';

const { Title, Text } = Typography;
const { useToken } = theme;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: appearance().url,
    },
];

export default function Appearance() {
    const { appearance: currentAppearance, updateAppearance } = useAppearance();
    const { token } = useToken();

    const appearanceOptions = [
        {
            label: 'Light',
            value: 'light' as Appearance,
            icon: <BulbOutlined />,
        },
        {
            label: 'Dark', 
            value: 'dark' as Appearance,
            icon: <BulbFilled />,
        },
        {
            label: 'System',
            value: 'system' as Appearance,
            icon: <DesktopOutlined />,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={3} style={{ marginBottom: token.marginXS }}>
                            Appearance Settings
                        </Title>
                        <Text type="secondary">
                            Customize how the interface looks and feels to you.
                        </Text>
                    </div>

                    <Card title="Theme Preference" style={{ width: '100%' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Text>Choose your preferred theme for the interface:</Text>
                            <Segmented
                                options={appearanceOptions}
                                value={currentAppearance}
                                onChange={(value) => updateAppearance(value as Appearance)}
                                size="large"
                                style={{ display: 'flex' }}
                            />
                            <Text type="secondary" style={{ fontSize: '14px' }}>
                                {currentAppearance === 'system' 
                                    ? 'Theme will automatically adjust based on your system preferences.'
                                    : currentAppearance === 'light'
                                    ? 'Interface will use a light color scheme.'
                                    : 'Interface will use a dark color scheme.'
                                }
                            </Text>
                        </Space>
                    </Card>
                </Space>
            </SettingsLayout>
        </AppLayout>
    );
}
