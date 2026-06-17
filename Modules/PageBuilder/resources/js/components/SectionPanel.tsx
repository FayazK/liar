import { capitalize } from '@/utils/string';
import type { SectionTemplate } from '../lib/grapes-blocks';
import { Collapse, Empty, Input, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface SectionPanelProps {
    templates: Record<string, SectionTemplate[]>;
    onInsert: (template: SectionTemplate) => void;
}

export default function SectionPanel({ templates, onInsert }: SectionPanelProps): React.ReactElement {
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const allTagSet = new Set<string>();
    Object.values(templates).forEach((sections) =>
        sections.forEach((s) => s.tags?.forEach((t) => allTagSet.add(t))),
    );
    const allTags = Array.from(allTagSet).sort();

    const toggleTag = (tag: string): void => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };

    const filteredTemplates = Object.entries(templates).reduce<Record<string, SectionTemplate[]>>(
        (acc, [category, sections]) => {
            const filtered = sections.filter((s) => {
                const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
                const matchesTags =
                    selectedTags.length === 0 || selectedTags.every((tag) => s.tags?.includes(tag));
                return matchesSearch && matchesTags;
            });
            if (filtered.length > 0) {
                acc[category] = filtered;
            }
            return acc;
        },
        {},
    );

    const categories = Object.keys(filteredTemplates);

    const collapseItems = categories.map((category) => ({
        key: category,
        label: capitalize(category),
        children: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {filteredTemplates[category].map((template) => (
                    <div
                        key={template.id}
                        onClick={() => onInsert(template)}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderRadius: 4,
                            border: '1px solid #f0f0f0',
                        }}
                        className="hover:bg-gray-50"
                    >
                        {template.thumbnail && (
                            <img
                                src={template.thumbnail}
                                alt={template.name}
                                style={{
                                    width: '100%',
                                    height: 48,
                                    objectFit: 'cover',
                                    borderRadius: 4,
                                    marginBottom: 4,
                                }}
                            />
                        )}
                        <Text style={{ fontSize: 12 }}>{template.name}</Text>
                    </div>
                ))}
            </div>
        ),
    }));

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 8 }}>
                <Input.Search
                    placeholder="Search sections..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    size="small"
                />
            </div>
            {allTags.length > 0 && (
                <div style={{ padding: '4px 8px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selectedTags.length > 0 && (
                        <Tag closable onClose={() => setSelectedTags([])}>
                            Clear
                        </Tag>
                    )}
                    {allTags.map((tag) => (
                        <Tag
                            key={tag}
                            color={selectedTags.includes(tag) ? 'blue' : undefined}
                            onClick={() => toggleTag(tag)}
                            style={{ cursor: 'pointer', fontSize: 11 }}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
            )}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {categories.length === 0 ? (
                    <Empty description="No sections found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                    <Collapse
                        items={collapseItems}
                        defaultActiveKey={categories}
                        bordered={false}
                        size="small"
                    />
                )}
            </div>
        </div>
    );
}
