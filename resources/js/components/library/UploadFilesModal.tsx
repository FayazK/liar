import axios from '@/lib/axios';
import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, Progress, theme, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';

const { useToken } = theme;

interface FileUploadStatus {
    uid: string;
    name: string;
    status: 'uploading' | 'done' | 'error';
    percent?: number;
    error?: string;
}

interface UploadFilesModalProps {
    open: boolean;
    onClose: () => void;
    libraryId: number;
    onUploadComplete?: () => void;
}

export default function UploadFilesModal({ open, onClose, libraryId, onUploadComplete }: UploadFilesModalProps) {
    const { token } = useToken();
    const [fileList, setFileList] = useState<FileUploadStatus[]>([]);

    const beforeUpload = (file: RcFile): boolean => {
        // Client-side validation
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error(`${file.name} exceeds 10MB limit!`);
            return false;
        }

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'text/csv',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed',
            'application/x-tar',
            'application/gzip',
            'video/mp4',
            'audio/mpeg',
            'audio/wav',
            'video/x-msvideo',
            'video/quicktime',
            'video/x-matroska',
        ];

        if (!allowedTypes.includes(file.type)) {
            message.error(`${file.name} has unsupported file type!`);
            return false;
        }

        return true;
    };

    const customRequest: UploadProps['customRequest'] = async (options) => {
        const { file, onProgress, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('files[]', file as RcFile);

        try {
            // Update status to uploading
            setFileList((prev) => prev.map((f) => (f.uid === (file as RcFile).uid ? { ...f, status: 'uploading' as const, percent: 0 } : f)));

            const response = await axios.post(`/library/api/${libraryId}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;

                    onProgress?.({ percent });

                    setFileList((prev) => prev.map((f) => (f.uid === (file as RcFile).uid ? { ...f, percent } : f)));
                },
            });

            // Mark as done
            setFileList((prev) => prev.map((f) => (f.uid === (file as RcFile).uid ? { ...f, status: 'done' as const, percent: 100 } : f)));

            onSuccess?.(response.data);

            // Trigger grid refresh for this file
            window.dispatchEvent(
                new CustomEvent('library:file-uploaded', {
                    detail: { libraryId, file: response.data.data },
                }),
            );
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Upload failed';

            setFileList((prev) => prev.map((f) => (f.uid === (file as RcFile).uid ? { ...f, status: 'error' as const, error: errorMsg } : f)));

            onError?.(error);
            message.error(`${(file as RcFile).name}: ${errorMsg}`);
        }
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList as FileUploadStatus[]);

        // Check if all uploads complete
        const allDone = newFileList.every((f) => f.status === 'done' || f.status === 'error');

        if (allDone && newFileList.length > 0) {
            const successCount = newFileList.filter((f) => f.status === 'done').length;
            if (successCount > 0) {
                message.success(`${successCount} file(s) uploaded successfully!`);
                onUploadComplete?.();
            }
        }
    };

    const handleClose = () => {
        const isUploading = fileList.some((f) => f.status === 'uploading');
        if (!isUploading) {
            setFileList([]);
            onClose();
        }
    };

    const isUploading = fileList.some((f) => f.status === 'uploading');

    return (
        <Modal open={open} title="Upload Files" onCancel={handleClose} footer={null} closable={!isUploading} maskClosable={!isUploading}>
            <Upload.Dragger
                multiple
                fileList={fileList as UploadFile[]}
                beforeUpload={beforeUpload}
                customRequest={customRequest}
                onChange={handleChange}
                disabled={isUploading}
                showUploadList={{
                    showRemoveIcon: (file) => {
                        const customFile = fileList.find((f) => f.uid === file.uid);
                        return customFile ? customFile.status !== 'uploading' : true;
                    },
                }}
                itemRender={(originNode, file) => {
                    const customFile = fileList.find((f) => f.uid === file.uid);
                    if (!customFile) return originNode;

                    return (
                        <div style={{ padding: '8px 0' }}>
                            <div style={{ marginBottom: customFile.status === 'uploading' ? '4px' : '0' }}>{customFile.name}</div>
                            {customFile.status === 'uploading' && <Progress percent={customFile.percent} size="small" />}
                            {customFile.status === 'error' && <div style={{ color: token.colorError, fontSize: '12px' }}>{customFile.error}</div>}
                        </div>
                    );
                }}
            >
                <p style={{ marginBottom: token.marginMD }}>
                    <InboxOutlined style={{ fontSize: '48px', color: token.colorPrimary }} />
                </p>
                <p style={{ fontSize: '16px', marginBottom: token.marginXS }}>Click or drag files to upload</p>
                <p style={{ color: token.colorTextSecondary, fontSize: '14px' }}>Max 10MB per file. Files upload automatically.</p>
            </Upload.Dragger>
        </Modal>
    );
}
