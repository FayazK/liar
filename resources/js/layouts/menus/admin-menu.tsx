import { dashboard } from '@/routes';
import { index as libraryIndex } from '@/routes/library';
import { type NavItem } from '@/types';
import {
    BarChartOutlined,
    BookOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    FolderOutlined,
    GithubOutlined,
    SecurityScanOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';

export const adminMainNavItems: NavItem[] = [
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
    {
        title: 'User Management',
        href: '/admin/users',
        icon: UsergroupAddOutlined,
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChartOutlined,
    },
    {
        title: 'Database',
        href: '/admin/database',
        icon: DatabaseOutlined,
    },
    {
        title: 'Security',
        href: '/admin/security',
        icon: SecurityScanOutlined,
    },
    {
        title: 'System Settings',
        href: '/admin/settings',
        icon: SettingOutlined,
    },
];

export const adminFooterNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: GithubOutlined,
    },
    {
        title: 'Admin Docs',
        href: 'https://laravel.com/docs/admin',
        icon: BookOutlined,
    },
];
