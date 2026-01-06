import { Icon } from '@/components/ui/Icon';
import { Button, Select, Space, theme } from 'antd';

const { useToken } = theme;

interface TablePaginationProps {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
}

export function TablePagination({
    currentPage,
    pageSize,
    totalCount,
    pageCount,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 15, 25, 50, 100],
}: TablePaginationProps) {
    const { token } = useToken();

    const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < pageCount;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${token.paddingSM}px ${token.paddingMD}px`,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
                backgroundColor: token.colorBgContainer,
            }}
        >
            <Space size="middle">
                <span style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
                    Showing {startItem}-{endItem} of {totalCount}
                </span>
                <Select
                    value={pageSize}
                    onChange={onPageSizeChange}
                    options={pageSizeOptions.map((size) => ({
                        value: size,
                        label: `${size} / page`,
                    }))}
                    size="small"
                    style={{ width: 110 }}
                    aria-label="Page size"
                />
            </Space>

            <Space size="small">
                <Button
                    type="text"
                    size="small"
                    icon={<Icon name="chevron-left" size={16} />}
                    disabled={!canGoPrevious}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous page"
                />
                <span
                    style={{
                        padding: `0 ${token.paddingSM}px`,
                        color: token.colorText,
                        fontSize: token.fontSize,
                    }}
                >
                    {currentPage} / {pageCount || 1}
                </span>
                <Button
                    type="text"
                    size="small"
                    icon={<Icon name="chevron-right" size={16} />}
                    disabled={!canGoNext}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next page"
                />
            </Space>
        </div>
    );
}

export default TablePagination;
