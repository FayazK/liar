import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import AdminLayout from '@/layouts/admin-layout';
import type { PostCreatePageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import PostForm, { type PostFormRef } from './partials/post-form';

export default function CreatePost() {
    const { postType, postTypeLabel, supports, categories, tags } = usePage<PostCreatePageProps>().props;
    const formRef = useRef<PostFormRef>(null);
    const [loading, setLoading] = useState(false);

    const isBlogPost = postType === 'blog_post';
    const routePrefix = isBlogPost ? '/admin/posts/blog-post' : '/admin/posts/page';

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: isBlogPost ? 'Blog Posts' : 'Pages', href: routePrefix },
            { title: `Create ${postTypeLabel}`, href: `${routePrefix}/create` },
        ],
        actionButtons: [
            {
                label: 'Save Draft',
                onClick: () => formRef.current?.saveDraft(),
                loading: loading && formRef.current?.currentStatus === 'draft',
            },
            {
                label: 'Publish',
                type: 'primary',
                onClick: () => formRef.current?.publish(),
                loading: loading && formRef.current?.currentStatus === 'published',
            },
        ],
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PostForm
                ref={formRef}
                postType={postType}
                postTypeLabel={postTypeLabel}
                supports={supports}
                categories={categories}
                tags={tags}
                onLoadingChange={setLoading}
            />
        </AdminLayout>
    );
}
