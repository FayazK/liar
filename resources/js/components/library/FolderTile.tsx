import { FolderOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, theme, Typography } from 'antd';

const { Text } = Typography;
const { useToken } = theme;

interface FolderTileProps {
    id: number;
    name: string;
    itemCount: number;
    color?: string;
    onFolderClick: () => void;
    menuItems: MenuProps['items'];
}

export default function FolderTile({ name, itemCount, color, onFolderClick, menuItems }: FolderTileProps) {
    const { token } = useToken();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: token.marginMD,
                padding: token.paddingMD,
                backgroundColor: token.colorBgContainer,
                border: `1px solid ${token.colorBorder}`,
                borderRadius: token.borderRadius,
                borderLeftWidth: '4px',
                borderLeftColor: color || token.colorPrimary,
                minHeight: '60px',
                cursor: 'pointer',
                transition: 'all 0.2s',
            }}
            onClick={onFolderClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = token.colorPrimary;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = token.colorBorder;
                e.currentTarget.style.borderLeftColor = color || token.colorPrimary;
            }}
        >
            {/* Icon: LEFT */}
            <div style={{ flexShrink: 0 }}>
                <FolderOutlined
                    style={{
                        fontSize: '24px',
                        color: color || token.colorPrimary,
                    }}
                />
            </div>

            {/* Content: MIDDLE */}
            <div style={{ flex: 1, minWidth: 0 }}>
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
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Text>
            </div>

            {/* Menu: RIGHT */}
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                <MoreOutlined
                    style={{
                        fontSize: '16px',
                        padding: token.paddingXS,
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </Dropdown>
        </div>
    );
}
