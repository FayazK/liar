import { Icon } from '@/components/ui/Icon';
import type { MenuProps } from 'antd';
import { Dropdown, theme } from 'antd';
import { useState } from 'react';

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

export default function FolderTile({ name, itemCount, onFolderClick, onSelect, selected, menuItems }: FolderTileProps) {
    const { token } = useToken();
    const [isHovered, setIsHovered] = useState(false);

    const getBorderColor = () => {
        if (selected) return token.colorPrimary;
        if (isHovered) return token.colorBorderSecondary;
        return 'transparent';
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
        <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: token.marginMD,
                    padding: `${token.paddingMD}px ${token.paddingLG}px`,
                    backgroundColor: selected ? token.colorPrimaryBg : token.colorBgContainer,
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: token.borderRadiusLG,
                    minHeight: 72,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
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
                        width: 44,
                        height: 44,
                        borderRadius: token.borderRadius,
                        backgroundColor: token.colorFillQuaternary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon name="folder" size={24} color={token.colorPrimary} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontWeight: 500,
                            fontSize: 14,
                            lineHeight: 1.5,
                            color: token.colorText,
                            wordBreak: 'break-word',
                        }}
                    >
                        {name}
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            color: token.colorTextTertiary,
                            marginTop: 2,
                        }}
                    >
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </div>
                </div>
            </div>
        </Dropdown>
    );
}
