import { Icon } from '@/components/ui/Icon';
import type { LibraryItem } from '@/types/library';
import { Descriptions, Tag, theme, Typography } from 'antd';

const { useToken } = theme;
const { Text } = Typography;

interface FileMetadataProps {
    item: LibraryItem;
}

function getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType === 'application/pdf') return 'PDF Document';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Word Document';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Spreadsheet';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'Presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'Archive';
    if (mimeType.startsWith('text/')) return 'Text File';
    return 'File';
}

function formatDate(dateString: string | undefined): string {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function FileMetadata({ item }: FileMetadataProps) {
    const { token } = useToken();

    if (item.type === 'folder') {
        return (
            <div style={{ padding: `${token.paddingMD}px 0` }}>
                <Descriptions column={1} size="small" colon={false}>
                    <Descriptions.Item label={<Text type="secondary">Type</Text>}>
                        <Tag>Folder</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={<Text type="secondary">Items</Text>}>
                        {item.file_count ?? 0} {(item.file_count ?? 0) === 1 ? 'item' : 'items'}
                    </Descriptions.Item>
                    {item.total_size_human && (
                        <Descriptions.Item label={<Text type="secondary">Total Size</Text>}>
                            {item.total_size_human}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label={<Text type="secondary">Created</Text>}>
                        {formatDate(item.created_at)}
                    </Descriptions.Item>
                    {item.updated_at && (
                        <Descriptions.Item label={<Text type="secondary">Modified</Text>}>
                            {formatDate(item.updated_at)}
                        </Descriptions.Item>
                    )}
                </Descriptions>

                {item.is_favorite && (
                    <div style={{ marginTop: token.marginMD, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="star-filled" size={16} color={token.colorWarning} />
                        <Text type="secondary">Favorite</Text>
                    </div>
                )}
            </div>
        );
    }

    const mimeType = item.mime_type || '';
    const fileType = getFileType(mimeType);

    return (
        <div style={{ padding: `${token.paddingMD}px 0` }}>
            <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label={<Text type="secondary">Type</Text>}>
                    <Tag>{fileType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Text type="secondary">Size</Text>}>
                    {item.size_human || '--'}
                </Descriptions.Item>
                {item.file_name && (
                    <Descriptions.Item label={<Text type="secondary">File Name</Text>}>
                        <Text
                            style={{
                                wordBreak: 'break-all',
                                fontSize: 12,
                            }}
                        >
                            {item.file_name}
                        </Text>
                    </Descriptions.Item>
                )}
                {mimeType && (
                    <Descriptions.Item label={<Text type="secondary">MIME Type</Text>}>
                        <Text style={{ fontSize: 12 }} code>
                            {mimeType}
                        </Text>
                    </Descriptions.Item>
                )}
                {item.folder_name && (
                    <Descriptions.Item label={<Text type="secondary">Location</Text>}>
                        {item.folder_name}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label={<Text type="secondary">Created</Text>}>
                    {formatDate(item.created_at)}
                </Descriptions.Item>
                {item.updated_at && (
                    <Descriptions.Item label={<Text type="secondary">Modified</Text>}>
                        {formatDate(item.updated_at)}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {item.is_favorite && (
                <div style={{ marginTop: token.marginMD, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="star-filled" size={16} color={token.colorWarning} />
                    <Text type="secondary">Favorite</Text>
                </div>
            )}
        </div>
    );
}
