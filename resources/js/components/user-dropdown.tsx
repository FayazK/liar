import { Icon } from '@/components/ui/Icon';
import type { User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Avatar, Divider, Dropdown, Flex, theme, Typography } from 'antd';
import { useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;

interface UserDropdownProps {
    user: User;
}

interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    danger?: boolean;
}

export default function UserDropdown({ user }: UserDropdownProps) {
    const { token } = useToken();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        setOpen(false);
        router.post('/logout');
    };

    const handleMenuClick = (href?: string, onClick?: () => void) => {
        setOpen(false);
        if (onClick) {
            onClick();
        }
    };

    const menuSections: MenuItem[][] = [
        [
            { key: 'account', icon: <Icon name="user" size={18} />, label: 'My account', href: '/settings/account' },
            { key: 'settings', icon: <Icon name="settings" size={18} />, label: 'Settings', href: '/settings' },
            { key: 'billing', icon: <Icon name="credit-card" size={18} />, label: 'Billing', href: '/settings/billing' },
        ],
        [
            { key: 'team', icon: <Icon name="users-group" size={18} />, label: 'Manage team', href: '/settings/team' },
            { key: 'customization', icon: <Icon name="palette" size={18} />, label: 'Customization', href: '/settings/appearance' },
            { key: 'add-team', icon: <Icon name="user-plus" size={18} />, label: 'Add team account', href: '/settings/team/add' },
        ],
        [{ key: 'logout', icon: <Icon name="logout" size={18} />, label: 'Logout', onClick: handleLogout, danger: true }],
    ];

    const renderMenuItem = (item: MenuItem) => {
        const content = (
            <Flex
                align="center"
                gap={12}
                style={{
                    padding: `${token.paddingXS}px ${token.paddingSM}px`,
                    borderRadius: token.borderRadius,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    color: item.danger ? token.colorError : token.colorText,
                }}
                className="user-dropdown-item"
                onClick={() => handleMenuClick(item.href, item.onClick)}
            >
                <span style={{ color: item.danger ? token.colorError : token.colorTextSecondary, display: 'flex' }}>{item.icon}</span>
                <Text style={{ color: item.danger ? token.colorError : 'inherit' }}>{item.label}</Text>
            </Flex>
        );

        if (item.href) {
            return (
                <Link key={item.key} href={item.href} style={{ textDecoration: 'none' }}>
                    {content}
                </Link>
            );
        }

        return <div key={item.key}>{content}</div>;
    };

    const dropdownContent = (
        <div
            style={{
                backgroundColor: token.colorBgElevated,
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadowSecondary,
                border: `1px solid ${token.colorBorderSecondary}`,
                minWidth: 240,
                overflow: 'hidden',
            }}
        >
            {/* User Header */}
            <Flex gap={12} align="center" style={{ padding: token.paddingMD }}>
                <div style={{ position: 'relative' }}>
                    <Avatar src={user.avatar_url} size={44} icon={<Icon name="user" size={24} />} />
                    {/* Online status indicator */}
                    <span
                        style={{
                            position: 'absolute',
                            bottom: 2,
                            left: 2,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: token.colorSuccess,
                            border: `2px solid ${token.colorBgElevated}`,
                        }}
                    />
                </div>
                <Flex vertical gap={0}>
                    <Text strong style={{ fontSize: 14, lineHeight: 1.4 }}>
                        {user.full_name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.4 }}>
                        {user.email}
                    </Text>
                </Flex>
            </Flex>

            <Divider style={{ margin: 0 }} />

            {/* Menu Sections */}
            <Flex vertical style={{ padding: token.paddingXS }}>
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        {section.map((item) => renderMenuItem(item))}
                        {sectionIndex < menuSections.length - 1 && <Divider style={{ margin: `${token.marginXS}px 0` }} />}
                    </div>
                ))}
            </Flex>

            {/* Hover styles */}
            <style>{`
                .user-dropdown-item:hover {
                    background-color: ${token.colorBgTextHover};
                }
            `}</style>
        </div>
    );

    return (
        <Dropdown
            popupRender={() => dropdownContent}
            trigger={['click']}
            placement="bottomRight"
            open={open}
            onOpenChange={setOpen}
        >
            <Avatar src={user.avatar_thumb_url} icon={<Icon name="user" size={16} />} style={{ cursor: 'pointer' }} />
        </Dropdown>
    );
}
