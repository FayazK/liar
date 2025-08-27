import { dashboard } from '@/routes';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    Layout, 
    Menu, 
    Breadcrumb, 
    Dropdown, 
    Avatar, 
    Button, 
    Space,
    Typography,
    theme
} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    GithubOutlined,
    BookOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { type ReactNode, useState } from 'react';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useToken } = theme;

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: DashboardOutlined,
    },
];

const footerNavItems: NavItem[] = [
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

export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: () => {
                // Handle logout
                window.location.href = '/logout';
            },
        },
    ];

    const menuItems = [
        ...mainNavItems.map(item => ({
            key: typeof item.href === 'string' ? item.href : item.href.url,
            icon: item.icon ? <item.icon /> : null,
            label: (
                <Link href={item.href} prefetch>
                    {item.title}
                </Link>
            ),
        })),
        {
            type: 'divider' as const,
        },
        ...footerNavItems.map(item => ({
            key: typeof item.href === 'string' ? item.href : item.href.url,
            icon: item.icon ? <item.icon /> : null,
            label: (
                <a href={typeof item.href === 'string' ? item.href : item.href.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                </a>
            ),
        })),
    ];

    const breadcrumbItems = [
        {
            title: (
                <Link href={dashboard()}>
                    <HomeOutlined />
                </Link>
            ),
        },
        ...breadcrumbs.map(crumb => ({
            title: crumb.href ? (
                <Link href={crumb.href}>{crumb.title}</Link>
            ) : (
                <Text>{crumb.title}</Text>
            ),
        })),
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed}
                style={{
                    background: token.colorBgContainer,
                    borderRight: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                <div style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '0' : '0 16px',
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}>
                    {!collapsed ? (
                        <Link href={dashboard()} prefetch>
                            <Text strong style={{ fontSize: '18px', color: token.colorPrimary }}>
                                Liar
                            </Text>
                        </Link>
                    ) : (
                        <Link href={dashboard()} prefetch>
                            <Text strong style={{ fontSize: '20px', color: token.colorPrimary }}>
                                L
                            </Text>
                        </Link>
                    )}
                </div>
                
                <Menu
                    mode="inline"
                    items={menuItems}
                    style={{
                        height: 'calc(100vh - 64px)',
                        borderRight: 0,
                        background: 'transparent',
                    }}
                />
            </Sider>
            
            <Layout>
                <Header style={{
                    padding: '0 16px',
                    background: token.colorBgContainer,
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Space>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px' }}
                        />
                        
                        {breadcrumbItems.length > 1 && (
                            <Breadcrumb items={breadcrumbItems} />
                        )}
                    </Space>

                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        arrow
                    >
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar 
                                src={auth.user.avatar} 
                                icon={<UserOutlined />}
                                size="small"
                            />
                            <Text>{auth.user.name}</Text>
                        </Space>
                    </Dropdown>
                </Header>
                
                <Content style={{
                    margin: '16px',
                    padding: '16px',
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    overflow: 'auto',
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
