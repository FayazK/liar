import { Icon } from '@/components/ui/Icon';
import { useLibraryState } from '@/hooks/use-library-state';
import type { BreadcrumbItem } from '@/types/library';
import { index } from '@/routes/library';
import { router } from '@inertiajs/react';
import { Breadcrumb, Button, Flex, Space, Tooltip, theme } from 'antd';
import SortDropdown from './SortDropdown';
import ViewToggle from './ViewToggle';

const { useToken } = theme;

interface LibraryToolbarProps {
    breadcrumbs: BreadcrumbItem[];
    onNewFolder: () => void;
    onUpload: () => void;
}

export default function LibraryToolbar({ breadcrumbs, onNewFolder, onUpload }: LibraryToolbarProps) {
    const { token } = useToken();
    const {
        viewMode,
        setViewMode,
        sortBy,
        toggleSort,
        librarySidebarCollapsed,
        toggleLibrarySidebar,
        previewPanelVisible,
        togglePreviewPanel,
    } = useLibraryState();

    const breadcrumbItems = [
        {
            title: (
                <Space style={{ cursor: 'pointer' }} onClick={() => router.visit(index.url())}>
                    <Icon name="home" size={14} />
                    Library
                </Space>
            ),
        },
        ...breadcrumbs.map((crumb) => ({
            title: (
                <span style={{ cursor: 'pointer' }} onClick={() => router.visit(index.url({ folder: crumb.id }))}>
                    {crumb.name}
                </span>
            ),
        })),
    ];

    return (
        <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap="small"
            style={{
                marginBottom: token.marginMD,
                paddingBottom: token.paddingSM,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            {/* Left: Sidebar toggle + Breadcrumbs */}
            <Flex align="center" gap="small">
                <Tooltip title={librarySidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}>
                    <Button
                        type="text"
                        icon={<Icon name={librarySidebarCollapsed ? 'layout-sidebar' : 'layout-sidebar-left-collapse'} size={18} />}
                        onClick={toggleLibrarySidebar}
                    />
                </Tooltip>
                <Breadcrumb items={breadcrumbItems} />
            </Flex>

            {/* Right: View options + Actions */}
            <Flex align="center" gap="small" wrap="wrap">
                <ViewToggle value={viewMode} onChange={setViewMode} />
                <SortDropdown sortBy={sortBy} sortOrder={useLibraryState().sortOrder} onSort={toggleSort} />

                <Tooltip title={previewPanelVisible ? 'Hide preview' : 'Show preview'}>
                    <Button
                        type={previewPanelVisible ? 'primary' : 'default'}
                        icon={<Icon name="layout-sidebar-right" size={16} />}
                        onClick={togglePreviewPanel}
                    />
                </Tooltip>

                <div style={{ width: 1, height: 24, background: token.colorBorderSecondary, margin: '0 4px' }} />

                <Button icon={<Icon name="folder-plus" size={16} />} onClick={onNewFolder}>
                    New Folder
                </Button>
                <Button type="primary" icon={<Icon name="upload" size={16} />} onClick={onUpload}>
                    Upload
                </Button>
            </Flex>
        </Flex>
    );
}
