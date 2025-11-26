import GlobalSearch, { useGlobalSearch } from '@/components/global-search';
import NotificationsCenter from '@/components/notifications-center';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import { dashboard } from '@/routes';
import { type NavGroup, type NavItem, type SharedData } from '@/types';
import { LogoutOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, SearchOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Link, router, usePage } from '@inertiajs/react';
import { Avatar, Button, Drawer, Dropdown, Flex, Layout, Menu, theme, Typography } from 'antd';
import { type ReactNode } from 'react';
import logo from '../../images/logo.svg';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { useToken } = theme;

interface MasterLayoutProps {
    children: ReactNode;
    pageTitle?: string;
    actions?: ReactNode;
    mainNavItems: NavItem[];
    navGroups?: NavGroup[];
    footerNavItems?: NavItem[];
}

export default function MasterLayout({ children, pageTitle, actions, mainNavItems, navGroups = [], footerNavItems = [] }: MasterLayoutProps) {
    const { collapsed, toggleCollapsed } = useSidebarState();
    const isMobile = useIsMobile();
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();
    const { isOpen: isSearchOpen, openSearch, closeSearch } = useGlobalSearch();

    // Mobile drawer state uses sidebar collapsed state
    const isMobileMenuOpen = isMobile && !collapsed;
    const closeMobileMenu = () => {
        if (isMobile) {
            toggleCollapsed();
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const userMenuItems = [
        {
            key: 'account',
            icon: <SettingOutlined />,
            label: <Link href="/settings/account">Account</Link>,
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sign Out',
            onClick: handleLogout,
        },
    ];

    const menuItems = [
        ...mainNavItems.map((item) => ({
            key: typeof item.href === 'string' ? item.href : item.href.url,
            icon: item.icon ? <item.icon /> : null,
            label: (
                <Link href={item.href} prefetch onClick={isMobile ? closeMobileMenu : undefined}>
                    {item.title}
                </Link>
            ),
        })),
        ...navGroups.map((group) => ({
            key: `group-${group.title.toLowerCase().replace(/\s+/g, '-')}`,
            label: group.title,
            type: 'group' as const,
            children: group.items.map((item) => ({
                key: typeof item.href === 'string' ? item.href : item.href.url,
                icon: item.icon ? <item.icon /> : null,
                label: (
                    <Link href={item.href} prefetch onClick={isMobile ? closeMobileMenu : undefined}>
                        {item.title}
                    </Link>
                ),
            })),
        })),
        ...(footerNavItems.length > 0 ? [{ type: 'divider' as const }] : []),
        ...footerNavItems.map((item) => ({
            key: typeof item.href === 'string' ? item.href : item.href.url,
            icon: item.icon ? <item.icon /> : null,
            label: (
                <a
                    href={typeof item.href === 'string' ? item.href : item.href.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} (opens in new tab)`}
                >
                    {item.title}
                </a>
            ),
        })),
    ];

    // Sidebar content (shared between fixed sidebar and mobile drawer)
    const sidebarContent = (
        <Flex vertical justify="space-between" style={{ height: '100%' }}>
            {/* Top Section - Logo and Menu */}
            <Flex vertical style={{ overflow: 'auto', minHeight: 0 }}>
                {/* Logo Section - Reduced from 64px to 56px */}
                <Flex
                    align="center"
                    justify={collapsed && !isMobile ? 'center' : 'flex-start'}
                    style={{
                        height: '56px',
                        padding: collapsed && !isMobile ? '0' : `0 ${token.paddingMD}px`,
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        flexShrink: 0,
                    }}
                >
                    {!collapsed || isMobile ? (
                        <Link href={dashboard()} prefetch onClick={isMobile ? closeMobileMenu : undefined}>
                            <Flex align="center" gap="small">
                                <img
                                    src={logo}
                                    alt="Liar Logo"
                                    width="32"
                                    height="32"
                                    style={{
                                        height: '32px',
                                        width: '32px',
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
                                src={logo}
                                alt="Liar Logo"
                                width="28"
                                height="28"
                                style={{
                                    height: '28px',
                                    width: '28px',
                                }}
                            />
                        </Link>
                    )}
                </Flex>

                {/* Menu Section */}
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

            {/* Avatar Section - Reduced from 64px to 56px min-height */}
            <Flex
                align="center"
                justify="center"
                style={{
                    padding: collapsed && !isMobile ? `${token.paddingMD}px ${token.paddingXS}px` : `${token.paddingMD}px`,
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                    minHeight: '56px',
                    flexShrink: 0,
                }}
            >
                <Dropdown menu={{ items: userMenuItems }} placement="top" arrow>
                    <Flex
                        align="center"
                        gap="small"
                        style={{
                            cursor: 'pointer',
                            width: collapsed && !isMobile ? 'auto' : '100%',
                            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                        }}
                    >
                        <Avatar src={auth.user.avatar} icon={<UserOutlined />} />
                        {(!collapsed || isMobile) && (
                            <div style={{ lineHeight: '1.2' }}>
                                <Text strong>{auth.user.full_name}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {auth.user.email}
                                </Text>
                            </div>
                        )}
                    </Flex>
                </Dropdown>
            </Flex>
        </Flex>
    );

    return (
        <>
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    zIndex: 999,
                    padding: '8px 16px',
                    background: token.colorPrimary,
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: token.borderRadius,
                }}
                onFocus={(e) => {
                    e.currentTarget.style.left = '16px';
                    e.currentTarget.style.top = '16px';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.left = '-9999px';
                }}
            >
                Skip to main content
            </a>

            {/* Global Search Modal */}
            <GlobalSearch open={isSearchOpen} onClose={closeSearch} />

            <Layout style={{ minHeight: '100vh' }}>
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        width={200}
                        collapsedWidth={80}
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
                        <nav aria-label="Main navigation" style={{ height: '100%' }}>
                            {sidebarContent}
                        </nav>
                    </Sider>
                )}

                {/* Mobile Drawer */}
                {isMobile && (
                    <Drawer
                        placement="left"
                        onClose={closeMobileMenu}
                        open={isMobileMenuOpen}
                        closable={false}
                        width={280}
                        styles={{
                            body: { padding: 0, height: '100%' },
                        }}
                    >
                        <nav aria-label="Main navigation" style={{ height: '100%' }}>
                            {sidebarContent}
                        </nav>
                    </Drawer>
                )}

                <Layout
                    style={{
                        marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
                        transition: 'margin-left 0.2s',
                    }}
                >
                    {/* Header - Reduced from 64px to 56px */}
                    <Header
                        style={{
                            padding: `${token.paddingSM}px ${token.paddingMD}px`,
                            background: token.colorBgContainer,
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            left: isMobile ? 0 : collapsed ? 80 : 200,
                            zIndex: 10,
                            transition: 'left 0.2s',
                            height: '56px',
                        }}
                    >
                        <Flex justify="space-between" align="center" style={{ height: '100%' }}>
                            {/* Left Section: Collapse/Menu Button and Title */}
                            <Flex align="center" gap="middle" flex={1}>
                                <Button
                                    type="text"
                                    icon={isMobile ? <MenuOutlined /> : collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={toggleCollapsed}
                                    style={{ fontSize: '16px' }}
                                    aria-label={isMobile ? 'Toggle navigation menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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

                            {/* Right Section: Search, Notifications, Action Buttons */}
                            <Flex align="center" gap="small">
                                {/* Search Button */}
                                {!isMobile && (
                                    <Button
                                        type="text"
                                        icon={<SearchOutlined style={{ fontSize: '18px' }} />}
                                        onClick={openSearch}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '40px',
                                            width: '40px',
                                        }}
                                        aria-label="Open search (Ctrl+K)"
                                    />
                                )}

                                {/* Notifications */}
                                <NotificationsCenter />

                                {/* Page-specific Actions */}
                                {actions}
                            </Flex>
                        </Flex>
                    </Header>

                    {/* Main Content with max-width constraint */}
                    <Content
                        id="main-content"
                        role="main"
                        style={{
                            margin: `${56 + token.marginSM}px ${token.marginSM}px ${token.marginSM}px`,
                            padding: token.paddingLG,
                            background: token.colorBgContainer,
                            borderRadius: token.borderRadiusLG,
                            overflow: 'auto',
                            minHeight: `calc(100vh - ${56 + token.marginSM * 2 + 16}px)`,
                        }}
                    >
                        {/* Content Wrapper with max-width */}
                        <div
                            style={{
                                maxWidth: '1400px',
                                margin: '0 auto',
                                width: '100%',
                            }}
                        >
                            {/* Page Content */}
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}
