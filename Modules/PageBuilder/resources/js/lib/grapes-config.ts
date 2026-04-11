import type { EditorConfig } from 'grapesjs';

export interface PageBuilderConfig {
    container: HTMLElement;
    autoSaveUrl?: string;
    autoSaveInterval?: number;
}

export function createGrapesConfig(config: PageBuilderConfig): EditorConfig {
    return {
        container: config.container,
        height: '100%',
        width: 'auto',
        fromElement: false,
        storageManager: false,
        canvas: {
            styles: [
                'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            ],
        },
        deviceManager: {
            devices: [
                { name: 'Desktop', width: '' },
                { name: 'Tablet', width: '768px', widthMedia: '768px' },
                { name: 'Mobile', width: '375px', widthMedia: '375px' },
            ],
        },
        panels: { defaults: [] },
        blockManager: { appendTo: undefined },
        styleManager: { appendTo: undefined },
        layerManager: { appendTo: undefined },
    };
}
