import axios from '@/lib/axios';
import { handleFormError } from '@/utils/form-errors';
import { App, Form, Input, Modal } from 'antd';
import { useState } from 'react';

interface CreateFolderModalProps {
    open: boolean;
    onClose: () => void;
    parentId: number;
    onSuccess?: () => void;
}

export default function CreateFolderModal({ open, onClose, parentId, onSuccess }: CreateFolderModalProps) {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { name: string }) => {
        setLoading(true);

        try {
            await axios.post('/library/api/store', {
                name: values.name,
                parent_id: parentId,
            });

            message.success('Folder created successfully!');
            form.resetFields();
            onClose();
            onSuccess?.();
        } catch (error: unknown) {
            handleFormError(error, form, 'Failed to create folder');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal open={open} title="Create New Folder" onCancel={handleCancel} onOk={() => form.submit()} okText="Create" confirmLoading={loading}>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    name="name"
                    label="Folder Name"
                    rules={[
                        { required: true, message: 'Please enter a folder name' },
                        { max: 255, message: 'Folder name must not exceed 255 characters' },
                    ]}
                >
                    <Input placeholder="My Documents" autoFocus />
                </Form.Item>
            </Form>
        </Modal>
    );
}
