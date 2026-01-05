import { Icon } from '@/components/ui/Icon';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Button, Card, Col, Divider, Flex, Layout, Row, Space, Tag, theme, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { token } = useToken();

    const features = [
        {
            icon: <Icon name="rocket" size={24} color={token.colorPrimary} />,
            title: 'Fast Development',
            description: 'Built with Laravel and React for rapid development and deployment.',
        },
        {
            icon: <Icon name="shield" size={24} color={token.colorSuccess} />,
            title: 'Secure by Default',
            description: 'Industry-standard security practices built into every component.',
        },
        {
            icon: <Icon name="bolt" size={24} color={token.colorWarning} />,
            title: 'High Performance',
            description: 'Optimized for speed with efficient rendering and caching strategies.',
        },
        {
            icon: <Icon name="world" size={24} color={token.colorInfo} />,
            title: 'Modern Stack',
            description: 'Using the latest technologies: Laravel 12, React 19, Inertia.js.',
        },
    ];

    const technologies = [
        { name: 'Laravel 12', type: 'Backend' },
        { name: 'React 19', type: 'Frontend' },
        { name: 'Inertia.js', type: 'Full-stack' },
        { name: 'Ant Design', type: 'UI Library' },
        { name: 'TypeScript', type: 'Language' },
        { name: 'Tailwind CSS', type: 'Styling' },
    ];

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content="Welcome to our modern Laravel React application" />
            </Head>

            <Layout style={{ minHeight: '100vh' }}>
                <Header
                    style={{
                        background: token.colorBgContainer,
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon name="code" size={24} color={token.colorPrimary} style={{ marginRight: '12px' }} />
                        <Title level={3} style={{ margin: 0, color: token.colorPrimary }}>
                            Liar
                        </Title>
                    </div>

                    <Space>
                        {auth.user ? (
                            <Button
                                type="primary"
                                icon={<Icon name="dashboard" size={16} />}
                                onClick={() => (window.location.href = dashboard().url)}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button icon={<Icon name="login" size={16} />} onClick={() => (window.location.href = login().url)}>
                                    Log in
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<Icon name="user-plus" size={16} />}
                                    onClick={() => (window.location.href = register().url)}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Space>
                </Header>

                <Content style={{ padding: '48px 24px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Row justify="center" style={{ marginBottom: '48px' }}>
                            <Col xs={24} md={16} lg={12} style={{ textAlign: 'center' }}>
                                <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                                    <div>
                                        <Title level={1} style={{ fontSize: '3rem', marginBottom: '16px' }}>
                                            Welcome to <span style={{ color: token.colorPrimary }}>Liar</span>
                                        </Title>
                                        <Paragraph style={{ fontSize: '18px', color: token.colorTextSecondary }}>
                                            A modern, professional Laravel React application built with the latest technologies and best practices for
                                            rapid development and deployment.
                                        </Paragraph>
                                    </div>

                                    {!auth.user && (
                                        <Space size="middle">
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<Icon name="user-plus" size={16} />}
                                                onClick={() => (window.location.href = register().url)}
                                            >
                                                Get Started
                                            </Button>
                                            <Button
                                                size="large"
                                                icon={<Icon name="login" size={16} />}
                                                onClick={() => (window.location.href = login().url)}
                                            >
                                                Sign In
                                            </Button>
                                        </Space>
                                    )}
                                </Space>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
                            {features.map((feature, index) => (
                                <Col xs={24} sm={12} lg={6} key={index}>
                                    <Card style={{ height: '100%', textAlign: 'center' }}>
                                        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                                            {feature.icon}
                                            <Title level={4}>{feature.title}</Title>
                                            <Text type="secondary">{feature.description}</Text>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <Divider />

                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Card title="Technology Stack" extra={<Icon name="api" size={18} />}>
                                    <Flex vertical gap="middle">
                                        {technologies.map((item) => (
                                            <Flex key={item.name} justify="space-between" align="center">
                                                <Text strong>{item.name}</Text>
                                                <Tag color="blue">{item.type}</Tag>
                                            </Flex>
                                        ))}
                                    </Flex>
                                </Card>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Card title="Getting Started">
                                    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                                        <div>
                                            <Title level={5}>1. Create an Account</Title>
                                            <Text type="secondary">Sign up for a new account to get started with the platform.</Text>
                                        </div>
                                        <div>
                                            <Title level={5}>2. Explore the Dashboard</Title>
                                            <Text type="secondary">Access your personalized dashboard with real-time analytics.</Text>
                                        </div>
                                        <div>
                                            <Title level={5}>3. Customize Settings</Title>
                                            <Text type="secondary">Configure your profile, appearance, and security preferences.</Text>
                                        </div>

                                        {!auth.user && (
                                            <Button
                                                type="primary"
                                                block
                                                size="large"
                                                icon={<Icon name="user-plus" size={16} />}
                                                onClick={() => (window.location.href = register().url)}
                                                style={{ marginTop: '16px' }}
                                            >
                                                Start Your Journey
                                            </Button>
                                        )}
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Content>

                <Footer
                    style={{
                        textAlign: 'center',
                        background: token.colorBgLayout,
                        borderTop: `1px solid ${token.colorBorderSecondary}`,
                    }}
                >
                    <Space separator={<Divider orientation="vertical" />}>
                        <Text type="secondary">© 2024 Liar. All rights reserved.</Text>
                        <Text type="secondary">Built with Laravel & React</Text>
                        <Text type="secondary">Powered by Inertia.js</Text>
                    </Space>
                </Footer>
            </Layout>
        </>
    );
}
