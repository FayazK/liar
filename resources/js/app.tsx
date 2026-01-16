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
                        borderRadius: 6,
                        boxShadow: 'none',
                        boxShadowSecondary: 'none',
                        boxShadowTertiary: 'none',
                    },
                    components: {
                        Button: {
                            primaryShadow: 'none',
                            defaultShadow: 'none',
                            dangerShadow: 'none',
                            controlTmpOutline: 'transparent',
                            controlOutline: 'transparent',
                        },
                        Card: {
                            boxShadow: 'none',
                            boxShadowSecondary: 'none',
                            boxShadowTertiary: 'none',
                        },
                        Dropdown: {
                            boxShadowSecondary: 'none',
                        },
                        Modal: {
                            boxShadow: 'none',
                        },
                        Drawer: {
                            boxShadow: 'none',
                        },
                        Popover: {
                            boxShadowSecondary: 'none',
                        },
                        Menu: {
                            itemHeight: 36,
                            itemMarginInline: 4,
                            itemPaddingInline: 8,
                            groupTitleFontSize: 12,
                            groupTitleLineHeight: 1.5,
                            iconMarginInlineEnd: 8,
                            subMenuItemBorderRadius: 6,
                            itemBorderRadius: 6,
                            collapsedIconSize: 18,
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
