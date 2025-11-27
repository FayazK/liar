import { dashboard } from '@/routes';
import { index as libraryIndex } from '@/routes/library';
import { type NavItem } from '@/types';
import { DashboardOutlined, FolderOutlined } from '@ant-design/icons';

export const appMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: DashboardOutlined,
    },
    {
        title: 'Library',
        href: libraryIndex(),
        icon: FolderOutlined,
    },
];

export const appFooterNavItems: NavItem[] = [];
