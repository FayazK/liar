import useDropdown from '@/hooks/use-dropdown';
import { Select } from 'antd';
import React, { useState } from 'react';

interface GroupedDropdownOption {
    label: string;
    options: Array<{ id: number; name: string }>;
}

type AdvancedSelectProps = {
    type: string;
    params?: Record<string, unknown>;
    initialId?: number | number[] | null;

    // Enhancement props
    mode?: 'multiple' | 'tags';
    grouped?: boolean;
    onCreate?: (value: string) => Promise<{ id: number; name: string }>;
} & Omit<React.ComponentProps<typeof Select>, 'loading' | 'showSearch' | 'filterOption' | 'onSearch' | 'mode'>;

const AdvancedSelect: React.FC<AdvancedSelectProps> = ({ type, params, initialId, mode, grouped, onCreate, ...props }) => {
    const { options, loading, fetchOptions } = useDropdown(type, params ?? {}, initialId ?? null);
    const [creating, setCreating] = useState(false);

    // Handle creation of new items in tags mode
    const handleSelect = async (value: string | number | (string | number)[]) => {
        if (mode === 'tags' && onCreate && typeof value === 'string') {
            setCreating(true);
            try {
                await onCreate(value);
                fetchOptions(); // Refresh to show new item
            } finally {
                setCreating(false);
            }
        }
    };

    // Render grouped options if grouped prop is true
    if (grouped && Array.isArray(options) && options[0] && 'label' in options[0]) {
        const groupedOptions = options as unknown as GroupedDropdownOption[];
        return (
            <Select
                mode={mode}
                showSearch
                filterOption={false}
                onSearch={fetchOptions}
                loading={loading || creating}
                onSelect={handleSelect}
                {...props}
            >
                {groupedOptions.map((group) => (
                    <Select.OptGroup key={group.label} label={group.label}>
                        {group.options.map((option) => (
                            <Select.Option key={option.id} value={option.id}>
                                {option.name}
                            </Select.Option>
                        ))}
                    </Select.OptGroup>
                ))}
            </Select>
        );
    }

    // Standard rendering
    return (
        <Select mode={mode} showSearch filterOption={false} onSearch={fetchOptions} loading={loading || creating} onSelect={handleSelect} {...props}>
            {options.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                    {option.name}
                </Select.Option>
            ))}
        </Select>
    );
};

export default AdvancedSelect;
