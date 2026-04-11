import { Select, Space, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface StylePresetsProps {
    onApply: (property: string, value: string) => void;
}

const backgroundOptions = [
    { value: '', label: 'Default' },
    { value: '#ffffff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#1a1a2e', label: 'Dark' },
    { value: '#e94560', label: 'Accent Red' },
    { value: '#0f3460', label: 'Navy' },
];

const spacingOptions = [
    { value: '1rem', label: 'Tight' },
    { value: '2rem', label: 'Compact' },
    { value: '4rem', label: 'Normal' },
    { value: '6rem', label: 'Spacious' },
    { value: '8rem', label: 'Extra Spacious' },
];

const fontSizeOptions = [
    { value: '0.875rem', label: 'Small' },
    { value: '1rem', label: 'Base' },
    { value: '1.125rem', label: 'Medium' },
    { value: '1.25rem', label: 'Large' },
    { value: '1.5rem', label: 'Extra Large' },
];

const borderRadiusOptions = [
    { value: '0', label: 'None' },
    { value: '4px', label: 'Small' },
    { value: '8px', label: 'Medium' },
    { value: '12px', label: 'Large' },
    { value: '9999px', label: 'Pill' },
];

export default function StylePresets({ onApply }: StylePresetsProps): React.ReactElement {
    return (
        <div style={{ padding: 12, height: '100%', overflowY: 'auto' }}>
            <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
                Style Presets
            </Text>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Background Color
                    </Text>
                    <Select
                        options={backgroundOptions}
                        placeholder="Select color"
                        style={{ width: '100%' }}
                        size="small"
                        onChange={(value: string) => onApply('background-color', value)}
                    />
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Spacing (Padding)
                    </Text>
                    <Select
                        options={spacingOptions}
                        placeholder="Select spacing"
                        style={{ width: '100%' }}
                        size="small"
                        onChange={(value: string) => onApply('padding', value)}
                    />
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Font Size
                    </Text>
                    <Select
                        options={fontSizeOptions}
                        placeholder="Select size"
                        style={{ width: '100%' }}
                        size="small"
                        onChange={(value: string) => onApply('font-size', value)}
                    />
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Border Radius
                    </Text>
                    <Select
                        options={borderRadiusOptions}
                        placeholder="Select radius"
                        style={{ width: '100%' }}
                        size="small"
                        onChange={(value: string) => onApply('border-radius', value)}
                    />
                </div>
            </Space>
        </div>
    );
}
