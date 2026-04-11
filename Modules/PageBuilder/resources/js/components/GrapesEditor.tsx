import React, { useEffect, useRef } from 'react';
import type { Editor } from 'grapesjs';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { createGrapesConfig } from '../lib/grapes-config';
import { registerSectionBlocks, type SectionTemplate } from '../lib/grapes-blocks';
import { devicePreviewPlugin, stylePresetsPlugin } from '../lib/grapes-plugins';

interface GrapesEditorProps {
    initialData?: {
        grapes_data: Record<string, unknown> | null;
        grapes_css: string | null;
    };
    sectionTemplates: Record<string, SectionTemplate[]>;
    onSave: (data: { grapesData: Record<string, unknown>; grapesCss: string }) => void;
    onEditorReady?: (editor: Editor) => void;
}

export default function GrapesEditor({
    initialData,
    sectionTemplates,
    onSave,
    onEditorReady,
}: GrapesEditorProps): React.ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Editor | null>(null);
    const onSaveRef = useRef(onSave);
    const onEditorReadyRef = useRef(onEditorReady);
    const sectionTemplatesRef = useRef(sectionTemplates);
    const initialDataRef = useRef(initialData);

    onSaveRef.current = onSave;
    onEditorReadyRef.current = onEditorReady;
    sectionTemplatesRef.current = sectionTemplates;
    initialDataRef.current = initialData;

    useEffect(() => {
        if (!containerRef.current || editorRef.current) return;

        const config = createGrapesConfig({
            container: containerRef.current,
        });

        const editor = grapesjs.init({
            ...config,
            plugins: [stylePresetsPlugin, devicePreviewPlugin],
        });

        const data = initialDataRef.current?.grapes_data;
        if (data) {
            if (data.components) {
                editor.setComponents(data.components as string);
            }
            if (data.styles) {
                editor.setStyle(data.styles as string);
            }
        }

        registerSectionBlocks(editor, sectionTemplatesRef.current);

        editor.on('storage:store', () => {
            const components = editor.getComponents();
            const styles = editor.getStyle();
            onSaveRef.current({
                grapesData: { components: components as unknown as Record<string, unknown>, styles: styles as unknown as Record<string, unknown> },
                grapesCss: editor.getCss() ?? '',
            });
        });

        editorRef.current = editor;

        if (onEditorReadyRef.current) {
            onEditorReadyRef.current(editor);
        }

        return () => {
            editor.destroy();
            editorRef.current = null;
        };
    }, []);

    return <div ref={containerRef} style={{ height: '100%' }} />;
}
