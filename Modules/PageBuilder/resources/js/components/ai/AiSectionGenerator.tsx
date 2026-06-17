import { Button, Select, Typography, message } from 'antd';
import type { Editor } from 'grapesjs';
import { useCallback, useState } from 'react';
import { useAiGeneration } from '../../hooks/useAiGeneration';
import AiPromptInput from './AiPromptInput';

const { Text } = Typography;

const CATEGORIES = [
    { label: 'Any', value: '' },
    { label: 'Hero', value: 'hero' },
    { label: 'Features', value: 'features' },
    { label: 'Pricing', value: 'pricing' },
    { label: 'Testimonials', value: 'testimonials' },
    { label: 'CTA', value: 'cta' },
    { label: 'Content', value: 'content' },
    { label: 'Gallery', value: 'gallery' },
    { label: 'Team', value: 'team' },
    { label: 'Contact', value: 'contact' },
    { label: 'Footer', value: 'footer' },
    { label: 'Header', value: 'header' },
    { label: 'Stats', value: 'stats' },
];

interface AiSectionGeneratorProps {
    editor: Editor | null;
}

export default function AiSectionGenerator({ editor }: AiSectionGeneratorProps): React.ReactElement {
    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState('');
    const { generate, result, isGenerating, error, abort, reset } = useAiGeneration();

    const handleGenerate = useCallback((): void => {
        if (!prompt.trim()) return;
        generate('/admin/page-builder/ai/section', {
            prompt: prompt.trim(),
            category: category || undefined,
        });
    }, [prompt, category, generate]);

    const handleInsert = useCallback((): void => {
        if (!editor || !result) return;
        try {
            const parsed: { html?: string; css?: string } = JSON.parse(result);
            if (parsed.html) {
                editor.addComponents(parsed.html);
            }
            if (parsed.css) {
                editor.addStyle(parsed.css);
            }
            message.success('Section inserted');
            reset();
            setPrompt('');
        } catch {
            message.error('Failed to parse generated content');
        }
    }, [editor, result, reset]);

    return (
        <div style={{ padding: '12px 0' }}>
            <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Category (optional)
                </Text>
                <Select
                    value={category}
                    onChange={setCategory}
                    options={CATEGORIES}
                    style={{ width: '100%', marginTop: 4 }}
                    size="small"
                />
            </div>

            <AiPromptInput
                value={prompt}
                onChange={setPrompt}
                onSubmit={handleGenerate}
                onAbort={abort}
                isGenerating={isGenerating}
                placeholder="Describe the section you want..."
                submitLabel="Generate Section"
            />

            {error && (
                <div style={{ marginTop: 8 }}>
                    <Text type="danger" style={{ fontSize: 12 }}>
                        {error}
                    </Text>
                </div>
            )}

            {result && !isGenerating && (
                <div style={{ marginTop: 12 }}>
                    <Button type="primary" size="small" block onClick={handleInsert}>
                        Insert into Page
                    </Button>
                </div>
            )}
        </div>
    );
}
