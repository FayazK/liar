import axios from '@/lib/axios';
import { Form, Input, message, Modal } from 'antd';
import { useState } from 'react';

interface CreateFolderModalProps {
    open: boolean;
    onClose: () => void;
    parentId: number;
    onSuccess?: () => void;
}

export default function CreateFolderModal({ open, onClose, parentId, onSuccess }: CreateFolderModalProps) {
    const [form] = Form.useForm();
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
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (errors?.name) {
                form.setFields([
                    {
                        name: 'name',
                        errors: [errors.name[0]],
                    },
                ]);
            } else {
                message.error(error.response?.data?.message || 'Failed to create folder');
            }
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
