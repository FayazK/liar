import { Select } from 'antd';
import type { BooleanFilterConfig } from '@/types/datatable';

interface BooleanFilterProps {
    config: BooleanFilterConfig;
    value: boolean | undefined;
    onChange: (value: boolean | undefined) => void;
}

export function BooleanFilter({ config, value, onChange }: BooleanFilterProps) {
    return (
        <Select
            placeholder={config.placeholder ?? `Filter by ${config.label}`}
            value={value}
            onChange={onChange}
            style={{ minWidth: 150 }}
            allowClear
            aria-label={`Filter by ${config.label}`}
            options={[
                {
                    value: true,
                    label: config.trueLabel ?? 'Active',
                },
                {
                    value: false,
                    label: config.falseLabel ?? 'Inactive',
                },
            ]}
        />
    );
}

export default BooleanFilter;
