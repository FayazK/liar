import { Icon } from '@/components/ui/Icon';
import type { MenuProps } from 'antd';
import { Dropdown, theme, Typography } from 'antd';
import { useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;

interface FolderTileProps {
    name: string;
    itemCount: number;
    color?: string;
    onFolderClick: () => void;
    onSelect?: () => void;
    selected?: boolean;
    menuItems: MenuProps['items'];
}

export default function FolderTile({ name, itemCount, color, onFolderClick, onSelect, selected, menuItems }: FolderTileProps) {
    const { token } = useToken();
    const [isHovered, setIsHovered] = useState(false);

    const accentColor = color || token.colorPrimary;

    const getBorderColor = () => {
        if (selected) return token.colorPrimary;
        if (isHovered) return token.colorPrimaryBorder;
        return token.colorBorder;
    };

    const handleClick = () => {
        if (onSelect) {
            onSelect();
        }
    };

    const handleDoubleClick = () => {
        onFolderClick();
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: token.marginMD,
                padding: token.paddingMD,
                backgroundColor: selected ? token.colorPrimaryBg : token.colorBgContainer,
                borderTop: `2px solid ${getBorderColor()}`,
                borderRight: `2px solid ${getBorderColor()}`,
                borderBottom: `2px solid ${getBorderColor()}`,
                borderLeft: `4px solid ${accentColor}`,
                borderRadius: token.borderRadiusLG,
                minHeight: 64,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-2px)' : 'none',
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Icon */}
            <div
                style={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: token.borderRadiusSM,
                    backgroundColor: token.colorFillQuaternary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Icon name="folder" size={22} color={accentColor} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontWeight: 500,
                        fontSize: 14,
                        marginBottom: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={name}
                >
                    {name}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Text>
            </div>

            {/* Menu */}
            <Dropdown
                menu={{ items: menuItems }}
                trigger={['click']}
                placement="bottomRight"
                popupRender={(menu) => (
                    <div
                        style={{
                            border: `1px solid ${token.colorBorder}`,
                            borderRadius: token.borderRadiusLG,
                            overflow: 'hidden',
                        }}
                    >
                        {menu}
                    </div>
                )}
            >
                <div
                    style={{
                        padding: 8,
                        borderRadius: token.borderRadiusSM,
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0.5,
                        transition: 'opacity 0.2s',
                        flexShrink: 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Icon name="dots" size={16} />
                </div>
            </Dropdown>
        </div>
    );
}
