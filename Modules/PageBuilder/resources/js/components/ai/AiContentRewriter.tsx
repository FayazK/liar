import { Button, Typography, message } from 'antd';
import type { Editor } from 'grapesjs';
import { useCallback, useState } from 'react';
import { useAiGeneration } from '../../hooks/useAiGeneration';
import { useSelectedText } from '../../hooks/useSelectedText';
import AiPromptInput from './AiPromptInput';

const { Text, Paragraph } = Typography;

interface AiContentRewriterProps {
    editor: Editor | null;
}

export default function AiContentRewriter({ editor }: AiContentRewriterProps): React.ReactElement {
    const { text: selectedText, range } = useSelectedText(editor);
    const { generate, result, isGenerating, error, abort, reset } = useAiGeneration();
    const [instruction, setInstruction] = useState('');

    const handleRewrite = useCallback(() => {
        if (!selectedText || !instruction.trim()) return;
        generate('/admin/page-builder/ai/rewrite', {
            original_text: selectedText,
            instruction: instruction.trim(),
        });
    }, [selectedText, instruction, generate]);

    const handleApply = useCallback(() => {
        if (!result || !range || !editor) return;
        try {
            const parsed = JSON.parse(result) as { text?: string };
            if (parsed.text) {
                const canvasDoc = editor.Canvas?.getDocument();
                if (canvasDoc) {
                    const selection = canvasDoc.getSelection();
                    if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                        canvasDoc.execCommand('insertText', false, parsed.text);
                    }
                }
                message.success('Text replaced');
                reset();
                setInstruction('');
            }
        } catch {
            message.error('Failed to apply rewritten text');
        }
    }, [result, range, editor, reset]);

    return (
        <div style={{ padding: '12px 0' }}>
            {selectedText ? (
                <>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Selected text:
                    </Text>
                    <Paragraph
                        ellipsis={{ rows: 3 }}
                        style={{
                            fontSize: 13,
                            background: '#f5f5f5',
                            padding: 8,
                            borderRadius: 4,
                            marginBottom: 12,
                        }}
                    >
                        {selectedText}
                    </Paragraph>

                    <AiPromptInput
                        value={instruction}
                        onChange={setInstruction}
                        onSubmit={handleRewrite}
                        onAbort={abort}
                        isGenerating={isGenerating}
                        placeholder="How should the text be rewritten?"
                        submitLabel="Rewrite"
                    />

                    {error && (
                        <Text type="danger" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                            {error}
                        </Text>
                    )}

                    {result && !isGenerating && (
                        <div style={{ marginTop: 12 }}>
                            <Button type="primary" size="small" block onClick={handleApply}>
                                Apply Rewritten Text
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    Select text in the canvas to rewrite it with AI.
                </Text>
            )}
        </div>
    );
}
