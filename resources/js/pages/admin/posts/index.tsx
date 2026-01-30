import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import DataTable from '@/components/ui/DataTable';
import { Icon } from '@/components/ui/Icon';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import type { LaravelPaginatedResponse, Post, PostIndexPageProps } from '@/types';
import type { DataTableQueryParams, FilterConfig, SelectFilterConfig } from '@/types/datatable';
import { POST_STATUS_OPTIONS } from '@/types/post';
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, Badge, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

export default function PostsIndex({ postType, postTypeLabel }: PostIndexPageProps) {
    const isBlogPost = postType === 'blog_post';
    const routePrefix = isBlogPost ? '/admin/posts/blog-post' : '/admin/posts/page';

    // Filter configurations
    const filters: FilterConfig[] = useMemo<FilterConfig[]>(
        () => [
            {
                type: 'select',
                key: 'status',
                label: 'Status',
                options: POST_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
            } as SelectFilterConfig,
            {
                type: 'dateRange',
                key: 'created_at',
                label: 'Created Date',
            },
            {
                type: 'dateRange',
                key: 'published_at',
                label: 'Published Date',
            },
        ],
        [],
    );

    // Query function for server-side pagination
    const fetchPosts = async (params: DataTableQueryParams): Promise<LaravelPaginatedResponse<Post>> => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.set('page', params.page.toString());
        if (params.per_page) queryParams.set('per_page', params.per_page.toString());
        if (params.search) queryParams.set('search', params.search);
        if (params.filters) queryParams.set('filters', JSON.stringify(params.filters));
        if (params.sorts && params.sorts.length > 0) {
            queryParams.set('sorts', JSON.stringify(params.sorts));
        }

        const response = await axios.get<LaravelPaginatedResponse<Post>>(`${routePrefix}/data?${queryParams.toString()}`);
        return response.data;
    };

    const contentHeader: ContentHeaderProps = {
        primaryAction: {
            label: `Add ${isBlogPost ? 'Post' : 'Page'}`,
            icon: 'plus',
            onClick: () => router.visit(`${routePrefix}/create`),
        },
        breadcrumb: [{ title: postTypeLabel, href: routePrefix }],
    };

    // Column definitions
    const columns: ColumnDef<Post>[] = [
        {
            id: 'title',
            header: 'Title',
            accessorKey: 'title',
            enableSorting: true,
            cell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {row.original.featured_image_thumb_url ? (
                        <img
                            src={row.original.featured_image_thumb_url}
                            alt=""
                            style={{
                                width: 48,
                                height: 36,
                                objectFit: 'cover',
                                borderRadius: 4,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 48,
                                height: 36,
                                backgroundColor: '#f5f5f5',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Icon name="photo" style={{ color: '#bbb', fontSize: 16 }} />
                        </div>
                    )}
                    <div>
                        <div style={{ fontWeight: 500 }}>{row.original.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{row.original.slug}</div>
                    </div>
                </div>
            ),
        },
        {
            id: 'author',
            header: 'Author',
            accessorKey: 'author',
            cell: ({ row }) => {
                const author = row.original.author;
                if (!author) return <span style={{ color: '#999' }}>-</span>;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar src={author.avatar_thumb_url} size="small">
                            {author.full_name?.charAt(0)}
                        </Avatar>
                        <span>{author.full_name}</span>
                    </div>
                );
            },
        },
        {
            id: 'status',
            header: 'Status',
            accessorKey: 'status',
            enableSorting: true,
            size: 120,
            cell: ({ row }) => {
                const status = row.original.status;
                const color = status === 'published' ? 'green' : status === 'draft' ? 'default' : 'orange';
                return <Tag color={color}>{row.original.status_label}</Tag>;
            },
        },
        {
            id: 'published_at',
            header: 'Published',
            accessorKey: 'published_at',
            enableSorting: true,
            size: 150,
            cell: ({ row }) => {
                const publishedAt = row.original.published_at;
                if (!publishedAt) return <span style={{ color: '#999' }}>-</span>;
                const date = dayjs(publishedAt);
                const isFuture = date.isAfter(dayjs());
                return (
                    <Tooltip title={date.format('MMMM D, YYYY h:mm A')}>
                        <span style={{ color: isFuture ? '#1890ff' : undefined }}>
                            {isFuture && <Icon name="clock" style={{ marginRight: 4 }} />}
                            {date.format('MMM D, YYYY')}
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            id: 'created_at',
            header: 'Created',
            accessorKey: 'created_at',
            enableSorting: true,
            size: 150,
            cell: ({ row }) => {
                const createdAt = row.original.created_at;
                return (
                    <Tooltip title={dayjs(createdAt).format('MMMM D, YYYY h:mm A')}>
                        <span>{dayjs(createdAt).format('MMM D, YYYY')}</span>
                    </Tooltip>
                );
            },
        },
    ];

    // Add categories/tags columns for blog posts
    if (isBlogPost) {
        columns.splice(2, 0, {
            id: 'categories',
            header: 'Categories',
            accessorKey: 'categories',
            size: 180,
            cell: ({ row }) => {
                const categories = row.original.categories || [];
                if (categories.length === 0) return <span style={{ color: '#999' }}>-</span>;
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {categories.slice(0, 2).map((cat) => (
                            <Badge key={cat.id} count={cat.name} color="blue" />
                        ))}
                        {categories.length > 2 && <Badge count={`+${categories.length - 2}`} color="default" />}
                    </div>
                );
            },
        });
    }

    return (
        <AdminLayout contentHeader={contentHeader}>
            <PageCard bodyPadding="none">
                <DataTable<Post>
                    queryKey={['admin', 'posts', postType]}
                    queryFn={fetchPosts}
                    columns={columns}
                    enableColumnVisibility
                    filters={filters}
                    persistenceKey={`admin-posts-${postType}-table`}
                    searchPlaceholder={`Search ${postTypeLabel.toLowerCase()} by title or slug...`}
                    defaultPageSize={15}
                    emptyMessage={`No ${postTypeLabel.toLowerCase()} have been created yet.`}
                    emptyFilterMessage={`No ${postTypeLabel.toLowerCase()} match your search criteria.`}
                    onRowClick={(row) => router.visit(`${routePrefix}/${row.original.id}/edit`)}
                />
            </PageCard>
        </AdminLayout>
    );
}

PostsIndex.layout = (page: React.ReactNode) => page;
