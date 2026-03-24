import React, { useEffect, useRef, useState } from 'react';
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
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!containerRef.current || editorRef.current) return;

        const config = createGrapesConfig({
            container: containerRef.current,
        });

        const editor = grapesjs.init({
            ...config,
            plugins: [stylePresetsPlugin, devicePreviewPlugin],
        });

        if (initialData?.grapes_data) {
            const data = initialData.grapes_data;
            if (data.components) {
                editor.setComponents(data.components as string);
            }
            if (data.styles) {
                editor.setStyle(data.styles as string);
            }
        }

        registerSectionBlocks(editor, sectionTemplates);

        editorRef.current = editor;
        setIsReady(true);

        if (onEditorReady) {
            onEditorReady(editor);
        }

        return () => {
            editor.destroy();
            editorRef.current = null;
        };
    }, []);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div ref={containerRef} style={{ flex: 1 }} />
        </div>
    );
}
