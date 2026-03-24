import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => {
            if (name.includes('::')) {
                const [module, ...rest] = name.split('::');
                const path = rest.join('::');
                const modulePages = import.meta.glob<ComponentType>('../../Modules/*/resources/js/pages/**/*.tsx');
                const key = `../../Modules/${module}/resources/js/pages/${path}.tsx`;
                if (modulePages[key]) {
                    return modulePages[key]();
                }
                throw new Error(`Module page not found: ${name}`);
            }
            return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        },
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    }),
);
