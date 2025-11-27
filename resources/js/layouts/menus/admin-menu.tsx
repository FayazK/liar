import { dashboard as adminDashboard } from '@/routes/admin';
import { index as libraryIndex } from '@/routes/library';
import { type NavItem } from '@/types';

export const adminMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard(),
        icon: 'dashboard',
    },
    {
        title: 'Library',
        href: libraryIndex(),
        icon: 'folder',
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: 'users',
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: 'chart-bar',
    },
    {
        title: 'Database',
        href: '/admin/database',
        icon: 'database',
    },
    {
        title: 'Security',
        href: '/admin/security',
        icon: 'shield-check',
    },
    {
        title: 'System Settings',
        href: '/admin/settings',
        icon: 'settings',
    },
];

export const adminFooterNavItems: NavItem[] = [];
