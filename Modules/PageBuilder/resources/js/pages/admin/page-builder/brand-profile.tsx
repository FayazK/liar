import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import { Head, router } from '@inertiajs/react';
import { App, Button, ColorPicker, Form, Input, Radio, Select } from 'antd';
import { isApiError } from '@/utils/errors';
import { type ReactNode, useState } from 'react';

const { TextArea } = Input;

interface ColorPalette {
    primary?: string;
    secondary?: string;
    accent?: string;
}

interface FontPreferences {
    heading?: string;
    body?: string;
}

interface BrandProfile {
    id: number;
    business_name: string;
    industry?: string;
    tone_of_voice: string;
    target_audience?: string;
    color_palette?: ColorPalette;
    font_preferences?: FontPreferences;
    brand_description?: string;
}

interface Props {
    brandProfile: BrandProfile | null;
}

interface FormValues {
    business_name: string;
    industry?: string;
    tone_of_voice: string;
    target_audience?: string;
    color_palette?: ColorPalette;
    font_preferences?: FontPreferences;
    brand_description?: string;
}

const INDUSTRY_OPTIONS = [
    { label: 'Technology', value: 'Technology' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Education', value: 'Education' },
    { label: 'Retail', value: 'Retail' },
    { label: 'Food & Beverage', value: 'Food & Beverage' },
    { label: 'Real Estate', value: 'Real Estate' },
    { label: 'Manufacturing', value: 'Manufacturing' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Other', value: 'Other' },
];

const FONT_OPTIONS = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Playfair Display', value: 'Playfair Display' },
    { label: 'Merriweather', value: 'Merriweather' },
];

export default function BrandProfilePage({ brandProfile }: Props) {
    const { notification } = App.useApp();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Page Builder', href: '/admin/page-builder' },
            { title: 'Brand Profile', href: '/admin/page-builder/brand-profile' },
        ],
    };

    const initialValues: Partial<FormValues> = brandProfile
        ? {
              business_name: brandProfile.business_name,
              industry: brandProfile.industry,
              tone_of_voice: brandProfile.tone_of_voice,
              target_audience: brandProfile.target_audience,
              color_palette: brandProfile.color_palette,
              font_preferences: brandProfile.font_preferences,
              brand_description: brandProfile.brand_description,
          }
        : { tone_of_voice: 'professional' };

    const handleSubmit = async (values: FormValues): Promise<void> => {
        setSubmitting(true);
        try {
            await axios.put('/admin/page-builder/brand-profile', values);
            notification.success({ message: 'Brand profile saved successfully.' });
            router.reload();
        } catch (error: unknown) {
            if (isApiError(error) && error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                if (validationErrors) {
                    const formErrors = Object.keys(validationErrors).map((key) => ({
                        name: key.split('.'),
                        errors: validationErrors[key],
                    }));
                    form.setFields(formErrors);
                }
                notification.error({
                    message: 'Validation Error',
                    description: error.response.data.message,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to save brand profile.',
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <Head title="Brand Profile" />
            <PageCard header={{ title: 'Brand Profile', subtitle: 'Configure your brand identity. This information is used by AI agents when generating content.' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={initialValues}
                    style={{ maxWidth: 640 }}
                >
                    <Form.Item
                        label="Business Name"
                        name="business_name"
                        rules={[{ required: true, message: 'Please enter your business name' }]}
                    >
                        <Input placeholder="Enter your business name" />
                    </Form.Item>

                    <Form.Item label="Industry" name="industry">
                        <Select placeholder="Select your industry" options={INDUSTRY_OPTIONS} allowClear />
                    </Form.Item>

                    <Form.Item
                        label="Tone of Voice"
                        name="tone_of_voice"
                        rules={[{ required: true, message: 'Please select a tone of voice' }]}
                    >
                        <Radio.Group>
                            <Radio value="professional">Professional</Radio>
                            <Radio value="casual">Casual</Radio>
                            <Radio value="playful">Playful</Radio>
                            <Radio value="authoritative">Authoritative</Radio>
                            <Radio value="friendly">Friendly</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Target Audience" name="target_audience">
                        <TextArea
                            placeholder="Describe your target audience (e.g. Developers aged 25–40 who value productivity)"
                            rows={3}
                            maxLength={2000}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item label="Color Palette">
                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <Form.Item label="Primary" name={['color_palette', 'primary']} style={{ marginBottom: 0 }}>
                                <ColorPicker
                                    format="hex"
                                    onChange={(_, hex) => form.setFieldValue(['color_palette', 'primary'], hex)}
                                />
                            </Form.Item>
                            <Form.Item label="Secondary" name={['color_palette', 'secondary']} style={{ marginBottom: 0 }}>
                                <ColorPicker
                                    format="hex"
                                    onChange={(_, hex) => form.setFieldValue(['color_palette', 'secondary'], hex)}
                                />
                            </Form.Item>
                            <Form.Item label="Accent" name={['color_palette', 'accent']} style={{ marginBottom: 0 }}>
                                <ColorPicker
                                    format="hex"
                                    onChange={(_, hex) => form.setFieldValue(['color_palette', 'accent'], hex)}
                                />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item label="Font Preferences">
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <Form.Item label="Heading Font" name={['font_preferences', 'heading']} style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
                                <Select placeholder="Select heading font" options={FONT_OPTIONS} allowClear />
                            </Form.Item>
                            <Form.Item label="Body Font" name={['font_preferences', 'body']} style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
                                <Select placeholder="Select body font" options={FONT_OPTIONS} allowClear />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item label="Brand Description" name="brand_description">
                        <TextArea
                            placeholder="Describe your brand, its values, and what makes it unique"
                            rows={4}
                            maxLength={5000}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            Save Brand Profile
                        </Button>
                    </Form.Item>
                </Form>
            </PageCard>
        </AdminLayout>
    );
}

BrandProfilePage.layout = (page: ReactNode) => page;
