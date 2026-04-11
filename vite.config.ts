import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, readdirSync } from 'fs';
import laravel from 'laravel-vite-plugin';
import { join } from 'path';
import { defineConfig } from 'vite';

function getEnabledModuleEntries(): string[] {
    const statusFile = './modules_statuses.json';
    if (!existsSync(statusFile)) return [];

    const statuses: Record<string, boolean> = JSON.parse(readFileSync(statusFile, 'utf-8'));
    const modulesDir = './Modules';
    if (!existsSync(modulesDir)) return [];

    return readdirSync(modulesDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && statuses[dirent.name] === true)
        .map((dirent) => join('Modules', dirent.name, 'resources/js/app.tsx'))
        .filter((entry) => existsSync(entry));
}

const moduleEntries = getEnabledModuleEntries();

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
                'resources/css/front.css',
                'resources/js/front.js',
                ...moduleEntries,
            ],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@modules': '/Modules',
        },
    },
});
