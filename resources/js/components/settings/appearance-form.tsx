import { useAppearance, type Appearance } from '@/hooks/use-appearance';
import { BulbFilled, BulbOutlined, DesktopOutlined } from '@ant-design/icons';
import { Card, Segmented, Space, Typography } from 'antd';

const { Text } = Typography;

export default function AppearanceForm() {
    const { appearance: currentAppearance, updateAppearance } = useAppearance();

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
                          : 'Interface will use a dark color scheme.'}
                </Text>
            </Space>
        </Card>
    );
}
