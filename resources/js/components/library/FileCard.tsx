import { Icon, type IconName } from '@/components/ui/Icon';
import type { MenuProps } from 'antd';
import { Dropdown, theme } from 'antd';
import { useState } from 'react';

const { useToken } = theme;

interface FileCardProps {
    name: string;
    fileName: string;
    mimeType: string;
    size: string;
    thumbnailUrl?: string | null;
    menuItems: MenuProps['items'];
    selected?: boolean;
    onClick?: () => void;
}

function getFileIconConfig(mimeType: string, primaryColor: string): { name: IconName; color: string } {
    if (mimeType.startsWith('image/')) {
        return { name: 'file-image', color: primaryColor };
    }
    if (mimeType.startsWith('video/')) {
        return { name: 'video', color: '#eb2f96' };
    }
    if (mimeType === 'application/pdf') {
        return { name: 'file-pdf', color: '#cf1322' };
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
        return { name: 'file-word', color: '#2f54eb' };
    }
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
        return { name: 'file-excel', color: '#52c41a' };
    }
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
        return { name: 'file-ppt', color: '#fa8c16' };
    }
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) {
        return { name: 'file-zip', color: '#faad14' };
    }
    if (mimeType.startsWith('text/')) {
        return { name: 'file-text', color: '' };
    }
    return { name: 'file', color: '' };
}

export default function FileCard({ name, mimeType, size, thumbnailUrl, menuItems, selected, onClick }: FileCardProps) {
    const { token } = useToken();
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    const isImage = mimeType.startsWith('image/');
    const iconConfig = getFileIconConfig(mimeType, token.colorPrimary);
    const showThumbnail = thumbnailUrl && isImage && !imageError;

    const getBorderColor = () => {
        if (selected) return token.colorPrimary;
        if (isHovered) return token.colorBorderSecondary;
        return 'transparent';
    };

    return (
        <Dropdown
            menu={{ items: menuItems }}
            trigger={['contextMenu']}
        >
            <div
                style={{
                    backgroundColor: selected ? token.colorPrimaryBg : token.colorBgContainer,
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: token.borderRadiusLG,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                {/* Thumbnail/Icon Area */}
                <div
                    style={{
                        height: 120,
                        backgroundColor: token.colorFillQuaternary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {showThumbnail ? (
                        <img
                            src={thumbnailUrl}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Icon
                            name={iconConfig.name}
                            size={40}
                            color={iconConfig.color || token.colorTextTertiary}
                        />
                    )}
                </div>

                {/* Info Area */}
                <div
                    style={{
                        padding: token.paddingMD,
                    }}
                >
                    <div
                        style={{
                            fontWeight: 500,
                            fontSize: 13,
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
                            marginTop: 4,
                        }}
                    >
                        {size}
                    </div>
                </div>
            </div>
        </Dropdown>
    );
}
