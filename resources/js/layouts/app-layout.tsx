import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Layout,
    Menu,
    Dropdown,
    Avatar,
    Button,
    Flex,
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
    BookOutlined
} from '@ant-design/icons';
import { type ReactNode, useState } from 'react';
import profile from '@/routes/profile';
import logo from '../../images/logo.svg'

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { useToken } = theme;

interface AppLayoutProps {
    children: ReactNode;
    pageTitle?: string;
    actions?: ReactNode;
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

export default function AppLayout({ children, pageTitle, actions }: AppLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link href={profile.edit().url}>Profile</Link>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <Link href={profile.edit().url}>Settings</Link>,
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

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: token.colorBgContainer,
                    borderRight: `1px solid ${token.colorBorderSecondary}`,
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <Flex vertical style={{ height: '100%' }}>
                    {/* Logo Section */}
                    <Flex
                        align="center"
                        justify={collapsed ? 'center' : 'flex-start'}
                        style={{
                            height: '64px',
                            padding: collapsed ? '0' : '0 16px',
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        }}
                    >
                        {!collapsed ? (
                            <Link href={dashboard()} prefetch>
                                <Flex align="center" gap="small" >
                                    <img
                                        src={logo}
                                        alt="Liar Logo"
                                        style={{
                                            height: '32px',
                                            width: '32px'
                                        }}
                                    />
                                    <Text strong style={{ fontSize: '24px', color: token.colorPrimary }}>
                                        Liar
                                    </Text>
                                </Flex>
                            </Link>
                        ) : (
                            <Link href={dashboard()} prefetch>
                                <img
                                    src="/images/logo.svg"
                                    alt="Liar Logo"
                                    style={{
                                        height: '28px',
                                        width: '28px'
                                    }}
                                />
                            </Link>
                        )}
                    </Flex>

                    {/* Menu Section - Takes up remaining space */}
                    <Flex flex={1} style={{ overflow: 'auto' }}>
                        <Menu
                            mode="inline"
                            items={menuItems}
                            style={{
                                width: '100%',
                                borderRight: 0,
                                background: 'transparent',
                            }}
                        />
                    </Flex>

                    {/* Avatar Section - Fixed at bottom */}
                    <Flex
                        align="center"
                        justify="center"
                        style={{
                            padding: collapsed ? '16px 8px' : '16px',
                            borderTop: `1px solid ${token.colorBorderSecondary}`,
                            minHeight: '64px',
                        }}
                    >
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="top"
                            arrow
                        >
                            <Flex
                                align="center"
                                gap="small"
                                style={{
                                    cursor: 'pointer',
                                    width: collapsed ? 'auto' : '100%',
                                    justifyContent: collapsed ? 'center' : 'flex-start'
                                }}
                            >
                                <Avatar
                                    src={auth.user.avatar}
                                    icon={<UserOutlined />}
                                    size="small"
                                />
                                {!collapsed && <Text>{auth.user.name}</Text>}
                            </Flex>
                        </Dropdown>
                    </Flex>
                </Flex>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
                <Header style={{
                    padding: '16px 10px',
                    background: token.colorBgContainer,
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    left: collapsed ? 80 : 200,
                    zIndex: 1,
                    transition: 'left 0.2s',
                    height: '64px',
                }}>
                    <Flex justify="space-between" align="center" style={{ height: '32px' }}>
                        {/* Left Section: Collapse Button and Title */}
                        <Flex align="center" gap="middle" flex={1}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{ fontSize: '16px' }}
                            />
                            {pageTitle && (
                                <Title
                                    level={4}
                                    style={{
                                        margin: 0,
                                        color: token.colorText,
                                        fontWeight: 600,
                                    }}
                                >
                                    {pageTitle}
                                </Title>
                            )}
                        </Flex>

                        {/* Right Section: Action Buttons */}
                        {actions && (
                            <Flex align="center" style={{ marginLeft: '16px' }}>
                                {actions}
                            </Flex>
                        )}
                    </Flex>
                </Header>

                <Content style={{
                    margin: '74px 10px 10px',
                    padding: '16px',
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    overflow: 'auto',
                    minHeight: 'calc(100vh - 112px)',
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
