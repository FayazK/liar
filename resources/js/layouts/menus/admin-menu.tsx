import { dashboard as adminDashboard } from '@/routes/admin';
import { index as blogPostIndex } from '@/routes/admin/posts/blog_post';
import { index as pageIndex } from '@/routes/admin/posts/page';
import { index as rolesIndex } from '@/routes/admin/roles';
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
                title: 'Posts',
                href: blogPostIndex.url(),
                icon: 'file-text',
            },
            {
                title: 'Pages',
                href: pageIndex.url(),
                icon: 'file',
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
        ],
    },
    {
        title: 'Access Control',
        items: [
            {
                title: 'Roles',
                href: rolesIndex.url(),
                icon: 'shield',
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
