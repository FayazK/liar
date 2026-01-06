import CreateFolderModal from '@/components/library/CreateFolderModal';
import LibraryGrid from '@/components/library/LibraryGrid';
import LibraryList from '@/components/library/LibraryList';
import PreviewPanel from '@/components/library/preview/PreviewPanel';
import LibrarySidebar from '@/components/library/sidebar/LibrarySidebar';
import LibraryToolbar from '@/components/library/toolbar/LibraryToolbar';
import UploadFilesModal from '@/components/library/UploadFilesModal';
import { useLibraryState } from '@/hooks/use-library-state';
import LibraryLayout from '@/layouts/library-layout';
import axios from '@/lib/axios';
import { index } from '@/routes/library';
import { favorite } from '@/routes/library/api';
import type { Library, LibraryItem, LibraryPageProps, QuickAccessCategory } from '@/types/library';
import { Head, router } from '@inertiajs/react';
import { App, theme } from 'antd';
import { useState } from 'react';

const { useToken } = theme;

export default function LibraryIndex({ currentFolder, breadcrumbs }: LibraryPageProps) {
    const { token } = useToken();
    const { message } = App.useApp();
    const {
        viewMode,
        selectedItem,
        setSelectedItem,
    } = useLibraryState();

    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showUploadFiles, setShowUploadFiles] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<QuickAccessCategory | null>(null);

    const handleFolderClick = (folder: Library) => {
        // Clear category selection when navigating to a folder
        setSelectedCategory(null);
        router.visit(index.url({ folder: folder.id }));
    };

    const handleFolderSelect = (folderId: number) => {
        // Clear category selection when navigating to a folder
        setSelectedCategory(null);
        router.visit(index.url({ folder: folderId }));
    };

    const handleCategorySelect = (category: QuickAccessCategory) => {
        setSelectedCategory(category);
        // TODO: Implement quick access navigation
        // For now, just update the selection
    };

    const handleItemSelect = (item: LibraryItem | null) => {
        setSelectedItem(item);
    };

    const handleDownload = (item: LibraryItem) => {
        if (item.type !== 'file') return;
        window.location.href = `/library/api/file/${item.id}/download`;
    };

    const handleToggleFavorite = async (item: LibraryItem) => {
        try {
            await axios.post(favorite.url(), {
                type: item.type,
                id: item.id,
            });
            message.success(item.is_favorite ? 'Removed from favorites' : 'Added to favorites');
            // Update selected item state
            if (selectedItem?.id === item.id && selectedItem?.type === item.type) {
                setSelectedItem({
                    ...item,
                    is_favorite: !item.is_favorite,
                });
            }
            setRefreshKey((prev) => prev + 1);
        } catch {
            message.error('Failed to update favorite status');
        }
    };

    // Determine if we're viewing a folder or a quick access category
    const isViewingFolder = selectedCategory === null;
    const currentFolderId = isViewingFolder ? currentFolder.id : null;

    const sidebar = (
        <LibrarySidebar
            currentFolderId={currentFolderId}
            selectedCategory={selectedCategory}
            onFolderSelect={handleFolderSelect}
            onCategorySelect={handleCategorySelect}
        />
    );

    const preview = (
        <PreviewPanel
            item={selectedItem}
            onDownload={handleDownload}
            onToggleFavorite={handleToggleFavorite}
        />
    );

    return (
        <LibraryLayout
            sidebar={sidebar}
            preview={preview}
        >
            <Head title="Library" />

            <LibraryToolbar
                breadcrumbs={breadcrumbs}
                onNewFolder={() => setShowCreateFolder(true)}
                onUpload={() => setShowUploadFiles(true)}
            />

            <div style={{ flex: 1, overflow: 'auto', padding: `0 ${token.paddingXS}px` }}>
                {viewMode === 'grid' ? (
                    <LibraryGrid
                        key={`grid-${refreshKey}`}
                        parentId={currentFolder.id}
                        onFolderClick={handleFolderClick}
                        onItemSelect={handleItemSelect}
                    />
                ) : (
                    <LibraryList
                        key={`list-${refreshKey}`}
                        parentId={currentFolder.id}
                        onFolderClick={handleFolderClick}
                        onItemSelect={handleItemSelect}
                    />
                )}
            </div>

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
        </LibraryLayout>
    );
}
