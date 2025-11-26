import type { SharedData } from '@/types';
import { DeleteOutlined, LoadingOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';
import { Avatar, Button, message, Space, theme, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';

export default function AvatarUpload() {
    const { auth } = usePage<SharedData>().props;
    const { token } = theme.useToken();
    const [uploading, setUploading] = useState(false);

    const beforeUpload = (file: RcFile): boolean => {
        const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
        if (!isImage) {
            message.error('Only JPG, PNG, and WebP files are allowed!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        return true;
    };

    const customRequest: UploadProps['customRequest'] = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('avatar', file as RcFile);

        setUploading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch('/settings/avatar', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            message.success('Avatar updated!');
            onSuccess?.({});
            router.reload({ only: ['auth'] });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
            message.error(errorMessage);
            onError?.(error as Error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        setUploading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch('/settings/avatar', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            message.success('Avatar removed!');
            router.reload({ only: ['auth'] });
        } catch {
            message.error('Failed to remove avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Space direction="vertical" align="center" size="middle">
            <Avatar
                size={100}
                src={auth.user.avatar_thumb_url || auth.user.avatar_url}
                icon={!auth.user.avatar_url && <UserOutlined />}
                style={{ backgroundColor: !auth.user.avatar_url ? token.colorPrimary : undefined }}
            />
            <Space>
                <Upload showUploadList={false} beforeUpload={beforeUpload} customRequest={customRequest} accept="image/jpeg,image/png,image/webp">
                    <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} loading={uploading}>
                        {auth.user.avatar_url ? 'Change' : 'Upload'}
                    </Button>
                </Upload>
                {auth.user.avatar_url && (
                    <Button danger icon={<DeleteOutlined />} onClick={handleDelete} loading={uploading}>
                        Remove
                    </Button>
                )}
            </Space>
        </Space>
    );
}
