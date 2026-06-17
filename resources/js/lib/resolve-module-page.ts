import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

type GlobImport = Record<string, () => Promise<unknown>>;

export function resolveModulePage(
    name: string,
    modulePages: GlobImport,
    appPages: GlobImport,
): ReturnType<typeof resolvePageComponent> | Promise<unknown> {
    if (name.includes('::')) {
        const [module, ...rest] = name.split('::');
        const path = rest.join('::');
        const key = `../../Modules/${module}/resources/js/pages/${path}.tsx`;
        if (modulePages[key]) {
            return modulePages[key]();
        }
        throw new Error(`Module page not found: ${name}`);
    }
    return resolvePageComponent(`./pages/${name}.tsx`, appPages);
}
