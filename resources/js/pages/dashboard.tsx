import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { App, Avatar, Button, Card, Col, Dropdown, Flex, Progress, Row, Space, Statistic, Tag, theme, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();
    const { message } = App.useApp();

    // Sample ContentHeader configuration for demonstration
    const contentHeader: ContentHeaderProps = {
        primaryAction: {
            label: 'New Report',
            icon: 'plus',
            onClick: () => message.info('New report clicked!'),
        },
        breadcrumb: [
            { title: 'Home', href: '/' },
            { title: 'Dashboard', href: '/dashboard' },
        ],
        actionIcons: [
            { icon: 'refresh', tooltip: 'Refresh', onClick: () => window.location.reload() },
            { icon: 'download', tooltip: 'Export', onClick: () => message.info('Export clicked!') },
        ],
        infoTabs: [
            { key: 'users', icon: 'users', label: 'Users', value: 1234 },
            { key: 'revenue', icon: 'currency-dollar', label: 'Revenue', value: '$12.3k' },
            { key: 'orders', icon: 'shopping-cart', label: 'Orders', value: 56 },
        ],
    };

    const statsData = [
        {
            title: 'Total Users',
            value: 1234,
            prefix: <Icon name="users-group" color={token.colorPrimary} />,
            suffix: <Icon name="trending-up" color={token.colorSuccess} />,
            precision: 0,
        },
        {
            title: 'Revenue',
            value: 12340,
            prefix: <Icon name="currency-dollar" color={token.colorSuccess} />,
            suffix: <Icon name="trending-up" color={token.colorSuccess} />,
            precision: 2,
        },
        {
            title: 'Page Views',
            value: 56789,
            prefix: <Icon name="eye" color={token.colorInfo} />,
            suffix: <Icon name="trending-up" color={token.colorSuccess} />,
            precision: 0,
        },
    ];

    const recentActivity = [
        {
            title: 'New user registered',
            description: 'John Doe joined the platform',
            time: '2 minutes ago',
            avatar: (
                <Avatar size="small">
                    <Icon name="user" size={14} />
                </Avatar>
            ),
            tag: 'User',
        },
        {
            title: 'Order completed',
            description: 'Order #1234 has been processed',
            time: '15 minutes ago',
            avatar: (
                <Avatar size="small" style={{ backgroundColor: token.colorSuccess }}>
                    <Icon name="shopping-cart" size={14} />
                </Avatar>
            ),
            tag: 'Order',
        },
        {
            title: 'Payment received',
            description: '$299.00 payment confirmed',
            time: '1 hour ago',
            avatar: (
                <Avatar size="small" style={{ backgroundColor: token.colorWarning }}>
                    <Icon name="currency-dollar" size={14} />
                </Avatar>
            ),
            tag: 'Payment',
        },
        {
            title: 'System update',
            description: 'Database optimization completed',
            time: '2 hours ago',
            avatar: (
                <Avatar size="small" style={{ backgroundColor: token.colorInfo }}>
                    <Icon name="clock" size={14} />
                </Avatar>
            ),
            tag: 'System',
        },
    ];

    // Action buttons for the header
    const headerActions = (
        <Space>
            <Button icon={<Icon name="refresh" size={16} />} onClick={() => window.location.reload()}>
                Refresh
            </Button>
            <Button icon={<Icon name="filter" size={16} />} type="default">
                Filter
            </Button>
            <Button icon={<Icon name="download" size={16} />} type="default">
                Export
            </Button>
            <Dropdown
                menu={{
                    items: [
                        {
                            key: 'new-user',
                            icon: <Icon name="user" size={16} />,
                            label: 'Add User',
                        },
                        {
                            key: 'new-report',
                            icon: <Icon name="plus" size={16} />,
                            label: 'Create Report',
                        },
                    ],
                }}
                trigger={['click']}
            >
                <Button type="primary" icon={<Icon name="plus" size={16} />}>
                    New <Icon name="dots" size={16} />
                </Button>
            </Dropdown>
        </Space>
    );

    return (
        <AppLayout contentHeader={contentHeader}>
            <Head title="Dashboard" />

            <PageCard
                header={{
                    title: 'Dashboard',
                    actions: headerActions,
                }}
            >
                <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={2} style={{ marginBottom: token.marginXS }}>
                            Welcome back, {auth.user.full_name}!
                        </Title>
                        <Paragraph type="secondary">Here's what's happening with your account today.</Paragraph>
                    </div>

                    <Row gutter={[16, 16]}>
                        {statsData.map((stat, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <Card>
                                    <Statistic
                                        title={stat.title}
                                        value={stat.value}
                                        precision={stat.precision}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={16}>
                            <Card title="Recent Activity" style={{ height: '400px' }}>
                                <Flex vertical gap="middle">
                                    {recentActivity.map((item, index) => (
                                        <Flex
                                            key={index}
                                            align="center"
                                            gap="middle"
                                            style={{ paddingBottom: '12px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}
                                        >
                                            {item.avatar}
                                            <Flex vertical style={{ flex: 1 }}>
                                                <Space>
                                                    <Text strong>{item.title}</Text>
                                                    <Tag color="blue">{item.tag}</Tag>
                                                </Space>
                                                <Text type="secondary">{item.description}</Text>
                                            </Flex>
                                            <Text type="secondary">{item.time}</Text>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                                <Card title="Performance">
                                    <Space orientation="vertical" style={{ width: '100%' }}>
                                        <div>
                                            <Text>CPU Usage</Text>
                                            <Progress percent={65} strokeColor={token.colorSuccess} />
                                        </div>
                                        <div>
                                            <Text>Memory Usage</Text>
                                            <Progress percent={78} strokeColor={token.colorWarning} />
                                        </div>
                                        <div>
                                            <Text>Storage</Text>
                                            <Progress percent={45} strokeColor={token.colorInfo} />
                                        </div>
                                    </Space>
                                </Card>

                                <Card title="Quick Stats">
                                    <Space orientation="vertical" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>Active Sessions</Text>
                                            <Text strong>24</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>Online Users</Text>
                                            <Text strong>156</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>Server Load</Text>
                                            <Text strong>Low</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>Response Time</Text>
                                            <Text strong>45ms</Text>
                                        </div>
                                    </Space>
                                </Card>
                            </Space>
                        </Col>
                    </Row>
                </Space>
            </PageCard>
        </AppLayout>
    );
}
