import {
    FileExcelOutlined,
    FileImageOutlined,
    FileOutlined,
    FilePdfOutlined,
    FilePptOutlined,
    FileTextOutlined,
    FileWordOutlined,
    FileZipOutlined,
    MoreOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, theme, Typography } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';

const { Text } = Typography;
const { useToken } = theme;

interface FileCardProps {
    name: string;
    fileName: string;
    mimeType: string;
    size: string;
    thumbnailUrl?: string | null;
    menuItems: MenuProps['items'];
}

function getFileIcon(mimeType: string, iconStyle: CSSProperties, primaryColor: string): ReactNode {
    if (mimeType.startsWith('image/')) {
        return <FileImageOutlined style={{ ...iconStyle, color: primaryColor }} />;
    }
    if (mimeType.startsWith('video/')) {
        return <PlayCircleOutlined style={{ ...iconStyle, color: '#eb2f96' }} />;
    }
    if (mimeType === 'application/pdf') {
        return <FilePdfOutlined style={{ ...iconStyle, color: '#cf1322' }} />;
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
        return <FileWordOutlined style={{ ...iconStyle, color: '#2f54eb' }} />;
    }
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
        return <FileExcelOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
    }
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
        return <FilePptOutlined style={{ ...iconStyle, color: '#fa8c16' }} />;
    }
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) {
        return <FileZipOutlined style={{ ...iconStyle, color: '#faad14' }} />;
    }
    if (mimeType.startsWith('text/')) {
        return <FileTextOutlined style={iconStyle} />;
    }
    return <FileOutlined style={iconStyle} />;
}

export default function FileCard({ name, mimeType, size, thumbnailUrl, menuItems }: FileCardProps) {
    const { token } = useToken();
    const [isHovered, setIsHovered] = useState(false);

    const isImage = mimeType.startsWith('image/');
    const iconStyle: CSSProperties = { fontSize: 48, color: token.colorTextSecondary };

    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
                border: `1px solid ${isHovered ? token.colorPrimary : token.colorBorder}`,
                borderRadius: token.borderRadiusLG,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-2px)' : 'none',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail/Icon Area */}
            <div
                style={{
                    height: 140,
                    backgroundColor: token.colorFillQuaternary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {thumbnailUrl && isImage ? (
                    <img
                        src={thumbnailUrl}
                        alt={name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    getFileIcon(mimeType, iconStyle, token.colorPrimary)
                )}
            </div>

            {/* Info Area */}
            <div
                style={{
                    padding: token.paddingSM,
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: token.marginXS,
                    }}
                >
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                            style={{
                                fontWeight: 500,
                                fontSize: 13,
                                lineHeight: 1.4,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                wordBreak: 'break-word',
                            }}
                            title={name}
                        >
                            {name}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {size}
                        </Text>
                    </div>

                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                        dropdownRender={(menu) => (
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
                                padding: 4,
                                borderRadius: token.borderRadiusSM,
                                cursor: 'pointer',
                                opacity: isHovered ? 1 : 0.5,
                                transition: 'opacity 0.2s',
                                flexShrink: 0,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreOutlined style={{ fontSize: 16 }} />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}
