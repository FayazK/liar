import { FileOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Card, Dropdown, theme, Typography } from 'antd';

const { Text } = Typography;
const { useToken } = theme;

interface FileCardProps {
    id: number;
    name: string;
    fileName: string;
    mimeType: string;
    size: string;
    menuItems: MenuProps['items'];
}

export default function FileCard({ name, size, menuItems }: FileCardProps) {
    const { token } = useToken();

    return (
        <Card
            hoverable
            styles={{
                body: {
                    padding: token.paddingMD,
                },
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Icon: TOP */}
                    <FileOutlined
                        style={{
                            fontSize: '32px',
                            color: token.colorTextSecondary,
                            marginBottom: token.marginSM,
                        }}
                    />

                    {/* Name */}
                    <div
                        style={{
                            fontWeight: 500,
                            marginBottom: token.marginXS,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {name}
                    </div>

                    {/* Size */}
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {size}
                    </Text>
                </div>

                {/* Menu: TOP-RIGHT */}
                <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <MoreOutlined
                        style={{
                            fontSize: '16px',
                            padding: token.paddingXS,
                            cursor: 'pointer',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Dropdown>
            </div>
        </Card>
    );
}
