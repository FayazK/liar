import './styles.css';

import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import type { MentionNodeAttrs } from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import type { Editor } from '@tiptap/react';
import { EditorContent, ReactRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { SuggestionProps } from '@tiptap/suggestion';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import tippy, { type Instance } from 'tippy.js';

import type { JSONContent, MentionSuggestion, RichTextEditorProps, RichTextEditorRef } from '@/types/editor';

import { FixedToolbar } from './FixedToolbar';
import { FloatingToolbar } from './FloatingToolbar';
import { ImageModal } from './ImageModal';
import { MentionList } from './MentionList';

interface MentionListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
    (
        {
            value,
            defaultValue,
            onChange,
            toolbar = 'floating',
            onImageUpload,
            allowImageUrl = true,
            onMentionSearch,
            placeholder = 'Write something...',
            disabled = false,
            editable = true,
            minHeight,
            maxHeight,
            status,
            className,
            style,
        },
        ref,
    ) => {
        const [imageModalOpen, setImageModalOpen] = useState(false);
        const mentionSearchRef = useRef(onMentionSearch);
        mentionSearchRef.current = onMentionSearch;

        const editor = useEditor({
            extensions: [
                StarterKit.configure({
                    heading: {
                        levels: [1, 2, 3, 4, 5, 6],
                    },
                }),
                Underline,
                TextStyle,
                Color,
                Highlight.configure({
                    multicolor: true,
                }),
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                Link.configure({
                    openOnClick: false,
                    HTMLAttributes: {
                        rel: 'noopener noreferrer',
                        target: '_blank',
                    },
                }),
                Image.configure({
                    HTMLAttributes: {
                        class: 'rich-text-image',
                    },
                }),
                Table.configure({
                    resizable: true,
                }),
                TableRow,
                TableCell,
                TableHeader,
                TaskList,
                TaskItem.configure({
                    nested: true,
                }),
                Subscript,
                Superscript,
                Placeholder.configure({
                    placeholder,
                }),
                ...(onMentionSearch
                    ? [
                          Mention.configure({
                              HTMLAttributes: {
                                  class: 'mention',
                              },
                              suggestion: {
                                  items: async ({ query }: { query: string }) => {
                                      if (!mentionSearchRef.current) return [];
                                      return await mentionSearchRef.current(query);
                                  },
                                  render: () => {
                                      let component: ReactRenderer<MentionListRef> | null = null;
                                      let popup: Instance[] = [];

                                      return {
                                          onStart: (props: SuggestionProps<MentionSuggestion, MentionNodeAttrs>) => {
                                              component = new ReactRenderer(MentionList, {
                                                  props: {
                                                      items: props.items,
                                                      command: props.command,
                                                  },
                                                  editor: props.editor as Editor,
                                              });

                                              if (!props.clientRect) return;

                                              popup = tippy('body', {
                                                  getReferenceClientRect: props.clientRect as () => DOMRect,
                                                  appendTo: () => document.body,
                                                  content: component.element,
                                                  showOnCreate: true,
                                                  interactive: true,
                                                  trigger: 'manual',
                                                  placement: 'bottom-start',
                                              });
                                          },
                                          onUpdate: (props: SuggestionProps<MentionSuggestion, MentionNodeAttrs>) => {
                                              component?.updateProps({
                                                  items: props.items,
                                                  command: props.command,
                                              });

                                              if (!props.clientRect) return;

                                              popup[0]?.setProps({
                                                  getReferenceClientRect: props.clientRect as () => DOMRect,
                                              });
                                          },
                                          onKeyDown: (props: { event: KeyboardEvent }) => {
                                              if (props.event.key === 'Escape') {
                                                  popup[0]?.hide();
                                                  return true;
                                              }

                                              return component?.ref?.onKeyDown(props) ?? false;
                                          },
                                          onExit: () => {
                                              popup[0]?.destroy();
                                              component?.destroy();
                                          },
                                      };
                                  },
                              },
                          }),
                      ]
                    : []),
            ],
            content: value ?? defaultValue,
            editable: editable && !disabled,
            onUpdate: ({ editor: ed }) => {
                onChange?.(ed.getJSON(), ed.getHTML(), ed.getText());
            },
            editorProps: {
                attributes: {
                    class: 'rich-text-editor__content',
                },
            },
        });

        // Sync controlled value
        useEffect(() => {
            if (!editor || !value) return;

            const currentContent = JSON.stringify(editor.getJSON());
            const newContent = JSON.stringify(value);

            if (currentContent !== newContent) {
                editor.commands.setContent(value);
            }
        }, [editor, value]);

        // Expose methods via ref
        useImperativeHandle(ref, () => ({
            focus: () => editor?.commands.focus(),
            getJSON: () => editor?.getJSON(),
            getHTML: () => editor?.getHTML() ?? '',
            getText: () => editor?.getText() ?? '',
            setContent: (content: JSONContent | string) => {
                editor?.commands.setContent(content);
            },
            clearContent: () => {
                editor?.commands.clearContent();
            },
        }));

        const handleInsertImage = useCallback(
            (url: string) => {
                editor?.chain().focus().setImage({ src: url }).run();
                setImageModalOpen(false);
            },
            [editor],
        );

        const openImageModal = useCallback(() => {
            setImageModalOpen(true);
        }, []);

        if (!editor) {
            return null;
        }

        const isReadOnly = !editable;
        const containerClasses = [
            'rich-text-editor',
            disabled && 'rich-text-editor--disabled',
            status === 'error' && 'rich-text-editor--error',
            status === 'warning' && 'rich-text-editor--warning',
            isReadOnly && 'rich-text-editor--readonly',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const contentStyle: React.CSSProperties = {
            minHeight: minHeight ?? 150,
            maxHeight: maxHeight ?? 400,
        };

        return (
            <div className={containerClasses} style={style}>
                {editable && toolbar === 'fixed' && <FixedToolbar editor={editor} onImageClick={openImageModal} />}
                {editable && toolbar === 'floating' && <FloatingToolbar editor={editor} onImageClick={openImageModal} />}

                <div style={contentStyle}>
                    <EditorContent editor={editor} />
                </div>

                <ImageModal
                    open={imageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    onInsert={handleInsertImage}
                    onUpload={onImageUpload}
                    allowUrl={allowImageUrl}
                />
            </div>
        );
    },
);

RichTextEditor.displayName = 'RichTextEditor';
