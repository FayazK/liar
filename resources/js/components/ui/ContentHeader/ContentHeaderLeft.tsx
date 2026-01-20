import { Icon } from '@/components/ui/Icon';
import { Link } from '@inertiajs/react';
import { Button, Flex, theme, Tooltip } from 'antd';
import type { ContentHeaderLeftProps } from './types';

const { useToken } = theme;

/**
 * Left section of ContentHeader containing:
 * - Primary action button
 * - Breadcrumb navigation
 * - Optional action icons
 */
export default function ContentHeaderLeft({ primaryAction, breadcrumb, actionIcons }: ContentHeaderLeftProps) {
    const { token } = useToken();

    const hasContent = primaryAction || (breadcrumb && breadcrumb.length > 0) || (actionIcons && actionIcons.length > 0);

    if (!hasContent) {
        return null;
    }

    return (
        <Flex align="center" gap={token.marginSM} style={{ flex: 1, minWidth: 0 }}>
            {/* Primary Action Button */}
            {primaryAction && (
                <Button
                    type="primary"
                    icon={primaryAction.icon ? <Icon name={primaryAction.icon} size={14} /> : undefined}
                    onClick={primaryAction.onClick}
                    loading={primaryAction.loading}
                    disabled={primaryAction.disabled}
                    size="small"
                >
                    {primaryAction.label}
                </Button>
            )}

            {/* Breadcrumb */}
            {breadcrumb && breadcrumb.length > 0 && (
                <Flex
                    align="center"
                    gap={4}
                    style={{
                        fontSize: 13,
                        minWidth: 0,
                        overflow: 'hidden',
                    }}
                >
                    {breadcrumb.map((item, index) => {
                        const isLast = index === breadcrumb.length - 1;

                        return (
                            <Flex key={item.href} align="center" gap={4} style={{ minWidth: 0 }}>
                                {index > 0 && (
                                    <span style={{ color: token.colorTextQuaternary, flexShrink: 0 }}>/</span>
                                )}
                                {isLast ? (
                                    <span
                                        style={{
                                            color: token.colorText,
                                            fontWeight: 500,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {item.title}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        style={{
                                            color: token.colorTextSecondary,
                                            textDecoration: 'none',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </Flex>
                        );
                    })}
                </Flex>
            )}

            {/* Action Icons */}
            {actionIcons && actionIcons.length > 0 && (
                <Flex align="center" gap={2} style={{ marginLeft: token.marginXS }}>
                    {actionIcons.map((action, index) => {
                        const button = (
                            <Button
                                key={index}
                                type="text"
                                size="small"
                                icon={<Icon name={action.icon} size={14} />}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                aria-label={action.tooltip}
                                style={{ color: token.colorTextSecondary }}
                            />
                        );

                        if (action.tooltip) {
                            return (
                                <Tooltip key={index} title={action.tooltip}>
                                    {button}
                                </Tooltip>
                            );
                        }

                        return button;
                    })}
                </Flex>
            )}
        </Flex>
    );
}
