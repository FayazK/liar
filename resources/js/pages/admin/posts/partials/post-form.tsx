import { Icon } from '@/components/ui/Icon';
import { RichTextEditor } from '@/components/ui/RichTextEditor/RichTextEditor';
import api from '@/lib/axios';
import type { CategoryTreeNode, Post, PostFormValues, PostStatus, TagOption } from '@/types';
import type { JSONContent } from '@/types/editor';
import { POST_STATUS_OPTIONS } from '@/types/post';
import { isApiError } from '@/utils/errors';
import { router } from '@inertiajs/react';
import { App, Button, Collapse, Form, Input, Select, TreeSelect, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';

interface PostFormProps {
    post?: Post;
    postType: string;
    postTypeLabel: string;
    supports: string[];
    categories: CategoryTreeNode[];
    tags: TagOption[];
    isEdit?: boolean;
    onLoadingChange?: (loading: boolean) => void;
}

export interface PostFormRef {
    saveDraft: () => void;
    publish: () => void;
    isLoading: boolean;
    currentStatus: PostStatus | undefined;
}

const PostForm = forwardRef<PostFormRef, PostFormProps>(
    ({ post, postType, postTypeLabel, supports, categories, tags, isEdit = false, onLoadingChange }, ref) => {
        const { notification, modal } = App.useApp();
        const [form] = Form.useForm<PostFormValues>();
        const [loading, setLoading] = useState(false);
        const [content, setContent] = useState<JSONContent | null>(post?.content ?? null);
        const [featuredImageFile, setFeaturedImageFile] = useState<UploadFile[]>([]);
        const [hasExistingImage, setHasExistingImage] = useState(!!post?.featured_image_url);

        const isBlogPost = postType === 'blog_post';
        const routePrefix = isBlogPost ? '/admin/posts/blog-post' : '/admin/posts/page';

        // Feature checks
        const supportsCategories = supports.includes('categories');
        const supportsTags = supports.includes('tags');
        const supportsFeaturedImage = supports.includes('featured_image');
        const supportsExcerpt = supports.includes('excerpt');
        const supportsSeo = supports.includes('seo');

        // Tree data node type for TreeSelect
        interface TreeDataNode {
            value: number;
            title: string;
            key: number;
            children?: TreeDataNode[];
        }

        // Convert categories to tree data format for TreeSelect
        const categoryTreeData = useMemo(() => {
            const convertToTreeData = (nodes: CategoryTreeNode[]): TreeDataNode[] => {
                return nodes.map((node) => ({
                    value: node.id,
                    title: node.name,
                    key: node.id,
                    children: node.children ? convertToTreeData(node.children) : undefined,
                }));
            };
            return convertToTreeData(categories);
        }, [categories]);

        // Convert tags to options format
        const tagOptions = useMemo(() => tags.map((tag) => ({ value: tag.id, label: tag.name })), [tags]);

        // Initialize form values
        useEffect(() => {
            form.setFieldsValue({
                title: post?.title || '',
                slug: post?.slug || '',
                excerpt: post?.excerpt || '',
                status: post?.status || 'draft',
                meta_title: post?.meta_title || '',
                meta_description: post?.meta_description || '',
                category_ids: post?.category_ids || [],
                tag_ids: post?.tag_ids || [],
            });

            if (post?.featured_image_url) {
                setFeaturedImageFile([
                    {
                        uid: '-1',
                        name: 'featured-image',
                        status: 'done',
                        url: post.featured_image_url,
                        thumbUrl: post.featured_image_thumb_url || post.featured_image_url,
                    },
                ]);
                setHasExistingImage(true);
            }
        }, [post, form]);

        // Notify parent of loading changes
        useEffect(() => {
            onLoadingChange?.(loading);
        }, [loading, onLoadingChange]);

        const handleContentChange = useCallback((json: JSONContent | undefined) => {
            setContent(json ?? null);
        }, []);

        const handleFeaturedImageChange: UploadProps['onChange'] = ({ fileList }) => {
            setFeaturedImageFile(fileList);
            if (fileList.length === 0) {
                setHasExistingImage(false);
            }
        };

        const handleRemoveFeaturedImage = () => {
            setFeaturedImageFile([]);
            setHasExistingImage(false);
        };

        const onFinish = async (values: PostFormValues) => {
            setLoading(true);

            const formData = new FormData();
            formData.append('title', values.title);
            if (values.slug) formData.append('slug', values.slug);
            if (content) formData.append('content', JSON.stringify(content));
            if (values.excerpt) formData.append('excerpt', values.excerpt);
            formData.append('status', values.status || 'draft');
            if (values.meta_title) formData.append('meta_title', values.meta_title);
            if (values.meta_description) formData.append('meta_description', values.meta_description);
            if (values.published_at) formData.append('published_at', values.published_at);

            // Add taxonomy IDs
            if (values.category_ids) {
                values.category_ids.forEach((id) => formData.append('category_ids[]', String(id)));
            }
            if (values.tag_ids) {
                values.tag_ids.forEach((id) => formData.append('tag_ids[]', String(id)));
            }

            // Handle featured image
            if (featuredImageFile.length > 0 && featuredImageFile[0].originFileObj) {
                formData.append('featured_image', featuredImageFile[0].originFileObj);
            } else if (isEdit && !hasExistingImage && post?.featured_image_url) {
                formData.append('remove_featured_image', 'true');
            }

            const url = isEdit ? `${routePrefix}/${post!.id}` : routePrefix;

            if (isEdit) {
                formData.append('_method', 'PUT');
            }

            try {
                const response = await api.post(url, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({
                    message: response.data.message || `${postTypeLabel} ${isEdit ? 'updated' : 'created'} successfully`,
                });
                router.visit(routePrefix);
            } catch (error: unknown) {
                if (isApiError(error) && error.response?.status === 422) {
                    const validationErrors = error.response.data.errors as Record<string, string[]>;
                    if (validationErrors) {
                        const formErrors = Object.keys(validationErrors).map((key) => ({
                            name: key as keyof PostFormValues,
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
                        description: 'An unexpected error occurred.',
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        const handleSaveDraft = useCallback(() => {
            form.setFieldValue('status', 'draft');
            form.submit();
        }, [form]);

        const handlePublish = useCallback(() => {
            form.setFieldValue('status', 'published');
            form.submit();
        }, [form]);

        const handleDelete = () => {
            if (!post) return;
            modal.confirm({
                title: `Delete ${postTypeLabel}?`,
                content: 'This action cannot be undone.',
                okText: 'Delete',
                okType: 'danger',
                onOk: async () => {
                    try {
                        await api.delete(`${routePrefix}/${post.id}`);
                        notification.success({ message: `${postTypeLabel} deleted successfully` });
                        router.visit(routePrefix);
                    } catch {
                        notification.error({ message: `Failed to delete ${postTypeLabel.toLowerCase()}` });
                    }
                },
            });
        };

        const currentStatus = Form.useWatch('status', form) as PostStatus;

        // Expose methods to parent via ref
        useImperativeHandle(
            ref,
            () => ({
                saveDraft: handleSaveDraft,
                publish: handlePublish,
                isLoading: loading,
                currentStatus,
            }),
            [handleSaveDraft, handlePublish, loading, currentStatus],
        );

        return (
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ height: '100%' }}>
                {/* Title Input - Full Width at Top */}
                <div style={{ marginBottom: 24 }}>
                    <Form.Item name="title" rules={[{ required: true, message: 'Title is required' }]} style={{ margin: 0 }}>
                        <Input
                            placeholder={`${postTypeLabel} title`}
                            variant="borderless"
                            style={{
                                fontSize: 28,
                                fontWeight: 600,
                                padding: '8px 0',
                            }}
                        />
                    </Form.Item>
                </div>

                {/* Main Content Area */}
                <div
                    style={{
                        display: 'flex',
                        gap: 24,
                        minHeight: 'calc(100vh - 240px)',
                    }}
                >
                    {/* Left Column - Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Rich Text Editor */}
                        <div style={{ marginBottom: 24 }}>
                            <RichTextEditor
                                value={content ?? undefined}
                                onChange={handleContentChange}
                                toolbar="floating"
                                placeholder="Start writing your content..."
                                minHeight={400}
                                maxHeight={800}
                            />
                        </div>

                        {/* Excerpt */}
                        {supportsExcerpt && (
                            <Collapse
                                ghost
                                items={[
                                    {
                                        key: 'excerpt',
                                        label: (
                                            <span style={{ fontWeight: 500 }}>
                                                <Icon name="align-left" style={{ marginRight: 8 }} />
                                                Excerpt
                                            </span>
                                        ),
                                        children: (
                                            <Form.Item name="excerpt" style={{ marginBottom: 0 }}>
                                                <Input.TextArea
                                                    rows={3}
                                                    maxLength={500}
                                                    showCount
                                                    placeholder="Write a short summary of your content..."
                                                />
                                            </Form.Item>
                                        ),
                                    },
                                ]}
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        {/* SEO Preview with Editable Fields */}
                        {supportsSeo && (
                            <Collapse
                                ghost
                                items={[
                                    {
                                        key: 'seo-preview',
                                        label: (
                                            <span style={{ fontWeight: 500 }}>
                                                <Icon name="search" style={{ marginRight: 8 }} />
                                                SEO Preview
                                            </span>
                                        ),
                                        children: <SeoSection form={form} />,
                                    },
                                ]}
                            />
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div
                        style={{
                            width: 320,
                            flexShrink: 0,
                            position: 'sticky',
                            top: 100,
                            alignSelf: 'flex-start',
                            maxHeight: 'calc(100vh - 160px)',
                            overflowY: 'auto',
                        }}
                    >
                        {/* Status */}
                        <div
                            style={{
                                backgroundColor: 'var(--ant-color-bg-container)',
                                border: '1px solid var(--ant-color-border)',
                                borderRadius: 8,
                                padding: 16,
                                marginBottom: 16,
                            }}
                        >
                            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
                                <Icon name="check" style={{ marginRight: 8 }} />
                                Status
                            </h4>
                            <Form.Item name="status" style={{ marginBottom: 0 }}>
                                <Select options={POST_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))} style={{ width: '100%' }} />
                            </Form.Item>
                        </div>

                        {/* Featured Image */}
                        {supportsFeaturedImage && (
                            <div
                                style={{
                                    backgroundColor: 'var(--ant-color-bg-container)',
                                    border: '1px solid var(--ant-color-border)',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 16,
                                }}
                            >
                                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
                                    <Icon name="photo" style={{ marginRight: 8 }} />
                                    Featured Image
                                </h4>
                                <Upload
                                    listType="picture-card"
                                    fileList={featuredImageFile}
                                    onChange={handleFeaturedImageChange}
                                    onRemove={handleRemoveFeaturedImage}
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    accept="image/*"
                                >
                                    {featuredImageFile.length === 0 && (
                                        <div>
                                            <Icon name="upload" />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </div>
                        )}

                        {/* Categories */}
                        {supportsCategories && categories.length > 0 && (
                            <div
                                style={{
                                    backgroundColor: 'var(--ant-color-bg-container)',
                                    border: '1px solid var(--ant-color-border)',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 16,
                                }}
                            >
                                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
                                    <Icon name="folder" style={{ marginRight: 8 }} />
                                    Categories
                                </h4>
                                <Form.Item name="category_ids" style={{ marginBottom: 0 }}>
                                    <TreeSelect
                                        treeData={categoryTreeData}
                                        placeholder="Select categories"
                                        allowClear
                                        multiple
                                        treeCheckable
                                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                        style={{ width: '100%' }}
                                        maxTagCount={3}
                                    />
                                </Form.Item>
                            </div>
                        )}

                        {/* Tags */}
                        {supportsTags && tags.length > 0 && (
                            <div
                                style={{
                                    backgroundColor: 'var(--ant-color-bg-container)',
                                    border: '1px solid var(--ant-color-border)',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 16,
                                }}
                            >
                                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
                                    <Icon name="tag" style={{ marginRight: 8 }} />
                                    Tags
                                </h4>
                                <Form.Item name="tag_ids" style={{ marginBottom: 0 }}>
                                    <Select mode="multiple" options={tagOptions} placeholder="Select tags" style={{ width: '100%' }} maxTagCount={3} />
                                </Form.Item>
                            </div>
                        )}

                        {/* Danger Zone (Edit only) */}
                        {isEdit && post && (
                            <div
                                style={{
                                    backgroundColor: 'var(--ant-color-error-bg)',
                                    border: '1px solid var(--ant-color-error-border)',
                                    borderRadius: 8,
                                    padding: 16,
                                }}
                            >
                                <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--ant-color-error)' }}>
                                    <Icon name="warning" style={{ marginRight: 8 }} />
                                    Danger Zone
                                </h4>
                                <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--ant-color-text-secondary)' }}>
                                    Once deleted, this {postTypeLabel.toLowerCase()} cannot be recovered.
                                </p>
                                <Button danger icon={<Icon name="trash" />} onClick={handleDelete}>
                                    Delete {postTypeLabel}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Form>
        );
    },
);

PostForm.displayName = 'PostForm';

export default PostForm;

// SEO Section Component with Editable Fields and Live Preview
interface SeoSectionProps {
    form: ReturnType<typeof Form.useForm<PostFormValues>>[0];
}

function SeoSection({ form }: SeoSectionProps) {
    const title = Form.useWatch('title', form);
    const metaTitle = Form.useWatch('meta_title', form);
    const metaDescription = Form.useWatch('meta_description', form);
    const slug = Form.useWatch('slug', form);

    const displayTitle = metaTitle || title || 'Page Title';
    const displayDescription = metaDescription || 'Add a meta description to improve your search engine visibility.';
    const displayUrl = slug ? `example.com/${slug}` : 'example.com/page-url';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Live Google Preview */}
            <div
                style={{
                    backgroundColor: '#fff',
                    border: '1px solid var(--ant-color-border)',
                    borderRadius: 8,
                    padding: 16,
                }}
            >
                <div style={{ fontSize: 12, color: '#202124', marginBottom: 4 }}>{displayUrl}</div>
                <div
                    style={{
                        fontSize: 18,
                        color: '#1a0dab',
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {displayTitle}
                </div>
                <div
                    style={{
                        fontSize: 13,
                        color: '#4d5156',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {displayDescription}
                </div>
            </div>

            {/* Editable SEO Fields */}
            <div
                style={{
                    backgroundColor: 'var(--ant-color-bg-container)',
                    border: '1px solid var(--ant-color-border)',
                    borderRadius: 8,
                    padding: 16,
                }}
            >
                <Form.Item label="URL Slug" name="slug" style={{ marginBottom: 16 }}>
                    <Input placeholder="custom-url-slug" addonBefore="/" />
                </Form.Item>
                <Form.Item label="Meta Title" name="meta_title" style={{ marginBottom: 16 }}>
                    <Input maxLength={60} showCount placeholder="Page title for search engines" />
                </Form.Item>
                <Form.Item label="Meta Description" name="meta_description" style={{ marginBottom: 0 }}>
                    <Input.TextArea rows={3} maxLength={160} showCount placeholder="Brief description for search results" />
                </Form.Item>
            </div>
        </div>
    );
}
