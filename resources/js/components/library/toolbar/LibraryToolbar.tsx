import { Icon } from '@/components/ui/Icon';
import { useLibraryState } from '@/hooks/use-library-state';
import { index } from '@/routes/library';
import type { BreadcrumbItem } from '@/types/library';
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
    const { viewMode, setViewMode, sortBy, toggleSort, librarySidebarCollapsed, toggleLibrarySidebar, previewPanelVisible, togglePreviewPanel } =
        useLibraryState();

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
                marginBottom: token.marginLG,
            }}
        >
            {/* Left: Layout toggles + Breadcrumbs */}
            <Flex align="center" gap={8}>
                <Tooltip title={librarySidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}>
                    <Button
                        type="text"
                        icon={<Icon name={librarySidebarCollapsed ? 'layout-sidebar' : 'layout-sidebar-left-collapse'} size={16} />}
                        onClick={toggleLibrarySidebar}
                    />
                </Tooltip>
                <Breadcrumb items={breadcrumbItems} />
            </Flex>

            {/* Right: View controls + Actions */}
            <Flex align="center" gap={8}>
                <ViewToggle value={viewMode} onChange={setViewMode} />
                <SortDropdown sortBy={sortBy} sortOrder={useLibraryState().sortOrder} onSort={toggleSort} />
                <Tooltip title={previewPanelVisible ? 'Hide preview' : 'Show preview'}>
                    <Button
                        type="text"
                        icon={<Icon name="layout-sidebar-right" size={16} />}
                        onClick={togglePreviewPanel}
                        style={{
                            backgroundColor: previewPanelVisible ? token.colorPrimaryBg : undefined,
                            color: previewPanelVisible ? token.colorPrimary : undefined,
                        }}
                    />
                </Tooltip>

                <div style={{ width: 1, height: 20, backgroundColor: token.colorBorderSecondary, margin: '0 4px' }} />

                <Button icon={<Icon name="folder-plus" size={16} />} onClick={onNewFolder}>
                    New Folder
                </Button>
                <Button icon={<Icon name="upload" size={16} />} onClick={onUpload}>
                    Upload
                </Button>
            </Flex>
        </Flex>
    );
}
