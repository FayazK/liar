import { createInertiaApp } from '@inertiajs/react';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

interface ThemedAppProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    App: ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: Record<string, any>;
}

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

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
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
                },
            }}
        >
            <AntApp>
                <App {...props} />
            </AntApp>
        </ConfigProvider>
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
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
