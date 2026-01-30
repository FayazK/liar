import type { JSONContent } from './editor';

// ============================================================================
// Enums
// ============================================================================

export type PostType = 'blog_post' | 'page';

export type PostStatus = 'draft' | 'published' | 'archived';

// ============================================================================
// Core Types
// ============================================================================

export interface PostAuthor {
    id: number;
    full_name: string;
    avatar_thumb_url?: string | null;
}

export interface PostTaxonomy {
    id: number;
    name: string;
    slug: string;
}

export interface PostSupports {
    categories: boolean;
    tags: boolean;
    featured_image: boolean;
    excerpt: boolean;
    seo: boolean;
    author: boolean;
}

export interface Post {
    id: number;
    type: PostType;
    type_label: string;
    title: string;
    slug: string;
    content: JSONContent | null;
    excerpt: string | null;
    status: PostStatus;
    status_label: string;
    status_color: string;
    author_id: number;
    author?: PostAuthor;
    meta_title: string | null;
    meta_description: string | null;
    featured_image_url: string | null;
    featured_image_thumb_url: string | null;
    category_ids?: number[];
    tag_ids?: number[];
    categories?: PostTaxonomy[];
    tags?: PostTaxonomy[];
    supports: PostSupports;
    is_published: boolean;
    is_draft: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // Required for DataTable generic constraint
}

// ============================================================================
// Form Types
// ============================================================================

export interface PostFormValues {
    title: string;
    slug?: string;
    content?: JSONContent | null;
    excerpt?: string;
    status?: PostStatus;
    author_id: number;
    meta_title?: string;
    meta_description?: string;
    published_at?: string | null;
    category_ids?: number[];
    tag_ids?: number[];
    featured_image?: File | null;
    remove_featured_image?: boolean;
}

// ============================================================================
// Taxonomy Tree Types
// ============================================================================

export interface CategoryTreeNode {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    children?: CategoryTreeNode[];
}

export interface TagOption {
    id: number;
    name: string;
    slug: string;
}

export interface AuthorOption {
    id: number;
    name: string;
    avatar_thumb_url?: string | null;
}

// ============================================================================
// Page Props
// ============================================================================

export interface PostIndexPageProps {
    postType: PostType;
    postTypeLabel: string;
    [key: string]: unknown;
}

export interface PostCreatePageProps {
    postType: PostType;
    postTypeLabel: string;
    supports: string[];
    categories: CategoryTreeNode[];
    tags: TagOption[];
    authors: AuthorOption[];
    [key: string]: unknown;
}

export interface PostEditPageProps {
    post: Post;
    postType: PostType;
    postTypeLabel: string;
    supports: string[];
    categories: CategoryTreeNode[];
    tags: TagOption[];
    authors: AuthorOption[];
    [key: string]: unknown;
}

// ============================================================================
// Post Type Config
// ============================================================================

export interface PostTypeConfig {
    label: string;
    plural_label: string;
    supports: string[];
    icon: string;
    description: string;
}

// ============================================================================
// Status Options
// ============================================================================

export const POST_STATUS_OPTIONS: { value: PostStatus; label: string; color: string }[] = [
    { value: 'draft', label: 'Draft', color: 'default' },
    { value: 'published', label: 'Published', color: 'success' },
    { value: 'archived', label: 'Archived', color: 'warning' },
];
