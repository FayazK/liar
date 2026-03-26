import { Button, Space } from 'antd';
import type { Editor } from 'grapesjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAiGeneration } from '../../hooks/useAiGeneration';
import { useSelectedText } from '../../hooks/useSelectedText';

interface AiFloatingToolbarProps {
    editor: Editor | null;
}

const PRESETS = [
    { label: 'Rewrite', instruction: 'Rewrite this text to be clearer and more engaging' },
    { label: 'Shorter', instruction: 'Make this text shorter and more concise' },
    { label: 'Professional', instruction: 'Make this text more professional in tone' },
    { label: 'Expand', instruction: 'Expand this text with more detail' },
];

export default function AiFloatingToolbar({ editor }: AiFloatingToolbarProps): React.ReactElement | null {
    const { text: selectedText, range } = useSelectedText(editor);
    const { generate, result, isGenerating, abort } = useAiGeneration();
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    // Calculate position from selection range
    useEffect(() => {
        if (!selectedText || !range || !editor) {
            setPosition(null);
            return;
        }

        try {
            const canvasFrame = editor.Canvas?.getFrameEl();
            if (!canvasFrame) return;

            const rect = range.getBoundingClientRect();
            const frameRect = canvasFrame.getBoundingClientRect();

            setPosition({
                top: frameRect.top + rect.top - 40,
                left: frameRect.left + rect.left + rect.width / 2,
            });
        } catch {
            setPosition(null);
        }
    }, [selectedText, range, editor]);

    // Apply rewritten text
    useEffect(() => {
        if (!result || isGenerating || !range) return;

        try {
            const parsed = JSON.parse(result) as { text?: string };
            if (parsed.text && range) {
                const canvasDoc = editor?.Canvas?.getDocument();
                if (canvasDoc) {
                    const selection = canvasDoc.getSelection();
                    if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                        canvasDoc.execCommand('insertText', false, parsed.text);
                    }
                }
            }
        } catch {
            // Result not ready yet or parse error
        }
    }, [result, isGenerating, range, editor]);

    const handlePreset = useCallback(
        (instruction: string) => {
            if (!selectedText) return;
            generate('/admin/page-builder/ai/rewrite', {
                original_text: selectedText,
                instruction,
            });
        },
        [selectedText, generate],
    );

    if (!selectedText || !position) return null;

    return (
        <div
            ref={toolbarRef}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                transform: 'translateX(-50%)',
                zIndex: 1000,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                padding: '4px 6px',
                display: 'flex',
                gap: 4,
            }}
        >
            {isGenerating ? (
                <Button size="small" danger onClick={abort}>
                    Stop
                </Button>
            ) : (
                <Space size={4}>
                    {PRESETS.map((preset) => (
                        <Button
                            key={preset.label}
                            size="small"
                            type="text"
                            onClick={() => handlePreset(preset.instruction)}
                        >
                            {preset.label}
                        </Button>
                    ))}
                </Space>
            )}
        </div>
    );
}
