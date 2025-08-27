import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    Row, 
    Col, 
    Card, 
    Statistic, 
    Typography, 
    Space, 
    Avatar, 
    Progress,
    List,
    Tag,
    theme
} from 'antd';
import {
    UserOutlined,
    RiseOutlined,
    EyeOutlined,
    TeamOutlined,
    ShoppingOutlined,
    DollarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();

    const statsData = [
        {
            title: 'Total Users',
            value: 1234,
            prefix: <TeamOutlined style={{ color: token.colorPrimary }} />,
            suffix: <RiseOutlined style={{ color: token.colorSuccess }} />,
            precision: 0,
        },
        {
            title: 'Revenue',
            value: 12340,
            prefix: <DollarOutlined style={{ color: token.colorSuccess }} />,
            suffix: <RiseOutlined style={{ color: token.colorSuccess }} />,
            precision: 2,
        },
        {
            title: 'Page Views',
            value: 56789,
            prefix: <EyeOutlined style={{ color: token.colorInfo }} />,
            suffix: <RiseOutlined style={{ color: token.colorSuccess }} />,
            precision: 0,
        },
    ];

    const recentActivity = [
        {
            title: 'New user registered',
            description: 'John Doe joined the platform',
            time: '2 minutes ago',
            avatar: <Avatar icon={<UserOutlined />} size="small" />,
            tag: 'User',
        },
        {
            title: 'Order completed',
            description: 'Order #1234 has been processed',
            time: '15 minutes ago',
            avatar: <Avatar icon={<ShoppingOutlined />} size="small" style={{ backgroundColor: token.colorSuccess }} />,
            tag: 'Order',
        },
        {
            title: 'Payment received',
            description: '$299.00 payment confirmed',
            time: '1 hour ago',
            avatar: <Avatar icon={<DollarOutlined />} size="small" style={{ backgroundColor: token.colorWarning }} />,
            tag: 'Payment',
        },
        {
            title: 'System update',
            description: 'Database optimization completed',
            time: '2 hours ago',
            avatar: <Avatar icon={<ClockCircleOutlined />} size="small" style={{ backgroundColor: token.colorInfo }} />,
            tag: 'System',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Title level={2} style={{ marginBottom: token.marginXS }}>
                        Welcome back, {auth.user.name}!
                    </Title>
                    <Paragraph type="secondary">
                        Here's what's happening with your account today.
                    </Paragraph>
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
                            <List
                                dataSource={recentActivity}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={item.avatar}
                                            title={
                                                <Space>
                                                    {item.title}
                                                    <Tag color="blue">{item.tag}</Tag>
                                                </Space>
                                            }
                                            description={item.description}
                                        />
                                        <Text type="secondary">{item.time}</Text>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    
                    <Col xs={24} lg={8}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Card title="Performance">
                                <Space direction="vertical" style={{ width: '100%' }}>
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
                                <Space direction="vertical" style={{ width: '100%' }}>
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
        </AppLayout>
    );
}
