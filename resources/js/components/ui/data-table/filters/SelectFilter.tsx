import { Select } from 'antd';
import type { SelectFilterConfig } from '@/types/datatable';

interface SelectFilterProps {
    config: SelectFilterConfig;
    value: string | number | boolean | undefined;
    onChange: (value: string | number | boolean | undefined) => void;
}

export function SelectFilter({ config, value, onChange }: SelectFilterProps) {
    return (
        <Select
            placeholder={config.placeholder ?? `Filter by ${config.label}`}
            value={value}
            onChange={onChange}
            style={{ minWidth: 150 }}
            allowClear
            aria-label={`Filter by ${config.label}`}
            options={config.options}
        />
    );
}

export default SelectFilter;
