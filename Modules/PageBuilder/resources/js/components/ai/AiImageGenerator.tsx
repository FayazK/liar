import { Button, Image as AntImage, Segmented, Typography, message } from 'antd';
import type { Editor } from 'grapesjs';
import { useCallback, useState } from 'react';
import { postJson } from '../../lib/ai-api';
import type { AiImageResult } from '../../lib/ai-types';
import AiPromptInput from './AiPromptInput';

const { Text } = Typography;

interface AiImageGeneratorProps {
    editor: Editor | null;
}

export default function AiImageGenerator({ editor }: AiImageGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [aspect, setAspect] = useState<string>('landscape');
    const [result, setResult] = useState<{ url: string; alt: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const response = await postJson<AiImageResult>(
                '/admin/page-builder/ai/image',
                { prompt: prompt.trim(), aspect },
            );
            if (response.data) {
                setResult(response.data);
            }
        } catch {
            void message.error('Failed to generate image');
        } finally {
            setLoading(false);
        }
    }, [prompt, aspect]);

    const handleInsert = useCallback(() => {
        if (!editor || !result) return;

        const selected = editor.getSelected();
        if (selected && selected.get('type') === 'image') {
            // Replace existing image
            selected.set('src', result.url);
            selected.addAttributes({ alt: result.alt });
            void message.success('Image replaced');
        } else {
            // Insert new image component
            editor.addComponents({
                type: 'image',
                attributes: { src: result.url, alt: result.alt },
                style: { 'max-width': '100%', height: 'auto' },
            });
            void message.success('Image inserted');
        }

        // Add to asset manager for reuse
        editor.AssetManager?.add({ src: result.url, name: result.alt });
    }, [editor, result]);

    return (
        <div style={{ padding: '12px 0' }}>
            <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    Aspect ratio
                </Text>
                <Segmented
                    value={aspect}
                    onChange={(v) => setAspect(v as string)}
                    options={[
                        { label: 'Landscape', value: 'landscape' },
                        { label: 'Portrait', value: 'portrait' },
                        { label: 'Square', value: 'square' },
                    ]}
                    size="small"
                    block
                />
            </div>

            <AiPromptInput
                value={prompt}
                onChange={setPrompt}
                onSubmit={() => void handleGenerate()}
                isGenerating={loading}
                placeholder="Describe the image you want..."
                submitLabel="Generate Image"
            />

            {result && (
                <div style={{ marginTop: 12 }}>
                    <AntImage
                        src={result.url}
                        alt={result.alt}
                        style={{ width: '100%', borderRadius: 4 }}
                        preview={false}
                    />
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                        <Button type="primary" size="small" block onClick={handleInsert}>
                            Insert Image
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
