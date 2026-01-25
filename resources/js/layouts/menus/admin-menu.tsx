import { dashboard as adminDashboard } from '@/routes/admin';
import { index as libraryIndex } from '@/routes/library';
import { type NavGroup, type NavItem } from '@/types';

// Dashboard is standalone (outside groups)
export const adminMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard(),
        icon: 'dashboard',
    },
];

// Section groupings for admin sidebar
export const adminNavGroups: NavGroup[] = [
    {
        title: 'Content',
        items: [
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
        ],
    },
    {
        title: 'System',
        items: [
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
        ],
    },
];

export const adminFooterNavItems: NavItem[] = [];
