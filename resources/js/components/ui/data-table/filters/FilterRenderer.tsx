import type { ReactNode } from 'react';
import type { Dayjs } from 'dayjs';
import type { FilterConfig } from '@/types/datatable';
import { BooleanFilter } from './BooleanFilter';
import { SelectFilter } from './SelectFilter';
import { DateRangeFilter } from './DateRangeFilter';

interface FilterRendererProps {
    config: FilterConfig;
    value: unknown;
    onChange: (key: string, value: unknown) => void;
}

export function FilterRenderer({ config, value, onChange }: FilterRendererProps): ReactNode {
    const handleChange = (newValue: unknown) => {
        onChange(config.key, newValue);
    };

    switch (config.type) {
        case 'boolean':
            return (
                <BooleanFilter
                    config={config}
                    value={value as boolean | undefined}
                    onChange={handleChange}
                />
            );

        case 'select':
            return (
                <SelectFilter
                    config={config}
                    value={value as string | number | boolean | undefined}
                    onChange={handleChange}
                />
            );

        case 'dateRange':
            return (
                <DateRangeFilter
                    config={config}
                    value={value as [Dayjs | null, Dayjs | null] | undefined}
                    onChange={handleChange}
                />
            );

        case 'custom':
            return config.render({
                value,
                onChange: handleChange,
            });

        default:
            return null;
    }
}

export default FilterRenderer;
