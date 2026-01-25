import type { BulkActionConfig } from '@/types/datatable';
import type { Row } from '@tanstack/react-table';
import { Button, Space, theme } from 'antd';

const { useToken } = theme;

interface BulkActionsBarProps<TData> {
    selectedRows: Row<TData>[];
    actions: BulkActionConfig<TData>[];
    onClearSelection: () => void;
}

export function BulkActionsBar<TData>({ selectedRows, actions, onClearSelection }: BulkActionsBarProps<TData>) {
    const { token } = useToken();

    if (selectedRows.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: token.colorBgElevated,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                padding: `${token.paddingSM}px ${token.paddingMD}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
            }}
        >
            <Space>
                <span style={{ color: token.colorText, fontWeight: 500 }}>
                    {selectedRows.length} {selectedRows.length === 1 ? 'item' : 'items'} selected
                </span>
                <Button type="link" size="small" onClick={onClearSelection}>
                    Clear selection
                </Button>
            </Space>

            <Space>
                {actions.map((action) => (
                    <Button
                        key={action.key}
                        type={action.danger ? 'primary' : 'default'}
                        danger={action.danger}
                        icon={action.icon}
                        onClick={() => action.onClick(selectedRows)}
                    >
                        {action.label}
                    </Button>
                ))}
            </Space>
        </div>
    );
}

export default BulkActionsBar;
