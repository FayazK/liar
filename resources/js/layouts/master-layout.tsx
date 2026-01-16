import GlobalSearch, { useGlobalSearch } from '@/components/global-search';
import NotificationsCenter from '@/components/notifications-center';
import { Icon } from '@/components/ui/Icon';
import UserDropdown from '@/components/user-dropdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import { dashboard } from '@/routes';
import { type NavGroup, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { MenuProps } from 'antd';
import { Badge, Button, Drawer, Flex, Input, Layout, Menu, theme, Typography } from 'antd';
import { type ReactNode } from 'react';
import logo from '../../images/logo.svg';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useToken } = theme;

interface MasterLayoutProps {
    children: ReactNode;
    actions?: ReactNode;
    mainNavItems: NavItem[];
    navGroups?: NavGroup[];
    footerNavItems?: NavItem[];
}

/**
 * Builds menu items with badge and submenu support
 */
function buildMenuItems(items: NavItem[], onNavigate?: () => void): MenuProps['items'] {
    return items.map((item) => {
        const key = typeof item.href === 'string' ? item.href : item.href.url;
        const hasChildren = item.children && item.children.length > 0;

        // If has children, create submenu (no link wrapper - clicking expands submenu)
        if (hasChildren) {
            const parentLabel = (
                <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                    <span>{item.title}</span>
                    {item.badge !== undefined && <Badge count={item.badge} size="small" style={{ marginLeft: 8 }} />}
                </Flex>
            );

            return {
                key,
                icon: item.icon ? <Icon name={item.icon} size={18} /> : null,
                label: parentLabel,
                children: buildMenuItems(item.children!, onNavigate),
            };
        }

        // Leaf items with link and optional badge
        const labelContent = (
            <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                <Link href={item.href} prefetch onClick={onNavigate}>
                    {item.title}
                </Link>
                {item.badge !== undefined && <Badge count={item.badge} size="small" style={{ marginLeft: 8 }} />}
            </Flex>
        );

        return {
            key,
            icon: item.icon ? <Icon name={item.icon} size={18} /> : null,
            label: labelContent,
        };
    });
}

export default function MasterLayout({ children, actions, mainNavItems, navGroups = [], footerNavItems = [] }: MasterLayoutProps) {
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

    // Build menu items with badge support
    // When collapsed (and not mobile), hide group labels
    const showGroupLabels = !collapsed || isMobile;

    const menuItems: MenuProps['items'] = [
        ...(buildMenuItems(mainNavItems, isMobile ? closeMobileMenu : undefined) ?? []),
        ...navGroups.map((group) => ({
            key: `group-${group.title.toLowerCase().replace(/\s+/g, '-')}`,
            label: showGroupLabels ? group.title : null,
            type: 'group' as const,
            children: buildMenuItems(group.items, isMobile ? closeMobileMenu : undefined),
        })),
        ...(footerNavItems.length > 0 ? [{ type: 'divider' as const }] : []),
        ...footerNavItems.map((item) => ({
            key: typeof item.href === 'string' ? item.href : item.href.url,
            icon: item.icon ? <Icon name={item.icon} size={18} /> : null,
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

    // Sidebar content with logo header and menu
    const sidebarContent = (
        <Flex vertical style={{ height: '100%' }}>
            {/* Logo Section */}
            <Flex
                align="center"
                justify={collapsed ? 'center' : 'flex-start'}
                style={{
                    height: '56px',
                    padding: collapsed ? 0 : `0 ${token.paddingMD}px`,
                    flexShrink: 0,
                }}
            >
                <Link href={dashboard()} prefetch>
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
                        {!collapsed && (
                            <Text strong style={{ fontSize: '20px', color: token.colorText }}>
                                Liar
                            </Text>
                        )}
                    </Flex>
                </Link>
            </Flex>

            {/* Menu Section */}
            <Flex vertical style={{ flex: 1, overflow: 'auto', paddingTop: token.paddingXS }}>
                <Menu
                    mode="inline"
                    inlineIndent={16}
                    items={menuItems}
                    style={{
                        width: '100%',
                        borderRight: 0,
                        background: 'transparent',
                    }}
                />
            </Flex>
        </Flex>
    );

    // Mobile drawer content (includes logo at top)
    const mobileDrawerContent = (
        <Flex vertical style={{ height: '100%' }}>
            {/* Logo Section for mobile */}
            <Flex
                align="center"
                style={{
                    height: '56px',
                    padding: `0 ${token.paddingMD}px`,
                    flexShrink: 0,
                }}
            >
                <Link href={dashboard()} prefetch onClick={closeMobileMenu}>
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
            </Flex>

            {/* Menu Section */}
            <Flex vertical style={{ flex: 1, overflow: 'auto', paddingTop: token.paddingXS }}>
                <Menu
                    mode="inline"
                    inlineIndent={16}
                    items={menuItems}
                    style={{
                        width: '100%',
                        borderRight: 0,
                        background: 'transparent',
                    }}
                />
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
                {/* Desktop Sidebar - full height from top */}
                {!isMobile && (
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        width={200}
                        collapsedWidth={80}
                        style={{
                            background: 'transparent',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 11,
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
                            {mobileDrawerContent}
                        </nav>
                    </Drawer>
                )}

                <Layout
                    style={{
                        marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
                        transition: 'margin-left 0.2s',
                        background: token.colorBgLayout,
                    }}
                >
                    {/* Header - spans content area only */}
                    <Header
                        style={{
                            padding: `0 ${token.paddingMD}px`,
                            background: token.colorBgLayout,
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            left: isMobile ? 0 : collapsed ? 80 : 200,
                            zIndex: 10,
                            height: '56px',
                            transition: 'left 0.2s',
                        }}
                    >
                        <Flex justify="space-between" align="center" style={{ height: '100%' }}>
                            {/* Left Section: Toggle + Search */}
                            <Flex align="center" gap="middle">
                                {/* Sidebar Toggle */}
                                <Button
                                    type="text"
                                    icon={
                                        isMobile ? (
                                            <Icon name="menu" size={18} />
                                        ) : collapsed ? (
                                            <Icon name="menu-unfold" size={18} />
                                        ) : (
                                            <Icon name="menu-fold" size={18} />
                                        )
                                    }
                                    onClick={toggleCollapsed}
                                    aria-label={isMobile ? 'Toggle navigation menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                />

                                {/* Inline Search Bar (desktop only) */}
                                {!isMobile && (
                                    <Input
                                        prefix={<Icon name="search" size={16} style={{ color: token.colorTextPlaceholder }} />}
                                        placeholder="Type to search..."
                                        onClick={openSearch}
                                        readOnly
                                        style={{
                                            width: 200,
                                            cursor: 'pointer',
                                        }}
                                    />
                                )}
                            </Flex>

                            {/* Right Section: Actions + Notifications + User */}
                            <Flex align="center" gap="small">
                                {/* Page-specific Actions */}
                                {actions}

                                {/* Notifications */}
                                <NotificationsCenter />

                                {/* User Avatar Dropdown */}
                                <UserDropdown user={auth.user} />
                            </Flex>
                        </Flex>
                    </Header>

                    {/* Main Content Area */}
                    <Content
                        id="main-content"
                        role="main"
                        style={{
                            marginTop: '56px',
                            padding: token.paddingMD,
                            minHeight: `calc(100vh - 56px)`,
                        }}
                    >
                        {/* Content Wrapper with max-width */}
                        <div>{children}</div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}
