import axios from '@/lib/axios';
import type { Editor } from 'grapesjs';
import { router } from '@inertiajs/react';
import { Button, message, Space, Tooltip, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AiDrawer from '../../../components/ai/AiDrawer';
import AiFloatingToolbar from '../../../components/ai/AiFloatingToolbar';
import GrapesEditor from '../../../components/GrapesEditor';
import SaveAsTemplateModal from '../../../components/SaveAsTemplateModal';
import SectionPanel from '../../../components/SectionPanel';
import StylePresets from '../../../components/StylePresets';
import type { SectionTemplate } from '../../../lib/grapes-blocks';

const { Text } = Typography;

interface Props {
    post: { id: number; title: string; slug: string };
    builderPage: { grapes_data: Record<string, unknown> | null; grapes_css: string | null } | null;
    sectionTemplates: Record<string, SectionTemplate[]>;
}

const AUTO_SAVE_INTERVAL = 30_000;

export default function PageBuilderEditor({ post, builderPage, sectionTemplates }: Props) {
    const editorRef = useRef<Editor | null>(null);
    const isDirty = useRef(false);
    const handleSaveRef = useRef<(() => Promise<void>) | null>(null);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activeDevice, setActiveDevice] = useState('Desktop');
    const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
    const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
    const [templateHtml, setTemplateHtml] = useState('');
    const [templateCss, setTemplateCss] = useState('');
    const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const getEditorData = useCallback((): { grapesData: Record<string, unknown>; grapesCss: string } | null => {
        const editor = editorRef.current;
        if (!editor) return null;
        return {
            grapesData: {
                components: editor.getComponents(),
                styles: editor.getStyle(),
            },
            grapesCss: editor.getCss() ?? '',
        };
    }, []);

    const handleSave = useCallback(async (): Promise<void> => {
        const data = getEditorData();
        if (!data) return;

        setSaving(true);
        try {
            await axios.put(`/admin/page-builder/${post.id}`, {
                grapes_data: data.grapesData,
                grapes_css: data.grapesCss,
            });
            isDirty.current = false;
        } catch {
            message.error('Failed to save');
        } finally {
            setSaving(false);
        }
    }, [post.id, getEditorData]);

    // Keep ref in sync for stable interval callback
    handleSaveRef.current = handleSave;

    const handlePublish = async (): Promise<void> => {
        await handleSave();

        setPublishing(true);
        try {
            await axios.post(`/admin/page-builder/${post.id}/publish`);
            message.success('Published');
        } catch {
            message.error('Failed to publish');
        } finally {
            setPublishing(false);
        }
    };

    const handleUndo = (): void => {
        editorRef.current?.UndoManager.undo();
    };

    const handleRedo = (): void => {
        editorRef.current?.UndoManager.redo();
    };

    const setDevice = (device: string): void => {
        setActiveDevice(device);
        editorRef.current?.runCommand(`set-device-${device.toLowerCase()}`);
    };

    const handleEditorReady = (editor: Editor): void => {
        editorRef.current = editor;
        editor.on('update', () => {
            isDirty.current = true;
        });
    };

    const handleSectionInsert = (template: SectionTemplate): void => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.addComponents(template.html_template);
        if (template.css_template) {
            editor.addStyle(template.css_template);
        }
    };

    const handleStylePreset = (property: string, value: string): void => {
        const editor = editorRef.current;
        if (!editor) return;
        const selected = editor.getSelected();
        if (selected) {
            selected.addStyle({ [property]: value });
        } else {
            message.info('Select a component first');
        }
    };

    const handleSaveAsTemplate = (): void => {
        const editor = editorRef.current;
        if (!editor) return;

        const selected = editor.getSelected();
        const html = selected ? selected.toHTML() : (editor.getHtml() ?? '');
        const css = editor.getCss() ?? '';

        setTemplateHtml(html);
        setTemplateCss(css);
        setSaveTemplateOpen(true);
    };

    // Auto-save only when dirty, with stable ref to avoid interval restarts
    useEffect(() => {
        autoSaveTimer.current = setInterval(() => {
            if (isDirty.current) {
                void handleSaveRef.current?.();
            }
        }, AUTO_SAVE_INTERVAL);

        return () => {
            if (autoSaveTimer.current) {
                clearInterval(autoSaveTimer.current);
            }
        };
    }, []);

    const devices: Array<{ key: string; label: string }> = [
        { key: 'Desktop', label: 'Desktop' },
        { key: 'Tablet', label: 'Tablet' },
        { key: 'Mobile', label: 'Mobile' },
    ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div
                style={{
                    height: 48,
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 12px',
                    backgroundColor: '#fff',
                    flexShrink: 0,
                }}
            >
                <Space>
                    <Button type="text" size="small" onClick={() => router.visit('/admin/page-builder')}>
                        &larr; Back
                    </Button>
                    <Text strong style={{ fontSize: 14 }}>{post.title}</Text>
                </Space>

                <Space>
                    <Tooltip title="Undo">
                        <Button type="text" size="small" onClick={handleUndo}>
                            Undo
                        </Button>
                    </Tooltip>
                    <Tooltip title="Redo">
                        <Button type="text" size="small" onClick={handleRedo}>
                            Redo
                        </Button>
                    </Tooltip>
                    <Space.Compact size="small">
                        {devices.map((d) => (
                            <Button
                                key={d.key}
                                type={activeDevice === d.key ? 'primary' : 'default'}
                                size="small"
                                onClick={() => setDevice(d.key)}
                            >
                                {d.label}
                            </Button>
                        ))}
                    </Space.Compact>
                    <Button
                        type={aiDrawerOpen ? 'primary' : 'default'}
                        size="small"
                        onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
                    >
                        AI
                    </Button>
                </Space>

                <Space>
                    <Button size="small" onClick={handleSaveAsTemplate}>
                        Save as Template
                    </Button>
                    <Button size="small" onClick={() => void handleSave()} loading={saving}>
                        Save
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => void handlePublish()}
                        loading={publishing}
                    >
                        Publish
                    </Button>
                </Space>
            </div>

            {/* Main area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left sidebar - Section Panel */}
                <div
                    style={{
                        width: 240,
                        borderRight: '1px solid #e5e7eb',
                        backgroundColor: '#fafafa',
                        flexShrink: 0,
                        overflowY: 'auto',
                    }}
                >
                    <SectionPanel templates={sectionTemplates} onInsert={handleSectionInsert} />
                </div>

                {/* GrapesJS Canvas */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <AiFloatingToolbar editor={editorRef.current} />
                    <GrapesEditor
                        initialData={builderPage ?? undefined}
                        sectionTemplates={sectionTemplates}
                        onSave={() => void handleSave()}
                        onEditorReady={handleEditorReady}
                    />
                </div>

                {/* Right sidebar - Style Presets (hidden when AI drawer is open) */}
                {!aiDrawerOpen && (
                    <div
                        style={{
                            width: 220,
                            borderLeft: '1px solid #e5e7eb',
                            backgroundColor: '#fafafa',
                            flexShrink: 0,
                            overflowY: 'auto',
                        }}
                    >
                        <StylePresets onApply={handleStylePreset} />
                    </div>
                )}

                <AiDrawer
                    open={aiDrawerOpen}
                    onClose={() => setAiDrawerOpen(false)}
                    editor={editorRef.current}
                />
            </div>

            <SaveAsTemplateModal
                open={saveTemplateOpen}
                onClose={() => setSaveTemplateOpen(false)}
                html={templateHtml}
                css={templateCss}
                categories={Object.keys(sectionTemplates)}
            />
        </div>
    );
}

PageBuilderEditor.layout = (page: React.ReactNode) => page;
