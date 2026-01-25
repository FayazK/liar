import { Icon } from '@/components/ui/Icon';
import { Flex, theme } from 'antd';
import type { ContentHeaderCenterProps } from './types';

const { useToken } = theme;

/**
 * Center section of ContentHeader containing:
 * - Info tabs displaying related metrics/navigation
 * - Hidden on mobile (responsive)
 */
export default function ContentHeaderCenter({ infoTabs }: ContentHeaderCenterProps) {
    const { token } = useToken();

    if (!infoTabs || infoTabs.length === 0) {
        return null;
    }

    return (
        <Flex
            align="center"
            gap={token.marginXS}
            style={{
                display: 'none',
            }}
            className="content-header-center"
        >
            {infoTabs.map((tab) => (
                <Flex
                    key={tab.key}
                    align="center"
                    gap={6}
                    onClick={tab.onClick}
                    style={{
                        padding: `${token.paddingXXS}px ${token.paddingSM}px`,
                        borderRadius: token.borderRadiusSM,
                        backgroundColor: token.colorBgTextHover,
                        cursor: tab.onClick ? 'pointer' : 'default',
                        transition: 'background-color 0.2s',
                        fontSize: 12,
                    }}
                    onMouseEnter={(e) => {
                        if (tab.onClick) {
                            e.currentTarget.style.backgroundColor = token.colorBgTextActive;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = token.colorBgTextHover;
                    }}
                    role={tab.onClick ? 'button' : undefined}
                    tabIndex={tab.onClick ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (tab.onClick && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            tab.onClick();
                        }
                    }}
                >
                    {tab.icon && <Icon name={tab.icon} size={14} color={token.colorTextSecondary} />}
                    <span style={{ color: token.colorTextSecondary }}>{tab.label}</span>
                    {tab.value !== undefined && (
                        <span style={{ color: token.colorText, fontWeight: 500 }}>{tab.value}</span>
                    )}
                </Flex>
            ))}

            {/* CSS for responsive behavior - hide on mobile */}
            <style>{`
                @media (min-width: 768px) {
                    .content-header-center {
                        display: flex !important;
                    }
                }
            `}</style>
        </Flex>
    );
}
