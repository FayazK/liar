import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import type { MentionListProps, MentionSuggestion } from '@/types/editor';

interface MentionListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = items[index];
        if (item) {
            command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    if (items.length === 0) {
        return (
            <div className="rich-text-mention-list">
                <div className="rich-text-mention-list__item" style={{ justifyContent: 'center', color: 'var(--ant-color-text-tertiary)' }}>
                    No results
                </div>
            </div>
        );
    }

    return (
        <div className="rich-text-mention-list">
            {items.map((item: MentionSuggestion, index: number) => (
                <div
                    key={item.id}
                    className={`rich-text-mention-list__item ${index === selectedIndex ? 'rich-text-mention-list__item--selected' : ''}`}
                    onClick={() => selectItem(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    {item.avatar ? (
                        <img src={item.avatar} alt={item.label} className="rich-text-mention-list__item-avatar" />
                    ) : (
                        <div
                            className="rich-text-mention-list__item-avatar"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 500,
                                color: 'var(--ant-color-text-secondary)',
                            }}
                        >
                            {item.label.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="rich-text-mention-list__item-name">{item.label}</span>
                </div>
            ))}
        </div>
    );
});

MentionList.displayName = 'MentionList';
