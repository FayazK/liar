import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Card, Typography, Flex, Space, theme } from 'antd';
import { type PropsWithChildren, useEffect, useState } from 'react';
import logo from '../../images/logo.svg'

const { Title, Text } = Typography;
const { useToken } = theme;

interface AuthLayoutProps {
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const [mounted, setMounted] = useState(false);
    const { token } = useToken();

    useEffect(() => {
        setMounted(true);
    }, []);

    const backgroundGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const dotColor = token.colorBgContainer;
    const logoBackgroundColor = 'rgba(255, 255, 255, 0.1)';
    const logoBorderColor = 'rgba(255, 255, 255, 0.2)';

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                background: backgroundGradient,
            }}
        >
            {/* Background decoration */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, ${dotColor} 2px, transparent 2px),
                                    radial-gradient(circle at 75% 75%, ${dotColor} 2px, transparent 2px)`,
                    backgroundSize: '60px 60px',
                    backgroundPosition: '0 0, 30px 30px',
                    opacity: 0.1,
                }}
            />

            <Flex
                align="center"
                justify="center"
                className="min-h-screen"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: token.padding,
                }}
            >
                <div
                    className={`w-full max-w-md transition-all duration-700 ease-out transform ${
                        mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                >
                    <Space direction="vertical" size="large" className="w-full">
                        {/* Logo */}
                        <Flex justify="center">
                            <Link
                                href={home()}
                                className="group transition-transform duration-300 hover:scale-105"
                            >
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm shadow-lg"
                                    style={{
                                        backgroundColor: logoBackgroundColor,
                                        border: `1px solid ${logoBorderColor}`,
                                    }}
                                >
                                    <img
                                        src={logo}
                                        alt="Liar Logo"
                                        style={{
                                            height: '40px',
                                            width: '40px',
                                            filter: 'brightness(0) invert(1)'
                                        }}
                                    />
                                </div>
                            </Link>
                        </Flex>

                        {/* Main Card */}
                        <Card
                            className="w-full backdrop-blur-sm"
                            style={{
                                backgroundColor: token.colorBgContainer,
                                borderRadius: token.borderRadiusLG,
                                border: `1px solid ${token.colorBorderSecondary}`,
                                boxShadow: token.boxShadowSecondary,
                            }}
                            styles={{
                                body: {
                                    padding: token.paddingXL,
                                }
                            }}
                        >
                            <Space direction="vertical" size="large" className="w-full">
                                {/* Header */}
                                <div className="text-center">
                                    <Title
                                        level={2}
                                        className="!mb-2"
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
                                <div className="w-full">
                                    {children}
                                </div>
                            </Space>
                        </Card>
                    </Space>
                </div>
            </Flex>
        </div>
    );
}
