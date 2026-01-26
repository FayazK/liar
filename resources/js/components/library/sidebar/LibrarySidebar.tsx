import { useLibraryState } from '@/hooks/use-library-state';
import type { QuickAccessCategory } from '@/types/library';
import { Divider, theme } from 'antd';
import FolderTree from './FolderTree';
import QuickAccess from './QuickAccess';

const { useToken } = theme;

interface LibrarySidebarProps {
    currentFolderId: number | null;
    selectedCategory: QuickAccessCategory | null;
    onFolderSelect: (folderId: number) => void;
    onCategorySelect: (category: QuickAccessCategory) => void;
}

export default function LibrarySidebar({ currentFolderId, selectedCategory, onFolderSelect, onCategorySelect }: LibrarySidebarProps) {
    const { token } = useToken();
    const { librarySidebarCollapsed } = useLibraryState();

    if (librarySidebarCollapsed) {
        return null;
    }

    return (
        <div
            style={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <QuickAccess selectedCategory={selectedCategory} onCategorySelect={onCategorySelect} />

            <Divider style={{ margin: `${token.marginXS}px ${token.marginMD}px` }} />

            <FolderTree currentFolderId={currentFolderId} onFolderSelect={onFolderSelect} />
        </div>
    );
}
