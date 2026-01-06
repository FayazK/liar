import { Icon } from '@/components/ui/Icon';
import type { DataTableFilters, FilterConfig, FilterValue } from '@/types/datatable';
import { Button, DatePicker, Input, Select, Space, theme } from 'antd';
import dayjs from 'dayjs';

const { useToken } = theme;
const { RangePicker } = DatePicker;

interface TableToolbarProps {
    // Search
    enableSearch?: boolean;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    // Filters
    filters?: FilterConfig[];
    filterValues: DataTableFilters;
    onFilterChange: (key: string, value: FilterValue | undefined) => void;
    onClearFilters: () => void;
    // Column management
    enableColumnVisibility?: boolean;
    onColumnManagerOpen?: () => void;
}

export function TableToolbar({
    enableSearch = true,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filters = [],
    filterValues,
    onFilterChange,
    onClearFilters,
    enableColumnVisibility = false,
    onColumnManagerOpen,
}: TableToolbarProps) {
    const { token } = useToken();

    const hasActiveFilters = searchValue || Object.keys(filterValues).length > 0;

    const renderFilter = (config: FilterConfig) => {
        const value = filterValues[config.key];

        switch (config.type) {
            case 'boolean':
                return (
                    <Select
                        key={config.key}
                        placeholder={config.placeholder || config.label}
                        value={value as boolean | undefined}
                        onChange={(val) =>
                            onFilterChange(config.key, val !== undefined ? { operator: 'eq', value: val } : undefined)
                        }
                        allowClear
                        style={{ minWidth: 120 }}
                        options={[
                            { value: true, label: config.trueLabel || 'Yes' },
                            { value: false, label: config.falseLabel || 'No' },
                        ]}
                    />
                );

            case 'select':
                return (
                    <Select
                        key={config.key}
                        placeholder={config.placeholder || config.label}
                        value={value as string | number | undefined}
                        onChange={(val) =>
                            onFilterChange(config.key, val !== undefined ? { operator: 'eq', value: val } : undefined)
                        }
                        allowClear
                        style={{ minWidth: 150 }}
                        options={config.options}
                    />
                );

            case 'dateRange': {
                const dateValue = value as [dayjs.Dayjs | null, dayjs.Dayjs | null] | undefined;
                return (
                    <RangePicker
                        key={config.key}
                        placeholder={['Start', 'End']}
                        value={dateValue}
                        onChange={(dates) => {
                            if (dates && dates[0] && dates[1]) {
                                onFilterChange(config.key, {
                                    operator: 'between',
                                    value: [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')],
                                });
                            } else {
                                onFilterChange(config.key, undefined);
                            }
                        }}
                        format={config.format || 'YYYY-MM-DD'}
                    />
                );
            }

            case 'custom':
                return config.render({
                    value,
                    onChange: (val) => onFilterChange(config.key, val as FilterValue | undefined),
                });

            default:
                return null;
        }
    };

    const showToolbar = enableSearch || filters.length > 0 || enableColumnVisibility;

    if (!showToolbar) {
        return null;
    }

    return (
        <div
            style={{
                padding: token.paddingSM,
                backgroundColor: token.colorBgLayout,
                borderRadius: token.borderRadiusLG,
                marginBottom: token.marginMD,
            }}
        >
            <Space wrap>
                {enableSearch && (
                    <Input
                        placeholder={searchPlaceholder}
                        prefix={<Icon name="search" size={16} />}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        allowClear
                        style={{ width: 280 }}
                        aria-label="Search table data"
                    />
                )}

                {filters.map(renderFilter)}

                {hasActiveFilters && (
                    <Button type="link" onClick={onClearFilters}>
                        Clear all filters
                    </Button>
                )}

                {enableColumnVisibility && (
                    <Button
                        type="text"
                        icon={<Icon name="settings" size={16} />}
                        onClick={onColumnManagerOpen}
                        aria-label="Manage columns"
                    />
                )}
            </Space>
        </div>
    );
}

export default TableToolbar;
