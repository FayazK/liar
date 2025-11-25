import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type { DateRangeFilterConfig } from '@/types/datatable';

const { RangePicker } = DatePicker;

interface DateRangeFilterProps {
    config: DateRangeFilterConfig;
    value: [Dayjs | null, Dayjs | null] | undefined;
    onChange: (value: [Dayjs | null, Dayjs | null] | undefined) => void;
}

export function DateRangeFilter({ config, value, onChange }: DateRangeFilterProps) {
    return (
        <RangePicker
            placeholder={['Start Date', 'End Date']}
            value={value}
            onChange={(dates) => onChange(dates as [Dayjs | null, Dayjs | null] | undefined)}
            format={config.format ?? 'YYYY-MM-DD'}
            style={{ minWidth: 240 }}
            aria-label={`Filter ${config.label} by date range`}
        />
    );
}

export default DateRangeFilter;
