import { dashboard } from '@/routes';
import { index as libraryIndex } from '@/routes/library';
import { type NavItem } from '@/types';

export const appMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: 'dashboard',
    },
    {
        title: 'Library',
        href: libraryIndex(),
        icon: 'folder',
    },
];

export const appFooterNavItems: NavItem[] = [];
