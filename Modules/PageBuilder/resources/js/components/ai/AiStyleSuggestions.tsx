import { Button, Card, Typography, message } from 'antd';
import type { Editor } from 'grapesjs';
import { useCallback, useState } from 'react';
import { postJson } from '../../lib/ai-api';
import type { AiStyleSuggestion } from '../../lib/ai-types';

const { Text, Paragraph } = Typography;

interface AiStyleSuggestionsProps {
    editor: Editor | null;
}

interface SuggestionsResponse {
    success: boolean;
    data: { suggestions: AiStyleSuggestion[] };
}

export default function AiStyleSuggestions({ editor }: AiStyleSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<AiStyleSuggestion[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = useCallback(async () => {
        if (!editor) return;

        setLoading(true);
        try {
            const html = editor.getHtml() ?? '';
            const css = editor.getCss() ?? '';
            const response = await postJson<SuggestionsResponse>(
                '/admin/page-builder/ai/style-suggestions',
                { html, css },
            );
            setSuggestions(response.data.suggestions ?? []);
        } catch {
            message.error('Failed to analyze design');
        } finally {
            setLoading(false);
        }
    }, [editor]);

    const handleApply = useCallback(
        (suggestion: AiStyleSuggestion) => {
            if (!editor) return;

            const wrapper = editor.getWrapper();
            if (!wrapper) return;

            const components = wrapper.find(suggestion.target_selector);
            if (components.length === 0) {
                message.warning('Could not find the target element');
                return;
            }

            for (const component of components) {
                component.addStyle(suggestion.css_changes);
            }
            message.success(`Applied: ${suggestion.title}`);
        },
        [editor],
    );

    return (
        <div style={{ padding: '12px 0' }}>
            <Button
                type="primary"
                size="small"
                block
                onClick={() => void handleAnalyze()}
                loading={loading}
            >
                Analyze Design
            </Button>

            {suggestions.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {suggestions.map((s, i) => (
                        <Card key={i} size="small" styles={{ body: { padding: 12 } }}>
                            <Text strong style={{ fontSize: 13 }}>
                                {s.title}
                            </Text>
                            <Paragraph
                                style={{ fontSize: 12, margin: '4px 0 8px', color: '#666' }}
                            >
                                {s.description}
                            </Paragraph>
                            <Button size="small" onClick={() => handleApply(s)}>
                                Apply
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && suggestions.length === 0 && (
                <Text
                    type="secondary"
                    style={{ display: 'block', marginTop: 12, fontSize: 13 }}
                >
                    Click &ldquo;Analyze Design&rdquo; to get AI-powered style improvement
                    suggestions.
                </Text>
            )}
        </div>
    );
}
