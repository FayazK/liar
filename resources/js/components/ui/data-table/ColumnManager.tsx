import { Icon } from '@/components/ui/Icon';
import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Column, VisibilityState } from '@tanstack/react-table';
import { Button, Checkbox, Modal, Space, theme } from 'antd';

const { useToken } = theme;

interface ColumnManagerProps<TData> {
    columns: Column<TData, unknown>[];
    columnVisibility: VisibilityState;
    columnOrder: string[];
    onVisibilityChange: (visibility: VisibilityState) => void;
    onOrderChange: (order: string[]) => void;
    onReset: () => void;
    open: boolean;
    onClose: () => void;
}

interface SortableColumnItemProps {
    id: string;
    label: string;
    isVisible: boolean;
    onToggle: () => void;
}

function SortableColumnItem({ id, label, isVisible, onToggle }: SortableColumnItemProps) {
    const { token } = useToken();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                gap: token.marginSM,
                padding: `${token.paddingXS}px ${token.paddingSM}px`,
                borderRadius: token.borderRadius,
                backgroundColor: isDragging ? token.colorFillSecondary : 'transparent',
            }}
        >
            <div
                {...attributes}
                {...listeners}
                style={{
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    color: token.colorTextSecondary,
                }}
            >
                <Icon name="grip-vertical" size={16} />
            </div>
            <Checkbox checked={isVisible} onChange={onToggle}>
                {label}
            </Checkbox>
        </div>
    );
}

export function ColumnManager<TData>({
    columns,
    columnVisibility,
    columnOrder,
    onVisibilityChange,
    onOrderChange,
    onReset,
    open,
    onClose,
}: ColumnManagerProps<TData>) {
    const { token } = useToken();

    // Get column IDs in current order
    const orderedColumnIds = columnOrder.length > 0 ? columnOrder : columns.map((col) => col.id);

    // Filter to only include columns that exist
    const validColumnIds = orderedColumnIds.filter((id) => columns.some((col) => col.id === id));

    // Add any columns that aren't in the order
    const missingColumns = columns.filter((col) => !validColumnIds.includes(col.id)).map((col) => col.id);

    const allColumnIds = [...validColumnIds, ...missingColumns];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = allColumnIds.indexOf(active.id as string);
            const newIndex = allColumnIds.indexOf(over.id as string);
            const newOrder = arrayMove(allColumnIds, oldIndex, newIndex);
            onOrderChange(newOrder);
        }
    };

    const handleToggleVisibility = (columnId: string) => {
        const newVisibility = {
            ...columnVisibility,
            [columnId]: columnVisibility[columnId] === false,
        };
        onVisibilityChange(newVisibility);
    };

    const handleShowAll = () => {
        const newVisibility: VisibilityState = {};
        columns.forEach((col) => {
            newVisibility[col.id] = true;
        });
        onVisibilityChange(newVisibility);
    };

    const handleHideAll = () => {
        const newVisibility: VisibilityState = {};
        columns.forEach((col) => {
            newVisibility[col.id] = false;
        });
        onVisibilityChange(newVisibility);
    };

    return (
        <Modal
            title="Manage Columns"
            open={open}
            onCancel={onClose}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={onReset}>Reset to Default</Button>
                    <Button type="primary" onClick={onClose}>
                        Done
                    </Button>
                </div>
            }
            width={400}
        >
            <div style={{ marginBottom: token.marginMD }}>
                <Space>
                    <Button size="small" onClick={handleShowAll}>
                        Show All
                    </Button>
                    <Button size="small" onClick={handleHideAll}>
                        Hide All
                    </Button>
                </Space>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={allColumnIds} strategy={verticalListSortingStrategy}>
                    <div
                        style={{
                            maxHeight: 400,
                            overflowY: 'auto',
                            border: `1px solid ${token.colorBorderSecondary}`,
                            borderRadius: token.borderRadius,
                            padding: token.paddingXS,
                        }}
                    >
                        {allColumnIds.map((columnId) => {
                            const column = columns.find((col) => col.id === columnId);
                            if (!column) return null;

                            const header = column.columnDef.header;
                            const label = typeof header === 'string' ? header : columnId;
                            const isVisible = columnVisibility[columnId] !== false;

                            return (
                                <SortableColumnItem
                                    key={columnId}
                                    id={columnId}
                                    label={label}
                                    isVisible={isVisible}
                                    onToggle={() => handleToggleVisibility(columnId)}
                                />
                            );
                        })}
                    </div>
                </SortableContext>
            </DndContext>
        </Modal>
    );
}

export default ColumnManager;
