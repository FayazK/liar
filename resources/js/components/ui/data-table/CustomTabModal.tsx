import type { CustomTab, DataTableFilters } from '@/types/datatable';
import { Button, Form, Input, Modal, theme } from 'antd';
import { useEffect } from 'react';

const { useToken } = theme;

interface CustomTabModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (label: string, filters: DataTableFilters) => void;
    editingTab?: CustomTab | null;
    currentFilters: DataTableFilters;
}

interface FormValues {
    label: string;
}

export function CustomTabModal({ open, onClose, onSave, editingTab, currentFilters }: CustomTabModalProps) {
    const { token } = useToken();
    const [form] = Form.useForm<FormValues>();

    useEffect(() => {
        if (open) {
            if (editingTab) {
                form.setFieldsValue({ label: editingTab.label });
            } else {
                form.resetFields();
            }
        }
    }, [open, editingTab, form]);

    const handleSave = (values: FormValues) => {
        const filters = editingTab ? editingTab.filters : currentFilters;
        onSave(values.label, filters);
        onClose();
    };

    const filterCount = Object.keys(editingTab?.filters || currentFilters).length;

    return (
        <Modal
            title={editingTab ? 'Edit Custom Tab' : 'Save as Custom Tab'}
            open={open}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                    name="label"
                    label="Tab Name"
                    rules={[
                        { required: true, message: 'Please enter a tab name' },
                        { max: 30, message: 'Tab name must be 30 characters or less' },
                    ]}
                >
                    <Input placeholder="e.g., Active Users, Recent Orders" autoFocus />
                </Form.Item>

                <div
                    style={{
                        padding: token.paddingSM,
                        backgroundColor: token.colorFillQuaternary,
                        borderRadius: token.borderRadius,
                        marginBottom: token.marginMD,
                    }}
                >
                    <div style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
                        {editingTab ? (
                            <span>This tab has {filterCount} filter(s) saved.</span>
                        ) : filterCount > 0 ? (
                            <span>Current filters ({filterCount}) will be saved with this tab.</span>
                        ) : (
                            <span>No filters are currently applied. This tab will show all data.</span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: token.marginSM }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        {editingTab ? 'Update' : 'Save Tab'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default CustomTabModal;
