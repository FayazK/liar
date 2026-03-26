import { Button, Input } from 'antd';

interface AiPromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onAbort?: () => void;
    isGenerating: boolean;
    placeholder?: string;
    submitLabel?: string;
}

export default function AiPromptInput({
    value,
    onChange,
    onSubmit,
    onAbort,
    isGenerating,
    placeholder = 'Describe what you want...',
    submitLabel = 'Generate',
}: AiPromptInputProps): React.ReactElement {
    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!isGenerating && value.trim()) onSubmit();
        }
    };

    return (
        <div>
            <Input.TextArea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoSize={{ minRows: 2, maxRows: 6 }}
                disabled={isGenerating}
            />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                {isGenerating ? (
                    <Button onClick={onAbort} danger size="small">
                        Stop
                    </Button>
                ) : (
                    <Button type="primary" size="small" onClick={onSubmit} disabled={!value.trim()}>
                        {submitLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}
