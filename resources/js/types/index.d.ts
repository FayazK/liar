import type { IconName } from '@/components/ui/Icon';
import { InertiaLinkProps } from '@inertiajs/react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: IconName | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    avatar_url?: string;
    avatar_thumb_url?: string;
    bio?: string;
    timezone: string;
    locale: string;
    is_active: boolean;
    last_login_at?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    full_name: string; // Computed attribute from Laravel
    initials: string; // Computed attribute from Laravel
    [key: string]: string | number | boolean | null | undefined; // Required for DataTable generic constraint
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    path: string;
}

export interface LaravelPaginatedResponse<T = unknown> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

// Re-export DataTable types from dedicated module
export type {
    BooleanFilterConfig,
    CustomFilterConfig,
    DataTableColumn,
    DataTableError,
    DataTableFilters,
    DataTableProps,
    DataTableQueryParams,
    DateRangeFilterConfig,
    FilterConfig,
    SelectFilterConfig,
    SortState,
} from './datatable';
