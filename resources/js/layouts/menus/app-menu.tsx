import { dashboard } from '@/routes';
import { index as libraryIndex } from '@/routes/library';
import { type NavGroup, type NavItem } from '@/types';

// Dashboard is standalone (outside groups)
export const appMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: 'dashboard',
    },
];

// Section groupings for sidebar
export const appNavGroups: NavGroup[] = [
    {
        title: 'Pages',
        items: [
            {
                title: 'Library',
                href: libraryIndex(),
                icon: 'folder',
            },
        ],
    },
    {
        title: 'Misc',
        items: [
            {
                title: 'Settings',
                href: '/settings',
                icon: 'settings',
                children: [
                    { title: 'Account', href: '/settings/account', icon: null },
                ],
            },
        ],
    },
];

export const appFooterNavItems: NavItem[] = [];
