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
    created_at: string;
    updated_at: string;
}

export interface LibraryFile {
    id: number;
    uuid: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    size_human: string;
    created_at: string;
    url?: string;
}

export interface BreadcrumbItem {
    id: number;
    name: string;
    parent_id: number | null;
}

export interface LibraryPageProps {
    currentFolder: Library;
    breadcrumbs: BreadcrumbItem[];
}
