import { Icon } from '@/components/ui/Icon';
import { Badge, Button, Dropdown, Empty, Flex, theme, Typography } from 'antd';
import { useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;

interface Notification {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
}

// Mock notifications - replace with actual data from backend
const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Welcome to Liar!',
        description: 'Thanks for joining us. Explore the dashboard to get started.',
        timestamp: '2 hours ago',
        read: false,
        type: 'info',
    },
    {
        id: '2',
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
        timestamp: '1 day ago',
        read: true,
        type: 'success',
    },
];

export default function NotificationsCenter() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const { token } = useToken();

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return token.colorSuccess;
            case 'error':
                return token.colorError;
            case 'warning':
                return token.colorWarning;
            default:
                return token.colorInfo;
        }
    };

    const dropdownContent = (
        <div
            style={{
                width: '380px',
                maxHeight: '500px',
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorder}`,
            }}
        >
            {/* Header */}
            <Flex
                justify="space-between"
                align="center"
                style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${token.colorBorder}`,
                }}
            >
                <Text strong style={{ fontSize: '16px' }}>
                    Notifications
                </Text>
                {unreadCount > 0 && (
                    <Button type="text" size="small" onClick={markAllAsRead} style={{ fontSize: '12px' }}>
                        Mark all as read
                    </Button>
                )}
            </Flex>

            {/* Notifications List */}
            <div
                style={{
                    maxHeight: '400px',
                    overflow: 'auto',
                }}
            >
                {notifications.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications" style={{ padding: '32px' }} />
                ) : (
                    <Flex vertical>
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: item.read ? 'transparent' : token.colorPrimaryBg,
                                    borderLeft: `3px solid ${item.read ? 'transparent' : getTypeColor(item.type)}`,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                }}
                                onMouseEnter={(e) => {
                                    if (!item.read) {
                                        e.currentTarget.style.backgroundColor = token.colorBgTextHover;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = item.read ? 'transparent' : token.colorPrimaryBg;
                                }}
                            >
                                <Flex vertical style={{ flex: 1 }} gap="small">
                                    <Flex justify="space-between" align="flex-start">
                                        <Text
                                            strong={!item.read}
                                            style={{
                                                fontSize: '14px',
                                                flex: 1,
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                        <Flex gap="small">
                                            {!item.read && (
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<Icon name="check" size={14} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(item.id);
                                                    }}
                                                    title="Mark as read"
                                                    style={{
                                                        padding: '0 4px',
                                                        height: '20px',
                                                        minWidth: '20px',
                                                    }}
                                                />
                                            )}
                                            <Button
                                                type="text"
                                                size="small"
                                                danger
                                                icon={<Icon name="trash" size={14} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(item.id);
                                                }}
                                                title="Delete notification"
                                                style={{
                                                    padding: '0 4px',
                                                    height: '20px',
                                                    minWidth: '20px',
                                                }}
                                            />
                                        </Flex>
                                    </Flex>
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: '13px',
                                            lineHeight: '1.4',
                                        }}
                                    >
                                        {item.description}
                                    </Text>
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: '11px',
                                        }}
                                    >
                                        {item.timestamp}
                                    </Text>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div
                    style={{
                        padding: '8px 16px',
                        borderTop: `1px solid ${token.colorBorder}`,
                        textAlign: 'center',
                    }}
                >
                    <Button type="link" style={{ fontSize: '13px' }}>
                        View all notifications
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <Dropdown popupRender={() => dropdownContent} trigger={['click']} placement="bottomRight">
            <Badge count={unreadCount} size="small" offset={[-4, 4]}>
                <Button
                    type="text"
                    icon={<Icon name="bell" size={18} />}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '40px',
                        width: '40px',
                    }}
                    aria-label="Open notifications"
                />
            </Badge>
        </Dropdown>
    );
}
