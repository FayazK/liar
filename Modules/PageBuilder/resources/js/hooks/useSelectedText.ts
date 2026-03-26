import type { Editor } from 'grapesjs';
import { useEffect, useState } from 'react';

interface SelectedTextState {
    text: string;
    range: Range | null;
}

export function useSelectedText(editor: Editor | null): SelectedTextState {
    const [state, setState] = useState<SelectedTextState>({ text: '', range: null });

    useEffect(() => {
        if (!editor) return;

        const handleSelectionChange = (): void => {
            const canvasDoc = editor.Canvas?.getDocument();
            if (!canvasDoc) return;

            const selection = canvasDoc.getSelection();
            if (!selection || selection.isCollapsed) {
                setState({ text: '', range: null });
                return;
            }

            const text = selection.toString().trim();
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;

            setState({ text, range });
        };

        // Listen for selection changes on the canvas document
        const canvasDoc = editor.Canvas?.getDocument();
        if (canvasDoc) {
            canvasDoc.addEventListener('selectionchange', handleSelectionChange);
        }

        // Also listen for component selection changes
        editor.on('component:selected', handleSelectionChange);

        return () => {
            if (canvasDoc) {
                canvasDoc.removeEventListener('selectionchange', handleSelectionChange);
            }
            editor.off('component:selected', handleSelectionChange);
        };
    }, [editor]);

    return state;
}
