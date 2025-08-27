import { appearance } from '@/routes';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Row, Col, Menu, Typography, theme, Divider } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    BulbOutlined,
    SettingOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { useToken } = theme;

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: UserOutlined,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: LockOutlined,
    },
    {
        title: 'Appearance',
        href: appearance(),
        icon: BulbOutlined,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { token } = useToken();
    
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    const menuItems = sidebarNavItems.map((item) => {
        const href = typeof item.href === 'string' ? item.href : item.href.url;
        
        return {
            key: href,
            icon: item.icon ? <item.icon /> : null,
            label: (
                <Link href={item.href} prefetch style={{ textDecoration: 'none' }}>
                    {item.title}
                </Link>
            ),
        };
    });

    const selectedKeys = sidebarNavItems
        .filter(item => {
            const href = typeof item.href === 'string' ? item.href : item.href.url;
            return currentPath === href;
        })
        .map(item => typeof item.href === 'string' ? item.href : item.href.url);

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ 
                    marginBottom: token.marginXS,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <SettingOutlined style={{ color: token.colorPrimary }} />
                    Settings
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '16px' }}>
                    Manage your profile and account settings
                </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
                <Col xs={24} lg={6}>
                    <div style={{
                        background: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        padding: '16px',
                        border: `1px solid ${token.colorBorderSecondary}`,
                    }}>
                        <Menu
                            mode="vertical"
                            selectedKeys={selectedKeys}
                            items={menuItems}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: '14px',
                            }}
                        />
                    </div>
                </Col>

                <Divider className="lg:hidden" style={{ margin: '24px 0' }} />

                <Col xs={24} lg={18}>
                    <div style={{
                        background: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        padding: '32px',
                        border: `1px solid ${token.colorBorderSecondary}`,
                        minHeight: '600px',
                    }}>
                        {children}
                    </div>
                </Col>
            </Row>
        </div>
    );
}
