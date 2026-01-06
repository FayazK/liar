import { Icon } from '@/components/ui/Icon';
import { flexRender, type Row, type Table } from '@tanstack/react-table';
import { Checkbox, Skeleton, theme } from 'antd';

const { useToken } = theme;

interface TableBodyProps<TData> {
    table: Table<TData>;
    isLoading: boolean;
    enableRowSelection?: boolean;
    onRowClick?: (row: Row<TData>) => void;
    emptyMessage?: string;
    emptyFilterMessage?: string;
    hasFilters?: boolean;
}

export function TableBody<TData>({
    table,
    isLoading,
    enableRowSelection = false,
    onRowClick,
    emptyMessage = 'No data available',
    emptyFilterMessage = 'No results match your filters',
    hasFilters = false,
}: TableBodyProps<TData>) {
    const { token } = useToken();

    const rows = table.getRowModel().rows;

    // Loading state
    if (isLoading && rows.length === 0) {
        return (
            <div style={{ padding: token.paddingLG }}>
                <Skeleton active paragraph={{ rows: 5 }} />
            </div>
        );
    }

    // Empty state
    if (rows.length === 0) {
        return (
            <div
                style={{
                    padding: token.paddingXL * 2,
                    textAlign: 'center',
                    color: token.colorTextSecondary,
                }}
            >
                <Icon name="inbox" size={48} style={{ marginBottom: token.marginMD, opacity: 0.5 }} />
                <div style={{ fontSize: token.fontSizeLG }}>{hasFilters ? emptyFilterMessage : emptyMessage}</div>
            </div>
        );
    }

    return (
        <table
            style={{
                width: '100%',
                borderCollapse: 'collapse',
            }}
        >
                <thead
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {enableRowSelection && (
                                <th
                                    style={{
                                        padding: `${token.paddingSM}px ${token.paddingMD}px`,
                                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                        textAlign: 'left',
                                        fontWeight: 500,
                                        color: token.colorTextSecondary,
                                        fontSize: token.fontSizeSM,
                                        width: 48,
                                        backgroundColor: token.colorBgContainer,
                                    }}
                                >
                                    <Checkbox
                                        checked={table.getIsAllRowsSelected()}
                                        indeterminate={table.getIsSomeRowsSelected()}
                                        onChange={table.getToggleAllRowsSelectedHandler()}
                                        aria-label="Select all rows"
                                    />
                                </th>
                            )}
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    style={{
                                        padding: `${token.paddingSM}px ${token.paddingMD}px`,
                                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                        textAlign: 'left',
                                        fontWeight: 500,
                                        color: token.colorTextSecondary,
                                        fontSize: token.fontSizeSM,
                                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        userSelect: 'none',
                                        width: header.column.columnDef.size,
                                        backgroundColor: token.colorBgContainer,
                                    }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanSort() && (
                                            <span style={{ opacity: header.column.getIsSorted() ? 1 : 0.3 }}>
                                                {header.column.getIsSorted() === 'asc' ? (
                                                    <Icon name="arrow-up" size={14} />
                                                ) : header.column.getIsSorted() === 'desc' ? (
                                                    <Icon name="arrow-down" size={14} />
                                                ) : (
                                                    <Icon name="arrows-sort" size={14} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => onRowClick?.(row)}
                            style={{
                                cursor: onRowClick ? 'pointer' : 'default',
                                backgroundColor: row.getIsSelected() ? token.colorPrimaryBg : 'transparent',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                if (!row.getIsSelected()) {
                                    e.currentTarget.style.backgroundColor = token.colorFillQuaternary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!row.getIsSelected()) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {enableRowSelection && (
                                <td
                                    style={{
                                        padding: `${token.paddingSM}px ${token.paddingMD}px`,
                                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Checkbox
                                        checked={row.getIsSelected()}
                                        disabled={!row.getCanSelect()}
                                        onChange={row.getToggleSelectedHandler()}
                                        aria-label={`Select row ${row.id}`}
                                    />
                                </td>
                            )}
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    style={{
                                        padding: `${token.paddingSM}px ${token.paddingMD}px`,
                                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
    );
}

export default TableBody;
