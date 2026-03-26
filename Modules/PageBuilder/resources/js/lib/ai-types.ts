export interface AiGenerationResult {
    success: boolean;
    data?: { html: string; css: string };
    error?: string;
}

export interface AiRewriteResult {
    success: boolean;
    data?: { text: string };
    error?: string;
}

export interface AiStyleSuggestion {
    title: string;
    description: string;
    css_changes: Record<string, string>;
    target_selector: string;
}

export interface AiStyleSuggestionsResult {
    success: boolean;
    data?: { suggestions: AiStyleSuggestion[] };
    error?: string;
}

export interface AiImageResult {
    success: boolean;
    data?: { url: string; alt: string };
    error?: string;
}

export interface AiPageSection {
    html: string;
    css: string;
    category: string;
}
