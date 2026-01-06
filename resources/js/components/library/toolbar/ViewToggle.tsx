import { Icon } from '@/components/ui/Icon';
import type { ViewMode } from '@/types/library';
import { Segmented, Tooltip } from 'antd';

interface ViewToggleProps {
    value: ViewMode;
    onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
    return (
        <Segmented
            value={value}
            onChange={(val) => onChange(val as ViewMode)}
            options={[
                {
                    value: 'grid',
                    icon: (
                        <Tooltip title="Grid view">
                            <Icon name="layout-grid" size={16} />
                        </Tooltip>
                    ),
                },
                {
                    value: 'list',
                    icon: (
                        <Tooltip title="List view">
                            <Icon name="layout-list" size={16} />
                        </Tooltip>
                    ),
                },
            ]}
        />
    );
}
