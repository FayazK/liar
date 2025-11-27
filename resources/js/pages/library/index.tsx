import CreateFolderModal from '@/components/library/CreateFolderModal';
import LibraryGrid from '@/components/library/LibraryGrid';
import UploadFilesModal from '@/components/library/UploadFilesModal';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/library';
import type { BreadcrumbItem, Library, LibraryPageProps } from '@/types/library';
import { FolderAddOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
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
                    <HomeOutlined />
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

    return (
        <AppLayout
            pageTitle="Library"
            actions={
                <Space>
                    <Button icon={<FolderAddOutlined />} onClick={() => setShowCreateFolder(true)}>
                        New Folder
                    </Button>
                    <Button type="primary" icon={<UploadOutlined />} onClick={() => setShowUploadFiles(true)}>
                        Upload Files
                    </Button>
                </Space>
            }
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
        </AppLayout>
    );
}
