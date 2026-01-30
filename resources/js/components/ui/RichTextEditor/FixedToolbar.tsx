import type { Editor } from '@tiptap/react';
import { Button, ColorPicker, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
    IconAlignCenter,
    IconAlignJustified,
    IconAlignLeft,
    IconAlignRight,
    IconBlockquote,
    IconBold,
    IconCode,
    IconH1,
    IconH2,
    IconH3,
    IconHighlight,
    IconItalic,
    IconLine,
    IconLink,
    IconList,
    IconListNumbers,
    IconListCheck,
    IconPhoto,
    IconStrikethrough,
    IconSubscript,
    IconSuperscript,
    IconTable,
    IconUnderline,
    IconUnlink,
} from '@tabler/icons-react';
import { useCallback, useState } from 'react';

interface FixedToolbarProps {
    editor: Editor;
    onImageClick: () => void;
}

export function FixedToolbar({ editor, onImageClick }: FixedToolbarProps) {
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);

    const setLink = useCallback(() => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        }
        setLinkUrl('');
        setShowLinkInput(false);
    }, [editor, linkUrl]);

    const unsetLink = useCallback(() => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }, [editor]);

    const headingItems: MenuProps['items'] = [
        {
            key: 'p',
            label: 'Paragraph',
            onClick: () => editor.chain().focus().setParagraph().run(),
        },
        {
            key: 'h1',
            label: 'Heading 1',
            icon: <IconH1 size={16} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            key: 'h2',
            label: 'Heading 2',
            icon: <IconH2 size={16} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            key: 'h3',
            label: 'Heading 3',
            icon: <IconH3 size={16} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
    ];

    const tableItems: MenuProps['items'] = [
        {
            key: 'insert',
            label: 'Insert Table',
            onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
        },
        {
            key: 'addColumnBefore',
            label: 'Add Column Before',
            onClick: () => editor.chain().focus().addColumnBefore().run(),
            disabled: !editor.can().addColumnBefore(),
        },
        {
            key: 'addColumnAfter',
            label: 'Add Column After',
            onClick: () => editor.chain().focus().addColumnAfter().run(),
            disabled: !editor.can().addColumnAfter(),
        },
        {
            key: 'deleteColumn',
            label: 'Delete Column',
            onClick: () => editor.chain().focus().deleteColumn().run(),
            disabled: !editor.can().deleteColumn(),
        },
        { type: 'divider' },
        {
            key: 'addRowBefore',
            label: 'Add Row Before',
            onClick: () => editor.chain().focus().addRowBefore().run(),
            disabled: !editor.can().addRowBefore(),
        },
        {
            key: 'addRowAfter',
            label: 'Add Row After',
            onClick: () => editor.chain().focus().addRowAfter().run(),
            disabled: !editor.can().addRowAfter(),
        },
        {
            key: 'deleteRow',
            label: 'Delete Row',
            onClick: () => editor.chain().focus().deleteRow().run(),
            disabled: !editor.can().deleteRow(),
        },
        { type: 'divider' },
        {
            key: 'deleteTable',
            label: 'Delete Table',
            danger: true,
            onClick: () => editor.chain().focus().deleteTable().run(),
            disabled: !editor.can().deleteTable(),
        },
    ];

    const getCurrentHeading = () => {
        if (editor.isActive('heading', { level: 1 })) return 'H1';
        if (editor.isActive('heading', { level: 2 })) return 'H2';
        if (editor.isActive('heading', { level: 3 })) return 'H3';
        return 'P';
    };

    return (
        <div className="rich-text-toolbar">
            {/* Text Style Group */}
            <div className="rich-text-toolbar__group">
                <Tooltip title="Bold (Ctrl+B)">
                    <Button
                        type={editor.isActive('bold') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconBold size={16} />}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    />
                </Tooltip>
                <Tooltip title="Italic (Ctrl+I)">
                    <Button
                        type={editor.isActive('italic') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconItalic size={16} />}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    />
                </Tooltip>
                <Tooltip title="Underline (Ctrl+U)">
                    <Button
                        type={editor.isActive('underline') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconUnderline size={16} />}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    />
                </Tooltip>
                <Tooltip title="Strikethrough">
                    <Button
                        type={editor.isActive('strike') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconStrikethrough size={16} />}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    />
                </Tooltip>
            </div>

            {/* Heading Group */}
            <div className="rich-text-toolbar__group">
                <Dropdown menu={{ items: headingItems }} trigger={['click']}>
                    <Button type="text" size="small">
                        {getCurrentHeading()}
                    </Button>
                </Dropdown>
            </div>

            {/* List Group */}
            <div className="rich-text-toolbar__group">
                <Tooltip title="Bullet List">
                    <Button
                        type={editor.isActive('bulletList') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconList size={16} />}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    />
                </Tooltip>
                <Tooltip title="Numbered List">
                    <Button
                        type={editor.isActive('orderedList') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconListNumbers size={16} />}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    />
                </Tooltip>
                <Tooltip title="Task List">
                    <Button
                        type={editor.isActive('taskList') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconListCheck size={16} />}
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                    />
                </Tooltip>
            </div>

            {/* Alignment Group */}
            <div className="rich-text-toolbar__group">
                <Tooltip title="Align Left">
                    <Button
                        type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'}
                        size="small"
                        icon={<IconAlignLeft size={16} />}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    />
                </Tooltip>
                <Tooltip title="Align Center">
                    <Button
                        type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'}
                        size="small"
                        icon={<IconAlignCenter size={16} />}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    />
                </Tooltip>
                <Tooltip title="Align Right">
                    <Button
                        type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'}
                        size="small"
                        icon={<IconAlignRight size={16} />}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    />
                </Tooltip>
                <Tooltip title="Justify">
                    <Button
                        type={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'text'}
                        size="small"
                        icon={<IconAlignJustified size={16} />}
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    />
                </Tooltip>
            </div>

            {/* Colors Group */}
            <div className="rich-text-toolbar__group">
                <ColorPicker
                    size="small"
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    onChange={(color) => {
                        editor.chain().focus().setColor(color.toHexString()).run();
                    }}
                >
                    <Tooltip title="Text Color">
                        <Button type="text" size="small" style={{ padding: '0 4px' }}>
                            <span
                                style={{
                                    display: 'block',
                                    width: 16,
                                    height: 16,
                                    backgroundColor: editor.getAttributes('textStyle').color || '#000000',
                                    borderRadius: 2,
                                    border: '1px solid var(--ant-color-border)',
                                }}
                            />
                        </Button>
                    </Tooltip>
                </ColorPicker>
                <Tooltip title="Highlight">
                    <Button
                        type={editor.isActive('highlight') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconHighlight size={16} />}
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                    />
                </Tooltip>
            </div>

            {/* Sub/Superscript Group */}
            <div className="rich-text-toolbar__group">
                <Tooltip title="Subscript">
                    <Button
                        type={editor.isActive('subscript') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconSubscript size={16} />}
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                    />
                </Tooltip>
                <Tooltip title="Superscript">
                    <Button
                        type={editor.isActive('superscript') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconSuperscript size={16} />}
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    />
                </Tooltip>
            </div>

            {/* Insert Group */}
            <div className="rich-text-toolbar__group">
                {showLinkInput ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                        <input
                            type="url"
                            placeholder="Enter URL..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setLink();
                                } else if (e.key === 'Escape') {
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                }
                            }}
                            style={{
                                padding: '4px 8px',
                                borderRadius: 4,
                                border: '1px solid var(--ant-color-border)',
                                fontSize: 12,
                                width: 150,
                            }}
                            autoFocus
                        />
                        <Button type="primary" size="small" onClick={setLink}>
                            Add
                        </Button>
                        <Button
                            type="text"
                            size="small"
                            onClick={() => {
                                setShowLinkInput(false);
                                setLinkUrl('');
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <>
                        <Tooltip title="Link">
                            <Button
                                type={editor.isActive('link') ? 'primary' : 'text'}
                                size="small"
                                icon={<IconLink size={16} />}
                                onClick={() => {
                                    if (editor.isActive('link')) {
                                        unsetLink();
                                    } else {
                                        setShowLinkInput(true);
                                    }
                                }}
                            />
                        </Tooltip>
                        {editor.isActive('link') && (
                            <Tooltip title="Remove Link">
                                <Button type="text" size="small" icon={<IconUnlink size={16} />} onClick={unsetLink} />
                            </Tooltip>
                        )}
                    </>
                )}
                <Tooltip title="Image">
                    <Button type="text" size="small" icon={<IconPhoto size={16} />} onClick={onImageClick} />
                </Tooltip>
                <Dropdown menu={{ items: tableItems }} trigger={['click']}>
                    <Tooltip title="Table">
                        <Button type={editor.isActive('table') ? 'primary' : 'text'} size="small" icon={<IconTable size={16} />} />
                    </Tooltip>
                </Dropdown>
            </div>

            {/* Block Group */}
            <div className="rich-text-toolbar__group">
                <Tooltip title="Blockquote">
                    <Button
                        type={editor.isActive('blockquote') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconBlockquote size={16} />}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    />
                </Tooltip>
                <Tooltip title="Code Block">
                    <Button
                        type={editor.isActive('codeBlock') ? 'primary' : 'text'}
                        size="small"
                        icon={<IconCode size={16} />}
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    />
                </Tooltip>
                <Tooltip title="Horizontal Rule">
                    <Button type="text" size="small" icon={<IconLine size={16} />} onClick={() => editor.chain().focus().setHorizontalRule().run()} />
                </Tooltip>
            </div>
        </div>
    );
}
