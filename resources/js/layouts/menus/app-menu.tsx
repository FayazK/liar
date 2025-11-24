import { type NavItem } from '@/types';
import { dashboard, appearance } from '@/routes';
import profile from '@/routes/profile';
import password from '@/routes/password';
import {
    DashboardOutlined,
    GithubOutlined,
    BookOutlined,
    SettingOutlined,
    UserOutlined,
    LockOutlined,
    BgColorsOutlined,
} from '@ant-design/icons';

export const appMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: DashboardOutlined,
    },
];

// Settings submenu items
export const appSettingsNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: profile.edit(),
        icon: UserOutlined,
    },
    {
        title: 'Password',
        href: password.edit(),
        icon: LockOutlined,
    },
    {
        title: 'Appearance',
        href: appearance(),
        icon: BgColorsOutlined,
    },
];

export const appFooterNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: GithubOutlined,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOutlined,
    },
];