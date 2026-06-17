import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import { Head, router } from '@inertiajs/react';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';

interface CreateFormValues {
    title: string;
}

export default function PageBuilderCreate() {
    const [form] = Form.useForm<CreateFormValues>();
    const [submitting, setSubmitting] = useState(false);

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Page Builder', href: '/admin/page-builder' },
            { title: 'Create Page', href: '/admin/page-builder/create' },
        ],
    };

    const handleSubmit = async (values: CreateFormValues): Promise<void> => {
        setSubmitting(true);
        try {
            const response = await axios.post<{ id: number }>('/admin/page-builder', {
                title: values.title,
            });
            message.success('Page created successfully');
            router.visit(`/admin/page-builder/${response.data.id}/editor`);
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            message.error(axiosError.response?.data?.message ?? 'Failed to create page');
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <Head title="Create Builder Page" />
            <PageCard header={{ title: 'Create Builder Page' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ maxWidth: 480 }}
                >
                    <Form.Item
                        label="Page Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter a page title' }]}
                    >
                        <Input placeholder="Enter page title" autoFocus />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            Create Page
                        </Button>
                    </Form.Item>
                </Form>
            </PageCard>
        </AdminLayout>
    );
}
