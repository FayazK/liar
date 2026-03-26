import { Button, Modal, Spin, Typography, message } from 'antd';
import type { Editor } from 'grapesjs';
import { useCallback, useState } from 'react';
import { postJson } from '../../lib/ai-api';
import type { AiPageSection } from '../../lib/ai-types';
import AiPromptInput from './AiPromptInput';

const { Text } = Typography;

interface PageResponse {
    success: boolean;
    data: { sections: AiPageSection[] };
}

interface AiPageGeneratorProps {
    editor: Editor | null;
}

export default function AiPageGenerator({ editor }: AiPageGeneratorProps): React.ReactElement {
    const [prompt, setPrompt] = useState('');
    const [sections, setSections] = useState<AiPageSection[]>([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setSections([]);
        try {
            const response = await postJson<PageResponse>('/admin/page-builder/ai/page', {
                prompt: prompt.trim(),
            });
            setSections(response.data.sections ?? []);
        } catch {
            message.error('Failed to generate page');
        } finally {
            setLoading(false);
        }
    }, [prompt]);

    const handleApply = useCallback(() => {
        if (!editor || sections.length === 0) return;

        Modal.confirm({
            title: 'Replace Canvas Content',
            content:
                'This will replace all current content on the canvas. Make sure to save your work first.',
            okText: 'Apply',
            okType: 'danger',
            onOk: () => {
                const combinedHtml = sections.map((s) => s.html).join('\n');
                const combinedCss = sections
                    .map((s) => s.css)
                    .filter(Boolean)
                    .join('\n');

                editor.setComponents(combinedHtml);
                if (combinedCss) {
                    editor.setStyle(combinedCss);
                }
                message.success('Page applied to canvas');
                setSections([]);
                setPrompt('');
            },
        });
    }, [editor, sections]);

    return (
        <div style={{ padding: '12px 0' }}>
            <AiPromptInput
                value={prompt}
                onChange={setPrompt}
                onSubmit={() => void handleGenerate()}
                isGenerating={loading}
                placeholder="Describe the page you want to create..."
                submitLabel="Generate Page"
            />

            {loading && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Spin />
                    <Text
                        type="secondary"
                        style={{ display: 'block', marginTop: 8, fontSize: 13 }}
                    >
                        Generating page sections...
                    </Text>
                </div>
            )}

            {sections.length > 0 && !loading && (
                <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Generated {sections.length} sections:
                    </Text>
                    <div
                        style={{
                            margin: '8px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        {sections.map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    background: '#f5f5f5',
                                    padding: '6px 10px',
                                    borderRadius: 4,
                                    fontSize: 13,
                                }}
                            >
                                {i + 1}. {s.category}
                            </div>
                        ))}
                    </div>
                    <Button type="primary" size="small" block onClick={handleApply}>
                        Apply to Canvas
                    </Button>
                </div>
            )}
        </div>
    );
}
