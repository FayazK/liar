import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { Empty, List, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface BuilderPageItem {
    id: number;
    title: string;
    slug: string;
    status: string;
    editor_mode: string;
    updated_at: string;
    author?: { first_name: string; last_name: string };
}

interface Props {
    pages: BuilderPageItem[];
}

function statusColor(status: string): string {
    switch (status) {
        case 'published':
            return 'green';
        case 'draft':
            return 'default';
        case 'scheduled':
            return 'orange';
        default:
            return 'default';
    }
}

export default function PageBuilderIndex({ pages }: Props) {
    const contentHeader: ContentHeaderProps = {
        primaryAction: {
            label: 'New Builder Page',
            icon: 'plus',
            onClick: () => router.visit('/admin/page-builder/create'),
        },
        breadcrumb: [{ title: 'Page Builder', href: '/admin/page-builder' }],
    };

    return (
        <AdminLayout contentHeader={contentHeader}>
            <Head title="Page Builder" />
            <PageCard>
                {pages.length === 0 ? (
                    <Empty description="No builder pages yet. Create your first page to get started." />
                ) : (
                    <List
                        dataSource={pages}
                        renderItem={(page) => (
                            <List.Item
                                key={page.id}
                                onClick={() => router.visit(`/admin/page-builder/${page.id}/editor`)}
                                style={{ cursor: 'pointer' }}
                                className="hover:bg-gray-50"
                            >
                                <List.Item.Meta
                                    title={page.title}
                                    description={
                                        <Text type="secondary">
                                            /{page.slug}
                                            {page.author && (
                                                <span>
                                                    {' '}
                                                    &middot; {page.author.first_name} {page.author.last_name}
                                                </span>
                                            )}
                                        </Text>
                                    }
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Tag color={statusColor(page.status)}>{page.status}</Tag>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {dayjs(page.updated_at).fromNow()}
                                    </Text>
                                </div>
                            </List.Item>
                        )}
                    />
                )}
            </PageCard>
        </AdminLayout>
    );
}

PageBuilderIndex.layout = (page: React.ReactNode) => page;
