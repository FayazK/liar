import { createInertiaApp } from '@inertiajs/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import { queryClient } from './lib/query-client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

interface ThemedAppProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    App: ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: Record<string, any>;
}

// MUJI Theme - Warm earth tones with brick red accent
const mujiLightTheme = {
    // Core colors - brick red accent
    colorPrimary: '#C45C3E', // Bright brick red for primary actions
    colorInfo: '#C45C3E',
    colorSuccess: '#6B8E6B', // Muted sage green
    colorWarning: '#C4A35A', // Warm ochre
    colorError: '#B54040', // Deeper red for errors
    colorLink: '#C45C3E', // Brick red links

    // Primary color backgrounds - 50% lighter brick red
    colorPrimaryBg: '#F0D5CC', // Light terracotta tint
    colorPrimaryBgHover: '#E8C8BD', // Hover - slightly darker terracotta

    // Backgrounds - warm cream paper
    colorBgContainer: '#FAF8F5', // Warm cream for cards
    colorBgElevated: '#FAF8F5',
    colorBgLayout: '#F5F2ED', // Slightly darker cream for page bg
    colorBgSpotlight: '#EDE9E3',

    // Text - warm charcoal tones
    colorText: '#3D3D3D', // Primary text
    colorTextSecondary: '#6B6560', // Secondary text
    colorTextTertiary: '#8A847D', // Muted text
    colorTextQuaternary: '#A8A29D', // Subtle text

    // Borders - warm gray
    colorBorder: '#DDD8D0', // Warm light border
    colorBorderSecondary: '#E8E4DC', // Lighter border

    // Fills
    colorFill: '#E8E4DC',
    colorFillSecondary: '#EDE9E3',
    colorFillTertiary: '#F2EFEA',
    colorFillQuaternary: '#F7F5F1',
};

const mujiDarkTheme = {
    // Core colors - lighter brick for dark mode
    colorPrimary: '#D4715A', // Lighter brick for dark mode visibility
    colorInfo: '#D4715A',
    colorSuccess: '#8BA88B', // Muted sage green
    colorWarning: '#D4B76A', // Warm gold
    colorError: '#C56060', // Lighter red for dark mode
    colorLink: '#D4715A', // Brick red links

    // Primary color backgrounds - darker brick tint for dark mode
    colorPrimaryBg: '#4A3835', // Dark terracotta tint
    colorPrimaryBgHover: '#554540', // Hover - slightly lighter

    // Backgrounds - warm charcoal
    colorBgContainer: '#2D2B28', // Warm dark charcoal for cards
    colorBgElevated: '#2D2B28',
    colorBgLayout: '#1F1E1C', // Deeper warm charcoal for page bg
    colorBgSpotlight: '#383532',

    // Text - warm off-white tones
    colorText: '#E8E2D9', // Primary text
    colorTextSecondary: '#B8B2A8', // Secondary text
    colorTextTertiary: '#8A847D', // Muted text
    colorTextQuaternary: '#6B6560', // Subtle text

    // Borders - warm dark gray
    colorBorder: '#4A4744', // Warm dark border
    colorBorderSecondary: '#3D3B38', // Darker border

    // Fills
    colorFill: '#3D3B38',
    colorFillSecondary: '#4A4744',
    colorFillTertiary: '#383532',
    colorFillQuaternary: '#2D2B28',
};

function ThemedApp({ App, props }: ThemedAppProps) {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const themeTokens = isDark ? mujiDarkTheme : mujiLightTheme;

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        ...themeTokens,
                        // MUJI Layout Philosophy - generous spacing, clean lines
                        borderRadius: 6,
                        borderRadiusLG: 8,
                        borderRadiusSM: 4,
                        borderRadiusXS: 2,

                        // Generous whitespace - MUJI "breathing room"
                        padding: 16,
                        paddingLG: 24,
                        paddingSM: 12,
                        paddingXS: 8,
                        paddingXXS: 4,

                        // Comfortable margins
                        margin: 16,
                        marginLG: 24,
                        marginSM: 12,
                        marginXS: 8,
                        marginXXS: 4,

                        // Clean typography spacing
                        lineHeight: 1.6,
                        lineHeightLG: 1.5,
                        lineHeightSM: 1.5,

                        // Shadow-free design
                        boxShadow: 'none',
                        boxShadowSecondary: 'none',
                        boxShadowTertiary: 'none',

                        // Control sizing - comfortable touch targets
                        controlHeight: 36,
                        controlHeightLG: 44,
                        controlHeightSM: 28,
                    },
                    components: {
                        // Cards - generous padding, subtle borders
                        Card: {
                            paddingLG: 24,
                            boxShadow: 'none',
                            boxShadowSecondary: 'none',
                            boxShadowTertiary: 'none',
                            headerFontSize: 16,
                            headerHeight: 56,
                        },

                        // Buttons - clean, functional
                        Button: {
                            paddingInline: 20,
                            paddingBlock: 8,
                            primaryShadow: 'none',
                            defaultShadow: 'none',
                            dangerShadow: 'none',
                            controlTmpOutline: 'transparent',
                            controlOutline: 'transparent',
                            fontWeight: 500,
                        },

                        // Input fields - comfortable sizing
                        Input: {
                            paddingInline: 14,
                            paddingBlock: 8,
                        },

                        // Select dropdowns
                        Select: {
                            optionPadding: '10px 14px',
                            boxShadowSecondary: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                        },

                        // DatePicker - subtle border (includes TimePicker)
                        DatePicker: {
                            boxShadowSecondary: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                        },

                        // Cascader - subtle border
                        Cascader: {
                            boxShadowSecondary: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                        },

                        // TreeSelect - subtle border
                        TreeSelect: {
                            boxShadowSecondary: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                        },

                        // Tables - clean, readable
                        Table: {
                            headerBg: 'transparent',
                            cellPaddingBlock: 14,
                            cellPaddingInline: 16,
                            headerSplitColor: 'transparent',
                            rowHoverBg: isDark ? '#383532' : '#F5F2ED',
                        },

                        // Lists - generous item spacing
                        List: {
                            itemPadding: '14px 0',
                        },

                        // Tabs - clean, minimal
                        Tabs: {
                            horizontalItemPadding: '14px 20px',
                            horizontalMargin: '0 0 20px 0',
                            cardPadding: '12px 20px',
                            cardGutter: 4,
                        },

                        // Menu - comfortable navigation with visible selections
                        Menu: {
                            itemHeight: 40,
                            itemMarginInline: 8,
                            itemPaddingInline: 16,
                            groupTitleFontSize: 11,
                            groupTitleLineHeight: 1.6,
                            iconMarginInlineEnd: 12,
                            subMenuItemBorderRadius: 6,
                            itemBorderRadius: 6,
                            collapsedIconSize: 18,
                            // 50% lighter primary color for selections
                            itemSelectedBg: isDark ? '#4A3835' : '#F0D5CC',
                            itemHoverBg: isDark ? '#3F3330' : '#ECDAD3',
                            itemActiveBg: isDark ? '#554540' : '#E8C8BD',
                        },

                        // Modal - generous padding
                        Modal: {
                            paddingLG: 28,
                            paddingContentHorizontalLG: 28,
                            headerBg: 'transparent',
                            contentBg: isDark ? '#2D2B28' : '#FAF8F5',
                            boxShadow: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                        },

                        // Drawer - clean panel
                        Drawer: {
                            paddingLG: 24,
                            boxShadow: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                        },

                        // Dropdown - subtle border, no shadow
                        Dropdown: {
                            paddingBlock: 6,
                            boxShadowSecondary: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                            colorBgElevated: isDark ? '#2D2B28' : '#FAF8F5',
                            borderRadiusLG: 8,
                        },

                        // Popover - clean tooltips
                        Popover: {
                            boxShadowSecondary: `0 0 0 1px ${isDark ? mujiDarkTheme.colorBorder : mujiLightTheme.colorBorder}`,
                        },

                        // Tooltip - vibrant, high contrast
                        Tooltip: {
                            colorBgSpotlight: isDark ? '#3D3D3D' : '#3D3D3D',
                            colorTextLightSolid: '#FFFFFF',
                        },

                        // Alert - clean messaging
                        Alert: {
                            defaultPadding: '14px 16px',
                        },

                        // Message - subtle notifications
                        Message: {
                            contentPadding: '12px 20px',
                        },

                        // Notification - clean cards
                        Notification: {
                            paddingLG: 20,
                            paddingContentHorizontalLG: 20,
                        },

                        // Form - comfortable vertical rhythm
                        Form: {
                            itemMarginBottom: 20,
                            verticalLabelPadding: '0 0 10px',
                        },

                        // Divider - subtle separation
                        Divider: {
                            marginLG: 28,
                            textPaddingInline: 16,
                        },

                        // Segmented control - clean toggle
                        Segmented: {
                            itemSelectedBg: isDark ? '#383532' : '#FFFFFF',
                            trackBg: isDark ? '#2D2B28' : '#EDE9E3',
                            trackPadding: 4,
                        },

                        // Tag - subtle labels
                        Tag: {
                            defaultBg: isDark ? '#383532' : '#EDE9E3',
                        },

                        // Badge - minimal indicators
                        Badge: {
                            dotSize: 8,
                        },

                        // Collapse/Accordion - clean panels
                        Collapse: {
                            headerPadding: '14px 16px',
                            contentPadding: '16px',
                        },

                        // Breadcrumb - clean navigation
                        Breadcrumb: {
                            itemColor: isDark ? '#8A847D' : '#8A847D',
                            separatorMargin: 10,
                        },

                        // Pagination - comfortable spacing
                        Pagination: {
                            itemSize: 36,
                            itemSizeSM: 28,
                        },

                        // Steps - clean progress
                        Steps: {
                            iconSize: 32,
                            dotSize: 10,
                        },

                        // Timeline - clean history
                        Timeline: {
                            dotBg: 'transparent',
                            itemPaddingBottom: 24,
                        },

                        // Skeleton - subtle loading
                        Skeleton: {
                            gradientFromColor: isDark ? '#383532' : '#EDE9E3',
                            gradientToColor: isDark ? '#4A4744' : '#F5F2ED',
                        },

                        // Empty state - clean placeholder
                        Empty: {
                            colorTextDescription: isDark ? '#6B6560' : '#8A847D',
                        },

                        // Result - clean feedback
                        Result: {
                            titleFontSize: 22,
                            subtitleFontSize: 14,
                            iconFontSize: 64,
                        },

                        // Layout components - generous spacing
                        Layout: {
                            headerPadding: '0 24px',
                            footerPadding: '20px 24px',
                            siderBg: isDark ? '#1F1E1C' : '#FAF8F5',
                            headerBg: isDark ? '#2D2B28' : '#FAF8F5',
                        },
                    },
                }}
            >
                <AntApp>
                    <App {...props} />
                </AntApp>
            </ConfigProvider>
        </QueryClientProvider>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<ThemedApp App={App} props={props} />);
    },
    progress: {
        color: '#C45C3E', // MUJI brick red
    },
});

// This will set light / dark mode on load...
initializeTheme();
