import { Icon, type IconName } from '@/components/ui/Icon';
import { useAppearance, type Appearance } from '@/hooks/use-appearance';
import { Space, theme, Typography } from 'antd';

const { Text, Title } = Typography;
const { useToken } = theme;

interface ThemeOptionProps {
    value: Appearance;
    label: string;
    icon: IconName;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

function ThemeOption({ label, icon, description, isSelected, onClick }: ThemeOptionProps) {
    const { token } = useToken();

    return (
        <div
            onClick={onClick}
            style={{
                flex: 1,
                padding: token.paddingMD,
                borderRadius: token.borderRadiusLG,
                border: `2px solid ${isSelected ? token.colorPrimary : token.colorBorderSecondary}`,
                background: isSelected ? token.colorPrimaryBg : token.colorBgContainer,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: token.borderRadius,
                    background: isSelected ? token.colorPrimary : token.colorFillSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: token.marginSM,
                }}
            >
                <Icon name={icon} size={24} color={isSelected ? '#fff' : token.colorTextSecondary} />
            </div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>
                {label}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
                {description}
            </Text>
        </div>
    );
}

export default function AppearanceForm() {
    const { token } = useToken();
    const { appearance: currentAppearance, updateAppearance } = useAppearance();

    const themeOptions: { value: Appearance; label: string; icon: IconName; description: string }[] = [
        {
            value: 'light',
            label: 'Light',
            icon: 'sun',
            description: 'Bright and clean',
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: 'moon',
            description: 'Easy on the eyes',
        },
        {
            value: 'system',
            label: 'System',
            icon: 'device-desktop',
            description: 'Match your device',
        },
    ];

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={4} style={{ marginBottom: token.marginXS }}>
                    Appearance
                </Title>
                <Text type="secondary">Customize how the app looks</Text>
            </div>

            <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: token.marginSM, fontSize: 13 }}>
                    Theme
                </Text>
                <div style={{ display: 'flex', gap: token.marginMD }}>
                    {themeOptions.map((option) => (
                        <ThemeOption
                            key={option.value}
                            {...option}
                            isSelected={currentAppearance === option.value}
                            onClick={() => updateAppearance(option.value)}
                        />
                    ))}
                </div>
            </div>
        </Space>
    );
}
