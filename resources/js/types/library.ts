// ============================================================================
// Core Types
// ============================================================================

export interface Library {
    id: number;
    user_id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    file_count: number;
    total_size: number;
    total_size_human: string;
    is_root: boolean;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface LibraryFile {
    id: number;
    uuid?: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    size_human: string;
    is_favorite: boolean;
    folder_id?: number;
    folder_name?: string;
    created_at: string;
    updated_at?: string;
    url?: string;
    thumbnail_url?: string | null;
}

export interface BreadcrumbItem {
    id: number;
    name: string;
    parent_id: number | null;
}

// ============================================================================
// Grid/List Item Types
// ============================================================================

export interface FolderItem {
    id: number;
    type: 'folder';
    name: string;
    color?: string;
    file_count?: number;
    total_size_human?: string;
    is_favorite?: boolean;
    created_at: string;
    updated_at?: string;
}

export interface FileItem {
    id: number;
    type: 'file';
    name: string;
    file_name?: string;
    mime_type?: string;
    size?: number;
    size_human?: string;
    is_favorite?: boolean;
    folder_id?: number;
    folder_name?: string;
    thumbnail_url?: string | null;
    created_at: string;
    updated_at?: string;
}

export type LibraryItem = FolderItem | FileItem;

// ============================================================================
// Folder Tree Types
// ============================================================================

export interface FolderTreeNode {
    id: number;
    name: string;
    parent_id: number | null;
    has_children: boolean;
    file_count: number;
    is_favorite: boolean;
    color?: string;
    children?: FolderTreeNode[] | null;
}

export interface FolderTreeResponse {
    tree: FolderTreeNode[];
}

export interface FolderChildrenResponse {
    children: FolderTreeNode[];
}

// ============================================================================
// Quick Access Types
// ============================================================================

export type QuickAccessCategory = 'recent' | 'favorites' | 'documents' | 'images' | 'videos' | 'audio' | 'archives';

export interface QuickAccessItem {
    key: QuickAccessCategory;
    label: string;
    icon: string;
}

export interface QuickAccessResponse {
    files: FileItem[];
    folders?: FolderItem[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
    };
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface LibraryItemsResponse {
    folders: FolderItem[];
    files: FileItem[];
}

export interface ToggleFavoriteRequest {
    type: 'file' | 'folder';
    id: number;
}

export interface ToggleFavoriteResponse {
    message: string;
    is_favorite: boolean;
}

// ============================================================================
// Page Props
// ============================================================================

export interface LibraryPageProps {
    currentFolder: Library;
    breadcrumbs: BreadcrumbItem[];
}

// ============================================================================
// View & Sort Types (re-exported from store)
// ============================================================================

export type ViewMode = 'grid' | 'list';
export type SortField = 'name' | 'date' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';
