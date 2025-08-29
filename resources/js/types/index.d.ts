import { InertiaLinkProps } from '@inertiajs/react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

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
    icon?: ForwardRefExoticComponent<Omit<AntdIconProps, 'ref'> & RefAttributes<HTMLSpanElement>> | null;
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
    avatar?: string;
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
    [key: string]: unknown; // This allows for additional properties...
}
