import type { SectionTemplate } from '../lib/grapes-blocks';
import { Collapse, Empty, Input, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface SectionPanelProps {
    templates: Record<string, SectionTemplate[]>;
    onInsert: (template: SectionTemplate) => void;
}

export default function SectionPanel({ templates, onInsert }: SectionPanelProps): React.ReactElement {
    const [search, setSearch] = useState('');

    const filteredTemplates = Object.entries(templates).reduce<Record<string, SectionTemplate[]>>(
        (acc, [category, sections]) => {
            const filtered = sections.filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase()),
            );
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
        label: category.charAt(0).toUpperCase() + category.slice(1),
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
                                style={{ width: '100%', height: 48, objectFit: 'cover', borderRadius: 4, marginBottom: 4 }}
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
