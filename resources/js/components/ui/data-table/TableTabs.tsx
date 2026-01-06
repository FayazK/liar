import { Icon } from '@/components/ui/Icon';
import type { CustomTab, TabConfig } from '@/types/datatable';
import { Button, Dropdown, Space, Tabs, theme } from 'antd';
import type { MenuProps } from 'antd';

const { useToken } = theme;

interface TableTabsProps {
    tabs: TabConfig[];
    customTabs: CustomTab[];
    activeTabId: string;
    onTabChange: (tabId: string) => void;
    enableCustomTabs?: boolean;
    onCreateTab?: () => void;
    onEditTab?: (tab: CustomTab) => void;
    onDeleteTab?: (tabId: string) => void;
}

export function TableTabs({
    tabs,
    customTabs,
    activeTabId,
    onTabChange,
    enableCustomTabs = false,
    onCreateTab,
    onEditTab,
    onDeleteTab,
}: TableTabsProps) {
    const { token } = useToken();

    const allTabs = [...tabs, ...customTabs];

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

    const tabItems = allTabs.map((tab) => ({
        key: tab.id,
        label: tab.isCustom ? (
            <Dropdown menu={{ items: getTabContextMenu(tab as CustomTab) }} trigger={['contextMenu']}>
                <span>
                    {tab.icon}
                    {tab.label}
                    {tab.badge !== undefined && (
                        <span
                            style={{
                                marginLeft: token.marginXS,
                                padding: `0 ${token.paddingXXS}px`,
                                backgroundColor: token.colorFillSecondary,
                                borderRadius: token.borderRadiusSM,
                                fontSize: token.fontSizeSM,
                            }}
                        >
                            {tab.badge}
                        </span>
                    )}
                </span>
            </Dropdown>
        ) : (
            <Space size={4}>
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && (
                    <span
                        style={{
                            padding: `0 ${token.paddingXXS}px`,
                            backgroundColor: token.colorFillSecondary,
                            borderRadius: token.borderRadiusSM,
                            fontSize: token.fontSizeSM,
                        }}
                    >
                        {tab.badge}
                    </span>
                )}
            </Space>
        ),
    }));

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <Tabs
                activeKey={activeTabId}
                onChange={onTabChange}
                items={tabItems}
                style={{ flex: 1, marginBottom: -1 }}
                tabBarStyle={{ marginBottom: 0 }}
            />
            {enableCustomTabs && onCreateTab && (
                <Button
                    type="text"
                    icon={<Icon name="plus" size={16} />}
                    onClick={onCreateTab}
                    style={{ marginRight: token.marginSM }}
                    aria-label="Create custom tab"
                />
            )}
        </div>
    );
}

export default TableTabs;
