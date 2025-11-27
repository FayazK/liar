import useDropdown from '@/hooks/use-dropdown';
import { Select } from 'antd';
import React from 'react';

type AdvancedSelectProps = {
    type: string;
    params?: Record<string, unknown>;
    initialId?: number | null;
} & Omit<React.ComponentProps<typeof Select>, 'loading' | 'showSearch' | 'filterOption' | 'onSearch'>;

const AdvancedSelect: React.FC<AdvancedSelectProps> = ({ type, params, initialId, ...props }) => {
    const { options, loading, fetchOptions } = useDropdown(type, params ?? {}, initialId ?? null);

    return (
        <Select showSearch filterOption={false} onSearch={fetchOptions} loading={loading} {...props}>
            {options.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                    {option.name}
                </Select.Option>
            ))}
        </Select>
    );
};

export default AdvancedSelect;
