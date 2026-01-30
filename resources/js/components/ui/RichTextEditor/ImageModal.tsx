import { Input, Modal, Segmented, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { IconLink, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';

import type { ImageModalProps } from '@/types/editor';

type TabType = 'upload' | 'url';

export function ImageModal({ open, onClose, onInsert, onUpload, allowUrl = true }: ImageModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>(onUpload ? 'upload' : 'url');
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleUrlInsert = () => {
        if (!imageUrl.trim()) {
            message.error('Please enter an image URL');
            return;
        }

        // Basic URL validation
        try {
            new URL(imageUrl);
        } catch {
            message.error('Please enter a valid URL');
            return;
        }

        onInsert(imageUrl);
        setImageUrl('');
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        accept: 'image/*',
        showUploadList: false,
        beforeUpload: async (file) => {
            if (!onUpload) {
                message.error('Image upload is not configured');
                return false;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                message.error('Please select an image file');
                return false;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                message.error('Image must be smaller than 10MB');
                return false;
            }

            setUploading(true);
            try {
                const url = await onUpload(file);
                onInsert(url);
            } catch (error) {
                message.error('Failed to upload image');
                console.error('Image upload error:', error);
            } finally {
                setUploading(false);
            }

            return false; // Prevent default upload behavior
        },
    };

    const handleClose = () => {
        setImageUrl('');
        onClose();
    };

    const tabOptions = [];
    if (onUpload) {
        tabOptions.push({
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconUpload size={16} />
                    Upload
                </span>
            ),
            value: 'upload' as TabType,
        });
    }
    if (allowUrl) {
        tabOptions.push({
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconLink size={16} />
                    URL
                </span>
            ),
            value: 'url' as TabType,
        });
    }

    return (
        <Modal title="Insert Image" open={open} onCancel={handleClose} footer={null} width={480} destroyOnClose>
            {tabOptions.length > 1 && (
                <Segmented
                    block
                    options={tabOptions}
                    value={activeTab}
                    onChange={(value) => setActiveTab(value as TabType)}
                    style={{ marginBottom: 20 }}
                />
            )}

            {activeTab === 'upload' && onUpload ? (
                <Upload.Dragger {...uploadProps} disabled={uploading}>
                    <div style={{ padding: '20px 0' }}>
                        <IconUpload size={48} style={{ color: 'var(--ant-color-text-tertiary)', marginBottom: 12 }} />
                        <p style={{ margin: 0, fontSize: 16, color: 'var(--ant-color-text)' }}>
                            {uploading ? 'Uploading...' : 'Click or drag image to upload'}
                        </p>
                        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ant-color-text-tertiary)' }}>
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </Upload.Dragger>
            ) : (
                <div>
                    <Input
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onPressEnter={handleUrlInsert}
                        size="large"
                        addonAfter={
                            <button
                                onClick={handleUrlInsert}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--ant-color-primary)',
                                    fontWeight: 500,
                                }}
                            >
                                Insert
                            </button>
                        }
                    />
                    <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--ant-color-text-tertiary)' }}>
                        Enter the URL of an image to insert it into the editor
                    </p>
                </div>
            )}
        </Modal>
    );
}
