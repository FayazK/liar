import { Icon, type IconName } from '@/components/ui/Icon';
import type { LibraryItem } from '@/types/library';
import { theme } from 'antd';

const { useToken } = theme;

interface FilePreviewProps {
    item: LibraryItem;
}

function getFileIconConfig(mimeType: string, primaryColor: string): { name: IconName; color: string } {
    if (mimeType.startsWith('image/')) {
        return { name: 'photo', color: primaryColor };
    }
    if (mimeType.startsWith('video/')) {
        return { name: 'video', color: '#eb2f96' };
    }
    if (mimeType.startsWith('audio/')) {
        return { name: 'music', color: '#fa8c16' };
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

export default function FilePreview({ item }: FilePreviewProps) {
    const { token } = useToken();

    if (item.type === 'folder') {
        return (
            <div
                style={{
                    width: '100%',
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: token.colorFillQuaternary,
                    borderRadius: token.borderRadiusLG,
                }}
            >
                <Icon name="folder" size={80} color={item.color || token.colorPrimary} />
            </div>
        );
    }

    const mimeType = item.mime_type || '';
    const isImage = mimeType.startsWith('image/');
    const thumbnailUrl = item.thumbnail_url;

    // Show image preview for images with thumbnails
    if (isImage && thumbnailUrl) {
        return (
            <div
                style={{
                    width: '100%',
                    height: 200,
                    backgroundColor: token.colorFillQuaternary,
                    borderRadius: token.borderRadiusLG,
                    overflow: 'hidden',
                }}
            >
                <img
                    src={thumbnailUrl}
                    alt={item.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </div>
        );
    }

    // Show file icon for other files
    const iconConfig = getFileIconConfig(mimeType, token.colorPrimary);

    return (
        <div
            style={{
                width: '100%',
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: token.colorFillQuaternary,
                borderRadius: token.borderRadiusLG,
            }}
        >
            <Icon name={iconConfig.name} size={80} color={iconConfig.color || token.colorTextSecondary} />
        </div>
    );
}
