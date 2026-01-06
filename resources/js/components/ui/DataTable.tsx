import { useDataTable } from '@/hooks/useDataTable';
import type {
    BulkActionConfig,
    CustomTab,
    DataTableFilters,
    DataTableQueryFn,
    FilterConfig,
    TabConfig,
} from '@/types/datatable';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { theme } from 'antd';
import { useState } from 'react';
import { BulkActionsBar, ColumnManager, CustomTabModal, TableBody, TableHeader, TablePagination } from './data-table';

const { useToken } = theme;

export interface DataTableProps<TData> {
    /** Unique key for TanStack Query caching */
    queryKey: string[];
    /** Function to fetch paginated data */
    queryFn: DataTableQueryFn<TData>;
    /** TanStack Table column definitions */
    columns: ColumnDef<TData>[];
    /** Predefined tabs with filters */
    tabs?: TabConfig[];
    /** Default active tab ID */
    defaultTab?: string;
    /** Allow users to create custom filter tabs (localStorage) */
    enableCustomTabs?: boolean;
    /** Enable row selection checkboxes */
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
    /** Enable column visibility management */
    enableColumnVisibility?: boolean;
    /** Enable column reordering via drag-and-drop */
    enableColumnOrdering?: boolean;
    /** Bulk actions for selected rows */
    bulkActions?: BulkActionConfig<TData>[];
    /** LocalStorage key for persisting table state */
    persistenceKey?: string;
    /** Placeholder text for search input */
    searchPlaceholder?: string;
    /** Message when no data exists */
    emptyMessage?: string;
    /** Message when filters return no results */
    emptyFilterMessage?: string;
    /** Filter configurations */
    filters?: FilterConfig[];
    /** Default page size */
    defaultPageSize?: number;
    /** Callback when a row is clicked */
    onRowClick?: (row: Row<TData>) => void;
}

export function DataTable<TData>({
    queryKey,
    queryFn,
    columns,
    tabs = [],
    defaultTab,
    enableCustomTabs = false,
    enableRowSelection = false,
    enableColumnVisibility = false,
    enableColumnOrdering = false,
    bulkActions = [],
    persistenceKey,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No data available',
    emptyFilterMessage = 'No results match your filters',
    filters: filterConfigs = [],
    defaultPageSize = 15,
    onRowClick,
}: DataTableProps<TData>) {
    const { token } = useToken();

    // Column manager modal state
    const [columnManagerOpen, setColumnManagerOpen] = useState(false);

    // Custom tab modal state
    const [customTabModalOpen, setCustomTabModalOpen] = useState(false);
    const [editingTab, setEditingTab] = useState<CustomTab | null>(null);

    // Use the main data table hook
    const {
        table,
        isLoading,
        isFetching,
        data,
        totalCount,
        pageCount,
        currentPage,
        pageSize,
        searchValue,
        setSearchValue,
        filters,
        setFilter,
        clearFilters,
        activeTabId,
        setActiveTab,
        customTabs,
        createCustomTab,
        updateCustomTab,
        deleteCustomTab,
        selectedRows,
        clearSelection,
        columnVisibility,
        setColumnVisibility,
        columnOrder,
        setColumnOrder,
        resetColumnSettings,
    } = useDataTable({
        queryKey,
        queryFn,
        columns,
        persistenceKey,
        defaultPageSize,
        tabs,
        defaultTab,
        enableRowSelection: typeof enableRowSelection === 'function' ? enableRowSelection : enableRowSelection,
    });

    // Determine if we have active filters
    const hasFilters = searchValue.length > 0 || Object.keys(filters).length > 0;

    // Show header section (tabs + search/filters)
    const showHeader = tabs.length > 0 || customTabs.length > 0 || enableCustomTabs || filterConfigs.length > 0;

    // Handle page change
    const handlePageChange = (page: number) => {
        table.setPageIndex(page - 1);
    };

    // Handle page size change
    const handlePageSizeChange = (newPageSize: number) => {
        table.setPageSize(newPageSize);
    };

    // Handle custom tab creation
    const handleCreateTab = () => {
        setEditingTab(null);
        setCustomTabModalOpen(true);
    };

    // Handle custom tab edit
    const handleEditTab = (tab: CustomTab) => {
        setEditingTab(tab);
        setCustomTabModalOpen(true);
    };

    // Handle custom tab save
    const handleSaveTab = (label: string, tabFilters: DataTableFilters) => {
        if (editingTab) {
            updateCustomTab(editingTab.id, { label, filters: tabFilters });
        } else {
            createCustomTab(label, tabFilters);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`,
                overflow: 'hidden',
                height: '100%',
            }}
        >
            {/* Header Section (Tabs + Search/Filters combined) */}
            {showHeader && (
                <TableHeader
                    tabs={tabs}
                    customTabs={customTabs}
                    activeTabId={activeTabId}
                    onTabChange={setActiveTab}
                    enableCustomTabs={enableCustomTabs}
                    onCreateTab={handleCreateTab}
                    onEditTab={handleEditTab}
                    onDeleteTab={deleteCustomTab}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    searchPlaceholder={searchPlaceholder}
                    filters={filterConfigs}
                    filterValues={filters}
                    onFilterChange={setFilter}
                    onClearFilters={clearFilters}
                    enableColumnVisibility={enableColumnVisibility || enableColumnOrdering}
                    onColumnManagerOpen={() => setColumnManagerOpen(true)}
                />
            )}

            {/* Scrollable Table Container */}
            <div
                style={{
                    position: 'relative',
                    flex: 1,
                    overflow: 'auto',
                    minHeight: 0,
                    maxHeight: 'calc(100vh - 280px)',
                }}
            >
                <TableBody
                    table={table}
                    isLoading={isLoading}
                    enableRowSelection={!!enableRowSelection}
                    onRowClick={onRowClick}
                    emptyMessage={emptyMessage}
                    emptyFilterMessage={emptyFilterMessage}
                    hasFilters={hasFilters}
                />

                {/* Pagination - inside scroll container for sticky bottom */}
                {data.length > 0 && (
                    <TablePagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                )}

                {/* Loading overlay for refetching */}
                {isFetching && !isLoading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 5,
                        }}
                    />
                )}
            </div>

            {/* Bulk Actions Bar */}
            {bulkActions.length > 0 && (
                <BulkActionsBar
                    selectedRows={selectedRows}
                    actions={bulkActions}
                    onClearSelection={clearSelection}
                />
            )}

            {/* Column Manager Modal */}
            {(enableColumnVisibility || enableColumnOrdering) && (
                <ColumnManager
                    columns={table.getAllLeafColumns()}
                    columnVisibility={columnVisibility}
                    columnOrder={columnOrder}
                    onVisibilityChange={setColumnVisibility}
                    onOrderChange={setColumnOrder}
                    onReset={resetColumnSettings}
                    open={columnManagerOpen}
                    onClose={() => setColumnManagerOpen(false)}
                />
            )}

            {/* Custom Tab Modal */}
            {enableCustomTabs && (
                <CustomTabModal
                    open={customTabModalOpen}
                    onClose={() => {
                        setCustomTabModalOpen(false);
                        setEditingTab(null);
                    }}
                    onSave={handleSaveTab}
                    editingTab={editingTab}
                    currentFilters={filters}
                />
            )}

            {/* Screen reader announcement */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            >
                {isLoading ? 'Loading data...' : `Showing ${data.length} of ${totalCount} items`}
            </div>
        </div>
    );
}

export default DataTable;
