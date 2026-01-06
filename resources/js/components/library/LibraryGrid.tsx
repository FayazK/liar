import { Icon } from '@/components/ui/Icon';
import { useLibraryState } from '@/hooks/use-library-state';
import axios from '@/lib/axios';
import type { Library, LibraryItem } from '@/types/library';
import { getErrorMessage } from '@/utils/errors';
import { handleFormError } from '@/utils/form-errors';
import { App, Empty, Form, Input, Modal, Space, Spin, theme, Typography } from 'antd';
import { useEffect, useState } from 'react';
import FileCard from './FileCard';
import FolderTile from './FolderTile';

const { confirm } = Modal;
const { useToken } = theme;
const { Title } = Typography;

interface LibraryGridProps {
    parentId: number;
    onFolderClick: (folder: Library) => void;
    onItemSelect?: (item: LibraryItem | null) => void;
}

export default function LibraryGrid({ parentId, onFolderClick, onItemSelect }: LibraryGridProps) {
    const { token } = useToken();
    const { message } = App.useApp();
    const { selectedItem, setSelectedItem } = useLibraryState();
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [renameModal, setRenameModal] = useState<{ open: boolean; item: LibraryItem | null }>({
        open: false,
        item: null,
    });
    const [form] = Form.useForm();

    useEffect(() => {
        fetchItems();
    }, [parentId]);

    // Listen for file uploads
    useEffect(() => {
        const handleFileUploaded = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.libraryId === parentId) {
                // Add new file to grid
                const newFile: LibraryItem = {
                    id: customEvent.detail.file.id,
                    type: 'file',
                    name: customEvent.detail.file.name || customEvent.detail.file.file_name,
                    file_name: customEvent.detail.file.file_name,
                    mime_type: customEvent.detail.file.mime_type,
                    size_human: customEvent.detail.file.size_human,
                    thumbnail_url: customEvent.detail.file.thumbnail_url,
                    created_at: customEvent.detail.file.created_at,
                };

                setItems((prev) => [...prev, newFile]);
            }
        };

        window.addEventListener('library:file-uploaded', handleFileUploaded);
        return () => window.removeEventListener('library:file-uploaded', handleFileUploaded);
    }, [parentId]);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/library/api/${parentId}/items`);
            const allItems = [...response.data.folders, ...response.data.files];
            setItems(allItems);
        } catch {
            setError('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    const handleRename = (item: LibraryItem) => {
        setRenameModal({ open: true, item });
        form.setFieldsValue({ name: item.name });
    };

    const handleItemClick = (item: LibraryItem) => {
        const isSelected = selectedItem?.id === item.id && selectedItem?.type === item.type;
        if (isSelected) {
            setSelectedItem(null);
            onItemSelect?.(null);
        } else {
            setSelectedItem(item);
            onItemSelect?.(item);
        }
    };

    const handleRenameSubmit = async (values: { name: string }) => {
        if (!renameModal.item || renameModal.item.type !== 'folder') return;

        try {
            await axios.patch(`/library/api/${renameModal.item.id}`, { name: values.name });
            message.success('Folder renamed successfully!');
            setRenameModal({ open: false, item: null });
            form.resetFields();
            fetchItems();
        } catch (error: unknown) {
            handleFormError(error, form, 'Failed to rename folder');
        }
    };

    const handleDelete = (item: LibraryItem) => {
        confirm({
            title: `Delete ${item.type === 'folder' ? 'Folder' : 'File'}?`,
            icon: <Icon name="alert-circle" size={22} color="#faad14" />,
            content:
                item.type === 'folder'
                    ? `Are you sure you want to delete "${item.name}"? All contents will be deleted.`
                    : `Are you sure you want to delete "${item.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    if (item.type === 'folder') {
                        await axios.delete(`/library/api/${item.id}`);
                        message.success('Folder deleted successfully!');
                        fetchItems();
                    } else {
                        await axios.delete(`/library/api/file/${item.id}`);
                        message.success('File deleted successfully!');
                        setItems((prev) => prev.filter((i) => !(i.type === 'file' && i.id === item.id)));
                    }
                    // Clear selection if deleted item was selected
                    if (selectedItem?.id === item.id && selectedItem?.type === item.type) {
                        setSelectedItem(null);
                        onItemSelect?.(null);
                    }
                } catch (error: unknown) {
                    message.error(getErrorMessage(error, `Failed to delete ${item.type}`));
                }
            },
        });
    };

    const handleDownload = (item: LibraryItem) => {
        if (item.type !== 'file') return;
        window.location.href = `/library/api/file/${item.id}/download`;
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: token.paddingXL }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Empty description={error} style={{ marginTop: token.marginXL }} />;
    }

    if (items.length === 0) {
        return <Empty description="No folders or files yet. Create a folder or upload files to get started!" style={{ marginTop: token.marginXL }} />;
    }

    // Separate folders and files
    const folders = items.filter((item) => item.type === 'folder');
    const files = items.filter((item) => item.type === 'file');

    return (
        <>
            {/* Folders Section */}
            {folders.length > 0 && (
                <div style={{ marginBottom: token.marginXL }}>
                    <Title level={5} style={{ marginBottom: token.marginMD }}>
                        Folders
                    </Title>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: token.marginMD,
                        }}
                    >
                        {folders.map((item) => {
                            const folderMenuItems = [
                                {
                                    key: 'rename',
                                    label: (
                                        <Space>
                                            <Icon name="edit" size={16} />
                                            Rename
                                        </Space>
                                    ),
                                    onClick: () => handleRename(item),
                                },
                                { type: 'divider' as const },
                                {
                                    key: 'delete',
                                    label: (
                                        <Space>
                                            <Icon name="trash" size={16} />
                                            Delete
                                        </Space>
                                    ),
                                    danger: true,
                                    onClick: () => handleDelete(item),
                                },
                            ];

                            const isSelected = selectedItem?.id === item.id && selectedItem?.type === 'folder';
                            return (
                                <FolderTile
                                    key={`folder-${item.id}`}
                                    name={item.name}
                                    itemCount={item.file_count || 0}
                                    color={item.color}
                                    selected={isSelected}
                                    onSelect={() => handleItemClick(item)}
                                    onFolderClick={() => onFolderClick(item as unknown as Library)}
                                    menuItems={folderMenuItems}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Files Section */}
            {files.length > 0 && (
                <div>
                    <Title level={5} style={{ marginBottom: token.marginMD }}>
                        Files
                    </Title>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: token.marginMD,
                        }}
                    >
                        {files.map((item) => {
                            const fileMenuItems = [
                                {
                                    key: 'download',
                                    label: (
                                        <Space>
                                            <Icon name="download" size={16} />
                                            Download
                                        </Space>
                                    ),
                                    onClick: () => handleDownload(item),
                                },
                                { type: 'divider' as const },
                                {
                                    key: 'delete',
                                    label: (
                                        <Space>
                                            <Icon name="trash" size={16} />
                                            Delete
                                        </Space>
                                    ),
                                    danger: true,
                                    onClick: () => handleDelete(item),
                                },
                            ];

                            const isSelected = selectedItem?.id === item.id && selectedItem?.type === 'file';
                            return (
                                <FileCard
                                    key={`file-${item.id}`}
                                    name={item.name}
                                    fileName={item.file_name || ''}
                                    mimeType={item.mime_type || ''}
                                    size={item.size_human || ''}
                                    thumbnailUrl={item.thumbnail_url}
                                    menuItems={fileMenuItems}
                                    selected={isSelected}
                                    onClick={() => handleItemClick(item)}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            <Modal
                open={renameModal.open}
                title="Rename Folder"
                onCancel={() => {
                    setRenameModal({ open: false, item: null });
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Rename"
            >
                <Form form={form} layout="vertical" onFinish={handleRenameSubmit} autoComplete="off">
                    <Form.Item
                        name="name"
                        label="Folder Name"
                        rules={[
                            { required: true, message: 'Please enter a folder name' },
                            { max: 255, message: 'Name must not exceed 255 characters' },
                        ]}
                    >
                        <Input autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
