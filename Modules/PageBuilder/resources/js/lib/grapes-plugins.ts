import type { Editor } from 'grapesjs';

export function stylePresetsPlugin(editor: Editor): void {
    editor.TraitManager.addType('preset-colors', {
        createInput() {
            const el = document.createElement('select');
            const options = [
                { value: '', label: 'Default' },
                { value: '#1a1a2e', label: 'Dark' },
                { value: '#ffffff', label: 'Light' },
                { value: '#f8f9fa', label: 'Gray' },
                { value: '#e94560', label: 'Accent' },
            ];
            options.forEach((opt) => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                el.appendChild(option);
            });
            return el;
        },
    });

    editor.TraitManager.addType('preset-spacing', {
        createInput() {
            const el = document.createElement('select');
            const options = [
                { value: '2rem', label: 'Compact' },
                { value: '4rem', label: 'Normal' },
                { value: '6rem', label: 'Spacious' },
            ];
            options.forEach((opt) => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                el.appendChild(option);
            });
            return el;
        },
    });
}

export function devicePreviewPlugin(editor: Editor): void {
    editor.Commands.add('set-device-desktop', {
        run: (e) => e.setDevice('Desktop'),
    });
    editor.Commands.add('set-device-tablet', {
        run: (e) => e.setDevice('Tablet'),
    });
    editor.Commands.add('set-device-mobile', {
        run: (e) => e.setDevice('Mobile'),
    });
}
