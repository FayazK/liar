import { Flex, theme, Typography } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

const { useToken } = theme;
const { Title, Text } = Typography;

/**
 * Padding size options using Ant Design token scales
 */
type PaddingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Header configuration for PageCard
 */
interface PageCardHeader {
    /** Title displayed on the left side of the header */
    title: ReactNode;
    /** Optional subtitle below the title */
    subtitle?: ReactNode;
    /** Actions displayed on the right side (buttons, dropdowns, etc.) */
    actions?: ReactNode;
    /** Whether to show a bottom divider/border. Default: true */
    divider?: boolean;
    /** Custom padding for header section. Default: 'lg' */
    padding?: PaddingSize;
}

/**
 * Footer configuration for PageCard
 */
interface PageCardFooter {
    /** Content displayed on the left side (e.g., pagination info) */
    left?: ReactNode;
    /** Actions/content displayed on the right side (e.g., pagination controls) */
    right?: ReactNode;
    /** Whether to show a top divider/border. Default: true */
    divider?: boolean;
    /** Custom padding for footer section. Default: 'md' */
    padding?: PaddingSize;
}

/**
 * Props for the PageCard component
 */
interface PageCardProps {
    /** Card content */
    children: ReactNode;
    /** Optional header configuration */
    header?: PageCardHeader;
    /** Optional footer configuration */
    footer?: PageCardFooter;
    /** Padding for the body section. Default: 'lg' */
    bodyPadding?: PaddingSize;
    /** Whether to show a border around the card. Default: true */
    bordered?: boolean;
    /** Additional custom styles for the card container */
    style?: CSSProperties;
    /** Additional CSS class name */
    className?: string;
}

/**
 * Maps padding size to Ant Design token values
 */
function getPaddingValue(size: PaddingSize, token: ReturnType<typeof useToken>['token']): number {
    const paddingMap: Record<PaddingSize, number> = {
        none: 0,
        xs: token.paddingXS,
        sm: token.paddingSM,
        md: token.paddingMD,
        lg: token.paddingLG,
        xl: token.paddingXL,
    };
    return paddingMap[size];
}

/**
 * A card component for wrapping main page content with optional header and footer.
 *
 * Features:
 * - Header with title on left and actions on right
 * - Footer with left and right content slots
 * - Configurable padding for header, body, and footer
 * - Theme-aware styling using Ant Design tokens
 * - Shadow-free design per UX guidelines
 */
export default function PageCard({
    children,
    header,
    footer,
    bodyPadding = 'lg',
    bordered = true,
    style,
    className,
}: PageCardProps) {
    const { token } = useToken();

    // Container styles - shadow-free per UX rules
    const containerStyles: CSSProperties = {
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        ...(bordered && { border: `1px solid ${token.colorBorderSecondary}` }),
        overflow: 'hidden',
        ...style,
    };

    // Header section
    const renderHeader = () => {
        if (!header) {
            return null;
        }

        const headerPadding = getPaddingValue(header.padding ?? 'lg', token);
        const showDivider = header.divider !== false;

        return (
            <Flex
                justify="space-between"
                align="center"
                style={{
                    padding: headerPadding,
                    ...(showDivider && {
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    }),
                }}
            >
                <div>
                    {typeof header.title === 'string' ? (
                        <Title level={4} style={{ margin: 0 }}>
                            {header.title}
                        </Title>
                    ) : (
                        header.title
                    )}
                    {header.subtitle && (
                        <Text type="secondary" style={{ display: 'block', marginTop: token.marginXXS }}>
                            {header.subtitle}
                        </Text>
                    )}
                </div>
                {header.actions && <div>{header.actions}</div>}
            </Flex>
        );
    };

    // Footer section
    const renderFooter = () => {
        if (!footer) {
            return null;
        }

        const footerPadding = getPaddingValue(footer.padding ?? 'md', token);
        const showDivider = footer.divider !== false;

        return (
            <Flex
                justify="space-between"
                align="center"
                style={{
                    padding: footerPadding,
                    ...(showDivider && {
                        borderTop: `1px solid ${token.colorBorderSecondary}`,
                    }),
                }}
            >
                {footer.left && <div>{footer.left}</div>}
                {footer.right && <div>{footer.right}</div>}
            </Flex>
        );
    };

    // Body section
    const bodyPaddingValue = getPaddingValue(bodyPadding, token);

    return (
        <div style={containerStyles} className={className}>
            {renderHeader()}
            <div style={{ padding: bodyPaddingValue }}>{children}</div>
            {renderFooter()}
        </div>
    );
}

export type { PageCardProps, PageCardHeader, PageCardFooter, PaddingSize };
