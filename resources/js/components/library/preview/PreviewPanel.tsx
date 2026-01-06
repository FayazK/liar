import { Icon } from '@/components/ui/Icon';
import { useLibraryState } from '@/hooks/use-library-state';
import type { LibraryItem } from '@/types/library';
import { Button, Divider, Empty, Space, theme, Tooltip, Typography } from 'antd';
import FileMetadata from './FileMetadata';
import FilePreview from './FilePreview';

const { useToken } = theme;
const { Title, Text } = Typography;

interface PreviewPanelProps {
    item: LibraryItem | null;
    onDownload?: (item: LibraryItem) => void;
    onToggleFavorite?: (item: LibraryItem) => void;
}

export default function PreviewPanel({ item, onDownload, onToggleFavorite }: PreviewPanelProps) {
    const { token } = useToken();
    const { previewPanelVisible } = useLibraryState();

    if (!previewPanelVisible) {
        return null;
    }

    if (!item) {
        return (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: token.paddingLG,
                }}
            >
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Text type="secondary">
                            Select a file or folder to preview
                        </Text>
                    }
                />
            </div>
        );
    }

    return (
        <div
            style={{
                height: '100%',
                overflowY: 'auto',
                padding: token.paddingMD,
            }}
        >
            {/* Preview Image/Icon */}
            <FilePreview item={item} />

            {/* File Name */}
            <Title
                level={5}
                style={{
                    marginTop: token.marginMD,
                    marginBottom: token.marginXS,
                    wordBreak: 'break-word',
                }}
            >
                {item.name}
            </Title>

            {/* Actions */}
            <Space wrap style={{ marginTop: token.marginSM }}>
                {item.type === 'file' && onDownload && (
                    <Tooltip title="Download">
                        <Button
                            type="primary"
                            icon={<Icon name="download" size={16} />}
                            onClick={() => onDownload(item)}
                        >
                            Download
                        </Button>
                    </Tooltip>
                )}
                {onToggleFavorite && (
                    <Tooltip title={item.is_favorite ? 'Remove from favorites' : 'Add to favorites'}>
                        <Button
                            icon={
                                <Icon
                                    name={item.is_favorite ? 'star-filled' : 'star'}
                                    size={16}
                                    color={item.is_favorite ? token.colorWarning : undefined}
                                />
                            }
                            onClick={() => onToggleFavorite(item)}
                        >
                            {item.is_favorite ? 'Favorited' : 'Favorite'}
                        </Button>
                    </Tooltip>
                )}
            </Space>

            <Divider style={{ margin: `${token.marginMD}px 0` }} />

            {/* Metadata */}
            <Text strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Details
            </Text>
            <FileMetadata item={item} />
        </div>
    );
}
