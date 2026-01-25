import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Card, Flex, theme, Typography } from 'antd';
import { type PropsWithChildren } from 'react';
import logo from '../../images/logo.svg';

const { Title, Text } = Typography;
const { useToken } = theme;

interface AuthLayoutProps {
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { token } = useToken();

    return (
        <div
            style={{
                backgroundColor: token.colorBgLayout,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `${token.paddingLG}px ${token.padding}px`,
            }}
        >
            <div style={{ width: '100%', maxWidth: '448px' }}>
                {/* Logo */}
                <Flex justify="center" style={{ marginBottom: token.marginXL }}>
                    <Link href={home()}>
                        <img
                            src={logo}
                            alt="Liar Logo"
                            style={{
                                height: '64px',
                                width: '64px',
                            }}
                        />
                    </Link>
                </Flex>

                {/* Main Card */}
                <Card
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        border: `1px solid ${token.colorBorderSecondary}`,
                    }}
                    styles={{
                        body: {
                            padding: token.paddingXL,
                        },
                    }}
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: token.marginXL }}>
                        <Title
                            level={2}
                            style={{
                                color: token.colorText,
                                fontWeight: 600,
                                fontSize: token.fontSizeHeading2,
                                margin: 0,
                                marginBottom: token.marginXS,
                            }}
                        >
                            {title}
                        </Title>
                        <Text
                            style={{
                                fontSize: token.fontSizeSM,
                                lineHeight: token.lineHeight,
                                color: token.colorTextSecondary,
                            }}
                        >
                            {description}
                        </Text>
                    </div>

                    {/* Content */}
                    {children}
                </Card>
            </div>
        </div>
    );
}
