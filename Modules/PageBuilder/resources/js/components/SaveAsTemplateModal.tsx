import axios from '@/lib/axios';
import { handleFormError } from '@/utils/form-errors';
import { App, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';

interface SaveAsTemplateModalProps {
    open: boolean;
    onClose: () => void;
    html: string;
    css: string;
    categories: string[];
}

interface FormValues {
    name: string;
    category: string;
    tags: string[];
}

const DEFAULT_CATEGORIES = [
    'hero',
    'features',
    'pricing',
    'testimonials',
    'cta',
    'content',
    'gallery',
    'team',
    'contact',
    'footer',
    'header',
    'stats',
];

export default function SaveAsTemplateModal({
    open,
    onClose,
    html,
    css,
    categories,
}: SaveAsTemplateModalProps): React.ReactElement {
    const [form] = Form.useForm<FormValues>();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);

    const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])];

    const handleSubmit = async (values: FormValues): Promise<void> => {
        setLoading(true);

        try {
            await axios.post('/admin/page-builder/templates', {
                name: values.name,
                category: values.category,
                html_template: html,
                css_template: css,
                tags: values.tags ?? [],
            });

            message.success('Template saved successfully!');
            form.resetFields();
            onClose();
        } catch (error: unknown) {
            handleFormError(error, form, 'Failed to save template');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (): void => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={open}
            title="Save as Template"
            onCancel={handleCancel}
            onOk={() => form.submit()}
            okText="Save Template"
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    name="name"
                    label="Template Name"
                    rules={[
                        { required: true, message: 'Please enter a template name' },
                        { max: 255, message: 'Name must not exceed 255 characters' },
                    ]}
                >
                    <Input placeholder="My Section Template" autoFocus />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select placeholder="Select a category">
                        {allCategories.map((cat) => (
                            <Select.Option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="tags" label="Tags">
                    <Select mode="tags" placeholder="Add tags (press Enter to add)" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
