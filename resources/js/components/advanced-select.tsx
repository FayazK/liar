import useDropdown from '@/hooks/use-dropdown';
import { Select } from 'antd';
import React from 'react';

type AdvancedSelectProps = {
    type: string;
    params?: Record<string, unknown>;
    id?: number | null;
} & React.ComponentProps<typeof Select>;

const AdvancedSelect: React.FC<AdvancedSelectProps> = ({ type, params, id, ...props }) => {
    const { options, loading, fetchOptions } = useDropdown(type, params ?? {}, id ?? null);

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
