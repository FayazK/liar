import { Icon } from '@/components/ui/Icon';
import { useLibraryState } from '@/hooks/use-library-state';
import axios from '@/lib/axios';
import type { Library, LibraryItem } from '@/types/library';
import { getErrorMessage } from '@/utils/errors';
import { handleFormError } from '@/utils/form-errors';
import { App, Dropdown, Empty, Form, Input, Modal, Space, Spin, Table, theme, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

const { confirm } = Modal;
const { useToken } = theme;

interface LibraryListProps {
    parentId: number;
    onFolderClick: (folder: Library) => void;
    onItemSelect?: (item: LibraryItem | null) => void;
}

export default function LibraryList({ parentId, onFolderClick, onItemSelect }: LibraryListProps) {
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

    const handleRowClick = (item: LibraryItem) => {
        if (item.type === 'folder') {
            onFolderClick(item as unknown as Library);
        } else {
            setSelectedItem(item);
            onItemSelect?.(item);
        }
    };

    const handleRowSelect = (item: LibraryItem) => {
        const isSelected = selectedItem?.id === item.id && selectedItem?.type === item.type;
        if (isSelected) {
            setSelectedItem(null);
            onItemSelect?.(null);
        } else {
            setSelectedItem(item);
            onItemSelect?.(item);
        }
    };

    const getItemIcon = (item: LibraryItem) => {
        if (item.type === 'folder') {
            return <Icon name="folder" size={18} color={item.color || token.colorTextSecondary} />;
        }

        const mimeType = item.mime_type || '';
        if (mimeType.startsWith('image/')) return <Icon name="photo" size={18} color={token.colorPrimary} />;
        if (mimeType.startsWith('video/')) return <Icon name="video" size={18} color={token.colorError} />;
        if (mimeType.startsWith('audio/')) return <Icon name="music" size={18} color={token.colorWarning} />;
        if (mimeType === 'application/pdf') return <Icon name="file-text" size={18} color="#e53935" />;
        if (mimeType.includes('zip') || mimeType.includes('archive') || mimeType.includes('compressed')) {
            return <Icon name="file-zip" size={18} color={token.colorTextSecondary} />;
        }
        return <Icon name="file" size={18} color={token.colorTextSecondary} />;
    };

    const getContextMenuItems = (item: LibraryItem) => {
        const items = [];

        if (item.type === 'folder') {
            items.push({
                key: 'open',
                label: (
                    <Space>
                        <Icon name="folder-open" size={16} />
                        Open
                    </Space>
                ),
                onClick: () => onFolderClick(item as unknown as Library),
            });
            items.push({
                key: 'rename',
                label: (
                    <Space>
                        <Icon name="edit" size={16} />
                        Rename
                    </Space>
                ),
                onClick: () => handleRename(item),
            });
        } else {
            items.push({
                key: 'download',
                label: (
                    <Space>
                        <Icon name="download" size={16} />
                        Download
                    </Space>
                ),
                onClick: () => handleDownload(item),
            });
        }

        items.push({ type: 'divider' as const });
        items.push({
            key: 'delete',
            label: (
                <Space>
                    <Icon name="trash" size={16} />
                    Delete
                </Space>
            ),
            danger: true,
            onClick: () => handleDelete(item),
        });

        return items;
    };

    const columns: ColumnsType<LibraryItem> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: LibraryItem) => (
                <Dropdown menu={{ items: getContextMenuItems(record) }} trigger={['contextMenu']}>
                    <Space
                        style={{ cursor: 'pointer', width: '100%' }}
                        onClick={() => handleRowClick(record)}
                    >
                        {getItemIcon(record)}
                        <span
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {name}
                        </span>
                        {record.is_favorite && (
                            <Tooltip title="Favorite">
                                <Icon name="star-filled" size={14} color={token.colorWarning} />
                            </Tooltip>
                        )}
                    </Space>
                </Dropdown>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Type',
            key: 'type',
            width: 120,
            render: (_: unknown, record: LibraryItem) => {
                if (record.type === 'folder') return 'Folder';
                const mimeType = record.mime_type || '';
                if (mimeType.startsWith('image/')) return 'Image';
                if (mimeType.startsWith('video/')) return 'Video';
                if (mimeType.startsWith('audio/')) return 'Audio';
                if (mimeType === 'application/pdf') return 'PDF';
                if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
                if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
                if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheet';
                return 'File';
            },
            sorter: (a, b) => {
                const getTypeOrder = (item: LibraryItem) => (item.type === 'folder' ? 0 : 1);
                return getTypeOrder(a) - getTypeOrder(b);
            },
        },
        {
            title: 'Size',
            key: 'size',
            width: 100,
            render: (_: unknown, record: LibraryItem) => {
                if (record.type === 'folder') {
                    return record.file_count ? `${record.file_count} items` : '--';
                }
                return record.size_human || '--';
            },
        },
        {
            title: 'Modified',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: 150,
            render: (date: string | undefined, record: LibraryItem) => {
                const dateStr = date || record.created_at;
                if (!dateStr) return '--';
                return new Date(dateStr).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            },
            sorter: (a, b) => {
                const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
                const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
                return dateA - dateB;
            },
        },
        {
            title: '',
            key: 'actions',
            width: 50,
            render: (_: unknown, record: LibraryItem) => (
                <Dropdown menu={{ items: getContextMenuItems(record) }} trigger={['click']}>
                    <Icon
                        name="dots-vertical"
                        size={16}
                        style={{ cursor: 'pointer', padding: 4 }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Dropdown>
            ),
        },
    ];

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
        return (
            <Empty
                description="No folders or files yet. Create a folder or upload files to get started!"
                style={{ marginTop: token.marginXL }}
            />
        );
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={items}
                rowKey={(record) => `${record.type}-${record.id}`}
                pagination={false}
                size="middle"
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectedItem ? [`${selectedItem.type}-${selectedItem.id}`] : [],
                    onChange: (_: React.Key[], selectedRows: LibraryItem[]) => {
                        if (selectedRows.length > 0) {
                            handleRowSelect(selectedRows[0]);
                        }
                    },
                }}
                onRow={(record) => ({
                    onClick: () => handleRowSelect(record),
                    onDoubleClick: () => handleRowClick(record),
                    style: {
                        cursor: 'pointer',
                        background:
                            selectedItem?.id === record.id && selectedItem?.type === record.type
                                ? token.colorPrimaryBg
                                : undefined,
                    },
                })}
            />

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
