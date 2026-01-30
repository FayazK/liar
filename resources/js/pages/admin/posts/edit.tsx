import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import AdminLayout from '@/layouts/admin-layout';
import type { PostEditPageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import PostForm, { type PostFormRef } from './partials/post-form';

export default function EditPost() {
    const { post, postType, postTypeLabel, supports, categories, tags } = usePage<PostEditPageProps>().props;
    const formRef = useRef<PostFormRef>(null);
    const [loading, setLoading] = useState(false);

    const isBlogPost = postType === 'blog_post';
    const routePrefix = isBlogPost ? '/admin/posts/blog-post' : '/admin/posts/page';

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: isBlogPost ? 'Blog Posts' : 'Pages', href: routePrefix },
            { title: post?.title || 'Edit', href: post?.id ? `${routePrefix}/${post.id}/edit` : '#' },
        ],
        actionButtons: [
            {
                label: 'Save Draft',
                onClick: () => formRef.current?.saveDraft(),
                loading: loading && formRef.current?.currentStatus === 'draft',
            },
            {
                label: post?.is_published ? 'Update' : 'Publish',
                type: 'primary',
                onClick: () => formRef.current?.publish(),
                loading: loading && formRef.current?.currentStatus === 'published',
            },
        ],
    };

    if (!post?.id) {
        return null;
    }

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PostForm
                ref={formRef}
                post={post}
                postType={postType}
                postTypeLabel={postTypeLabel}
                supports={supports}
                categories={categories}
                tags={tags}
                isEdit
                onLoadingChange={setLoading}
            />
        </AdminLayout>
    );
}
