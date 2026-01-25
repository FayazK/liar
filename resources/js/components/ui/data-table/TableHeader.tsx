import { Icon } from '@/components/ui/Icon';
import type { CustomTab, DataTableFilters, FilterConfig, FilterValue, TabConfig } from '@/types/datatable';
import { Badge, Button, DatePicker, Dropdown, Input, Popover, Select, Space, theme } from 'antd';
import type { InputRef, MenuProps } from 'antd';
import { useEffect, useRef, useState } from 'react';

const { useToken } = theme;
const { RangePicker } = DatePicker;

interface TableHeaderProps {
    // Tabs
    tabs: TabConfig[];
    customTabs: CustomTab[];
    activeTabId: string;
    onTabChange: (tabId: string) => void;
    enableCustomTabs?: boolean;
    onCreateTab?: () => void;
    onEditTab?: (tab: CustomTab) => void;
    onDeleteTab?: (tabId: string) => void;
    // Search
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

export function TableHeader({
    tabs,
    customTabs,
    activeTabId,
    onTabChange,
    enableCustomTabs = false,
    onCreateTab,
    onEditTab,
    onDeleteTab,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filters = [],
    filterValues,
    onFilterChange,
    onClearFilters,
    enableColumnVisibility = false,
    onColumnManagerOpen,
}: TableHeaderProps) {
    const { token } = useToken();
    const [searchExpanded, setSearchExpanded] = useState(!!searchValue);
    const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
    const searchInputRef = useRef<InputRef>(null);

    const allTabs = [...tabs, ...customTabs];
    const activeFilterCount = Object.keys(filterValues).length;

    // Focus input when search expands
    useEffect(() => {
        if (searchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchExpanded]);

    const handleSearchBlur = () => {
        if (!searchValue) {
            setSearchExpanded(false);
        }
    };

    const handleSearchIconClick = () => {
        setSearchExpanded(true);
    };

    const getTabContextMenu = (tab: CustomTab): MenuProps['items'] => [
        {
            key: 'edit',
            label: 'Edit',
            icon: <Icon name="edit" size={14} />,
            onClick: () => onEditTab?.(tab),
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <Icon name="trash" size={14} />,
            danger: true,
            onClick: () => onDeleteTab?.(tab.id),
        },
    ];

    // Helper to extract value from filter (can be FilterValue object or primitive)
    const getFilterValue = (rawValue: DataTableFilters[string]) => {
        if (rawValue === undefined || rawValue === null) return undefined;
        if (typeof rawValue === 'object' && 'operator' in rawValue && 'value' in rawValue) {
            return (rawValue as FilterValue).value;
        }
        return rawValue;
    };

    const renderFilter = (config: FilterConfig) => {
        const rawValue = filterValues[config.key];
        const extractedValue = getFilterValue(rawValue);

        switch (config.type) {
            case 'boolean':
                return (
                    <div key={config.key} style={{ marginBottom: token.marginSM }}>
                        <div
                            style={{
                                fontSize: token.fontSizeSM,
                                color: token.colorTextSecondary,
                                marginBottom: token.marginXS,
                            }}
                        >
                            {config.label}
                        </div>
                        <Select
                            placeholder={config.placeholder || `Select ${config.label}`}
                            value={extractedValue as boolean | undefined}
                            onChange={(val) =>
                                onFilterChange(config.key, val !== undefined ? { operator: 'eq', value: val } : undefined)
                            }
                            allowClear
                            style={{ width: '100%' }}
                            options={[
                                { value: true, label: config.trueLabel || 'Yes' },
                                { value: false, label: config.falseLabel || 'No' },
                            ]}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={config.key} style={{ marginBottom: token.marginSM }}>
                        <div
                            style={{
                                fontSize: token.fontSizeSM,
                                color: token.colorTextSecondary,
                                marginBottom: token.marginXS,
                            }}
                        >
                            {config.label}
                        </div>
                        <Select
                            placeholder={config.placeholder || `Select ${config.label}`}
                            value={extractedValue as string | number | undefined}
                            onChange={(val) =>
                                onFilterChange(config.key, val !== undefined ? { operator: 'eq', value: val } : undefined)
                            }
                            allowClear
                            style={{ width: '100%' }}
                            options={config.options}
                        />
                    </div>
                );

            case 'dateRange': {
                return (
                    <div key={config.key} style={{ marginBottom: token.marginSM }}>
                        <div
                            style={{
                                fontSize: token.fontSizeSM,
                                color: token.colorTextSecondary,
                                marginBottom: token.marginXS,
                            }}
                        >
                            {config.label}
                        </div>
                        <RangePicker
                            placeholder={['Start', 'End']}
                            value={undefined}
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
                            style={{ width: '100%' }}
                        />
                    </div>
                );
            }

            case 'custom':
                return (
                    <div key={config.key} style={{ marginBottom: token.marginSM }}>
                        {config.render({
                            value: rawValue,
                            onChange: (val) => onFilterChange(config.key, val as FilterValue | undefined),
                        })}
                    </div>
                );

            default:
                return null;
        }
    };

    const filterContent = (
        <div style={{ width: 280, padding: token.paddingXS }}>
            {filters.map(renderFilter)}
            {activeFilterCount > 0 && (
                <Button
                    type="link"
                    onClick={() => {
                        onClearFilters();
                        setFilterPopoverOpen(false);
                    }}
                    style={{ padding: 0, marginTop: token.marginXS }}
                >
                    Clear all filters
                </Button>
            )}
            {filters.length === 0 && (
                <div style={{ color: token.colorTextSecondary, textAlign: 'center', padding: token.padding }}>
                    No filters available
                </div>
            )}
        </div>
    );

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${token.paddingXS}px ${token.paddingSM}px`,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                backgroundColor: token.colorBgContainer,
                gap: token.marginMD,
            }}
        >
            {/* Left: Tab Segments */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flex: 1,
                    minWidth: 0,
                    overflow: 'auto',
                }}
            >
                {allTabs.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    const isCustom = 'isCustom' in tab && tab.isCustom;

                    const tabButton = (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: `${token.paddingXS}px ${token.paddingSM}px`,
                                backgroundColor: isActive ? token.colorPrimaryBg : 'transparent',
                                border: 'none',
                                borderRadius: token.borderRadiusSM,
                                cursor: 'pointer',
                                color: isActive ? token.colorPrimary : token.colorText,
                                fontWeight: isActive ? 500 : 400,
                                fontSize: token.fontSize,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = token.colorFillQuaternary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.badge !== undefined && (
                                <span
                                    style={{
                                        padding: `0 ${token.paddingXXS + 2}px`,
                                        backgroundColor: isActive ? token.colorPrimary : token.colorFillSecondary,
                                        color: isActive ? token.colorWhite : token.colorTextSecondary,
                                        borderRadius: token.borderRadiusSM,
                                        fontSize: token.fontSizeSM - 1,
                                        lineHeight: '16px',
                                    }}
                                >
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );

                    if (isCustom) {
                        return (
                            <Dropdown
                                key={tab.id}
                                menu={{ items: getTabContextMenu(tab as CustomTab) }}
                                trigger={['contextMenu']}
                            >
                                {tabButton}
                            </Dropdown>
                        );
                    }

                    return tabButton;
                })}

                {enableCustomTabs && onCreateTab && (
                    <Button
                        type="text"
                        size="small"
                        icon={<Icon name="plus" size={14} />}
                        onClick={onCreateTab}
                        style={{
                            color: token.colorTextSecondary,
                            minWidth: 28,
                            height: 28,
                        }}
                        aria-label="Create custom tab"
                    />
                )}
            </div>

            {/* Right: Actions */}
            <Space size={4}>
                {/* Expandable Search */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'width 0.2s ease-in-out',
                        width: searchExpanded ? 200 : 32,
                        overflow: 'hidden',
                    }}
                >
                    {searchExpanded ? (
                        <Input
                            ref={searchInputRef}
                            placeholder={searchPlaceholder}
                            prefix={<Icon name="search" size={14} />}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onBlur={handleSearchBlur}
                            allowClear
                            size="small"
                            style={{ width: '100%' }}
                            aria-label="Search table data"
                        />
                    ) : (
                        <Button
                            type="text"
                            size="small"
                            icon={<Icon name="search" size={16} />}
                            onClick={handleSearchIconClick}
                            style={{ color: token.colorTextSecondary }}
                            aria-label="Expand search"
                        />
                    )}
                </div>

                {/* Filter Dropdown */}
                {filters.length > 0 && (
                    <Popover
                        content={filterContent}
                        title="Filters"
                        trigger="click"
                        open={filterPopoverOpen}
                        onOpenChange={setFilterPopoverOpen}
                        placement="bottomRight"
                    >
                        <Badge count={activeFilterCount} size="small" offset={[-4, 4]}>
                            <Button
                                type="text"
                                size="small"
                                icon={<Icon name="filter" size={16} />}
                                style={{
                                    color: activeFilterCount > 0 ? token.colorPrimary : token.colorTextSecondary,
                                }}
                                aria-label="Open filters"
                            />
                        </Badge>
                    </Popover>
                )}

                {/* Column Manager */}
                {enableColumnVisibility && onColumnManagerOpen && (
                    <Button
                        type="text"
                        size="small"
                        icon={<Icon name="settings" size={16} />}
                        onClick={onColumnManagerOpen}
                        style={{ color: token.colorTextSecondary }}
                        aria-label="Manage columns"
                    />
                )}
            </Space>
        </div>
    );
}

export default TableHeader;
