import { BubbleMenu, type Editor } from '@tiptap/react';
import { Button, Input, Tooltip } from 'antd';
import {
    IconBlockquote,
    IconBold,
    IconCode,
    IconH1,
    IconH2,
    IconH3,
    IconItalic,
    IconLine,
    IconLink,
    IconList,
    IconListCheck,
    IconListNumbers,
    IconPhoto,
    IconStrikethrough,
    IconTable,
    IconUnderline,
    IconUnlink,
} from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface FloatingToolbarProps {
    editor: Editor;
    onImageClick: () => void;
}

interface SlashCommand {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: () => void;
}

export function FloatingToolbar({ editor, onImageClick }: FloatingToolbarProps) {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [slashMenuOpen, setSlashMenuOpen] = useState(false);
    const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filterText, setFilterText] = useState('');
    const slashMenuRef = useRef<HTMLDivElement>(null);

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

    const slashCommands: SlashCommand[] = [
        {
            title: 'Heading 1',
            description: 'Large section heading',
            icon: <IconH1 size={18} />,
            command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading',
            icon: <IconH2 size={18} />,
            command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            title: 'Heading 3',
            description: 'Small section heading',
            icon: <IconH3 size={18} />,
            command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
            title: 'Bullet List',
            description: 'Create a bullet list',
            icon: <IconList size={18} />,
            command: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
            title: 'Numbered List',
            description: 'Create a numbered list',
            icon: <IconListNumbers size={18} />,
            command: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
            title: 'Task List',
            description: 'Create a task list',
            icon: <IconListCheck size={18} />,
            command: () => editor.chain().focus().toggleTaskList().run(),
        },
        {
            title: 'Quote',
            description: 'Add a blockquote',
            icon: <IconBlockquote size={18} />,
            command: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
            title: 'Code Block',
            description: 'Add a code block',
            icon: <IconCode size={18} />,
            command: () => editor.chain().focus().toggleCodeBlock().run(),
        },
        {
            title: 'Table',
            description: 'Insert a table',
            icon: <IconTable size={18} />,
            command: () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
        },
        {
            title: 'Image',
            description: 'Insert an image',
            icon: <IconPhoto size={18} />,
            command: () => onImageClick(),
        },
        {
            title: 'Divider',
            description: 'Add a horizontal line',
            icon: <IconLine size={18} />,
            command: () => editor.chain().focus().setHorizontalRule().run(),
        },
    ];

    const filteredCommands = slashCommands.filter(
        (cmd) => cmd.title.toLowerCase().includes(filterText.toLowerCase()) || cmd.description.toLowerCase().includes(filterText.toLowerCase()),
    );

    // Handle slash command trigger
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '/' && !slashMenuOpen) {
                const { selection } = editor.state;
                const { $from } = selection;
                const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);

                // Only trigger at start of line or after whitespace
                if (textBefore === '' || textBefore.endsWith(' ')) {
                    setTimeout(() => {
                        const { view } = editor;
                        const coords = view.coordsAtPos(selection.from);

                        setSlashMenuPosition({
                            top: coords.bottom + 8,
                            left: coords.left,
                        });
                        setSlashMenuOpen(true);
                        setSelectedIndex(0);
                        setFilterText('');
                    }, 0);
                }
            }
        };

        const handleInput = () => {
            if (slashMenuOpen) {
                const { selection } = editor.state;
                const { $from } = selection;
                const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
                const match = textBefore.match(/\/([^\s]*)$/);

                if (match) {
                    setFilterText(match[1]);
                    setSelectedIndex(0);
                } else {
                    setSlashMenuOpen(false);
                }
            }
        };

        const handleSlashKeyDown = (event: KeyboardEvent) => {
            if (!slashMenuOpen) return;

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (event.key === 'Enter') {
                event.preventDefault();
                executeCommand(selectedIndex);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                setSlashMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleSlashKeyDown);
        editor.on('update', handleInput);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keydown', handleSlashKeyDown);
            editor.off('update', handleInput);
        };
    }, [editor, slashMenuOpen, selectedIndex, filteredCommands.length]);

    // Close slash menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (slashMenuRef.current && !slashMenuRef.current.contains(event.target as Node)) {
                setSlashMenuOpen(false);
            }
        };

        if (slashMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [slashMenuOpen]);

    const executeCommand = (index: number) => {
        const command = filteredCommands[index];
        if (command) {
            // Delete the "/" and any filter text
            const { selection } = editor.state;
            const { $from } = selection;
            const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
            const match = textBefore.match(/\/([^\s]*)$/);

            if (match) {
                const start = $from.pos - match[0].length;
                editor.chain().focus().deleteRange({ from: start, to: $from.pos }).run();
            }

            command.command();
            setSlashMenuOpen(false);
        }
    };

    return (
        <>
            <BubbleMenu
                editor={editor}
                tippyOptions={{
                    duration: 100,
                    placement: 'top',
                }}
                className="rich-text-bubble-menu"
            >
                {showLinkInput ? (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <Input
                            size="small"
                            placeholder="Enter URL..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setLink();
                                } else if (e.key === 'Escape') {
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                }
                            }}
                            style={{ width: 180 }}
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
                        <Tooltip title="Bold">
                            <Button
                                type={editor.isActive('bold') ? 'primary' : 'text'}
                                size="small"
                                icon={<IconBold size={16} />}
                                onClick={() => editor.chain().focus().toggleBold().run()}
                            />
                        </Tooltip>
                        <Tooltip title="Italic">
                            <Button
                                type={editor.isActive('italic') ? 'primary' : 'text'}
                                size="small"
                                icon={<IconItalic size={16} />}
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                            />
                        </Tooltip>
                        <Tooltip title="Underline">
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
                        <div style={{ width: 1, height: 20, backgroundColor: 'var(--ant-color-border)', margin: '0 4px' }} />
                        <Tooltip title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}>
                            <Button
                                type={editor.isActive('link') ? 'primary' : 'text'}
                                size="small"
                                icon={editor.isActive('link') ? <IconUnlink size={16} /> : <IconLink size={16} />}
                                onClick={() => {
                                    if (editor.isActive('link')) {
                                        unsetLink();
                                    } else {
                                        setShowLinkInput(true);
                                    }
                                }}
                            />
                        </Tooltip>
                    </>
                )}
            </BubbleMenu>

            {slashMenuOpen && filteredCommands.length > 0 && (
                <div
                    ref={slashMenuRef}
                    className="rich-text-slash-menu"
                    style={{
                        top: slashMenuPosition.top,
                        left: slashMenuPosition.left,
                    }}
                >
                    {filteredCommands.map((cmd, index) => (
                        <div
                            key={cmd.title}
                            className={`rich-text-slash-menu__item ${index === selectedIndex ? 'rich-text-slash-menu__item--selected' : ''}`}
                            onClick={() => executeCommand(index)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className="rich-text-slash-menu__item-icon">{cmd.icon}</div>
                            <div className="rich-text-slash-menu__item-content">
                                <div className="rich-text-slash-menu__item-title">{cmd.title}</div>
                                <div className="rich-text-slash-menu__item-description">{cmd.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
