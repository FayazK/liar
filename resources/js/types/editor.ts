import type { JSONContent } from '@tiptap/react';

export type { JSONContent };

export interface MentionSuggestion {
    id: string | number;
    label: string;
    avatar?: string;
}

export interface RichTextEditorProps {
    // Content
    value?: JSONContent;
    defaultValue?: JSONContent;
    onChange?: (json: JSONContent, html: string, text: string) => void;

    // Display mode
    toolbar?: 'floating' | 'fixed';

    // Image handling
    onImageUpload?: (file: File) => Promise<string>;
    allowImageUrl?: boolean;

    // Mentions
    onMentionSearch?: (query: string) => Promise<MentionSuggestion[]>;

    // Customization
    placeholder?: string;
    disabled?: boolean;
    editable?: boolean;
    minHeight?: number | string;
    maxHeight?: number | string;

    // Form integration
    status?: 'error' | 'warning';

    // Styling
    className?: string;
    style?: React.CSSProperties;
}

export interface RichTextEditorRef {
    focus: () => void;
    getJSON: () => JSONContent | undefined;
    getHTML: () => string;
    getText: () => string;
    setContent: (content: JSONContent | string) => void;
    clearContent: () => void;
}

export interface ToolbarButtonProps {
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export interface SlashCommand {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: () => void;
}

export interface ImageModalProps {
    open: boolean;
    onClose: () => void;
    onInsert: (url: string) => void;
    onUpload?: (file: File) => Promise<string>;
    allowUrl?: boolean;
}

export interface MentionListProps {
    items: MentionSuggestion[];
    command: (item: MentionSuggestion) => void;
}
