import CreateFolderModal from '@/components/library/CreateFolderModal';
import LibraryGrid from '@/components/library/LibraryGrid';
import UploadFilesModal from '@/components/library/UploadFilesModal';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/library';
import type { BreadcrumbItem, Library, LibraryPageProps } from '@/types/library';
import { Head, router } from '@inertiajs/react';
import { Breadcrumb, Button, Space, theme } from 'antd';
import { useState } from 'react';

const { useToken } = theme;

export default function LibraryIndex({ currentFolder, breadcrumbs }: LibraryPageProps) {
    const { token } = useToken();
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showUploadFiles, setShowUploadFiles] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleFolderClick = (folder: Library) => {
        router.visit(index.url({ folder: folder.id }));
    };

    const breadcrumbItems = [
        {
            title: (
                <Space style={{ cursor: 'pointer' }} onClick={() => router.visit(index.url())}>
                    <Icon name="home" size={14} />
                    Library
                </Space>
            ),
        },
        ...breadcrumbs.map((crumb: BreadcrumbItem) => ({
            title: (
                <span style={{ cursor: 'pointer' }} onClick={() => router.visit(index.url({ folder: crumb.id }))}>
                    {crumb.name}
                </span>
            ),
        })),
    ];

    const headerActions = (
        <Space>
            <Button icon={<Icon name="folder-plus" size={16} />} onClick={() => setShowCreateFolder(true)}>
                New Folder
            </Button>
            <Button type="primary" icon={<Icon name="upload" size={16} />} onClick={() => setShowUploadFiles(true)}>
                Upload Files
            </Button>
        </Space>
    );

    return (
        <AppLayout>
            <Head title="Library" />
            <PageCard
                header={{
                    title: 'Library',
                    actions: headerActions,
                }}
            >
                <div style={{ marginBottom: token.margin }}>
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <LibraryGrid key={refreshKey} parentId={currentFolder.id} onFolderClick={handleFolderClick} />

                <CreateFolderModal
                    open={showCreateFolder}
                    onClose={() => setShowCreateFolder(false)}
                    parentId={currentFolder.id}
                    onSuccess={() => setRefreshKey((prev) => prev + 1)}
                />

                <UploadFilesModal
                    open={showUploadFiles}
                    onClose={() => setShowUploadFiles(false)}
                    libraryId={currentFolder.id}
                    onUploadComplete={() => setRefreshKey((prev) => prev + 1)}
                />
            </PageCard>
        </AppLayout>
    );
}
