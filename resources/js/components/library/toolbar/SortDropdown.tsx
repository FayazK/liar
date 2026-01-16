import { Icon } from '@/components/ui/Icon';
import type { SortField, SortOrder } from '@/types/library';
import { Button, Dropdown, Space, type MenuProps } from 'antd';

interface SortDropdownProps {
    sortBy: SortField;
    sortOrder: SortOrder;
    onSort: (field: SortField) => void;
}

const SORT_OPTIONS: { key: SortField; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'date', label: 'Date Modified' },
    { key: 'size', label: 'Size' },
    { key: 'type', label: 'Type' },
];

export default function SortDropdown({ sortBy, sortOrder, onSort }: SortDropdownProps) {
    const currentLabel = SORT_OPTIONS.find((opt) => opt.key === sortBy)?.label || 'Sort';

    const items: MenuProps['items'] = SORT_OPTIONS.map((option) => ({
        key: option.key,
        label: (
            <Space>
                <span style={{ width: 100 }}>{option.label}</span>
                {sortBy === option.key && <Icon name={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'} size={14} />}
            </Space>
        ),
        onClick: () => onSort(option.key),
    }));

    return (
        <Dropdown menu={{ items, selectedKeys: [sortBy] }} trigger={['click']}>
            <Button>
                <Space size={4}>
                    {currentLabel}
                    <Icon name="chevron-down" size={12} />
                </Space>
            </Button>
        </Dropdown>
    );
}
