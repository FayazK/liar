import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import DataTable from '@/components/ui/DataTable';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import axios from '@/lib/axios';
import type { LaravelPaginatedResponse } from '@/types';
import type { DataTableQueryParams, FilterConfig } from '@/types/datatable';
import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Tag } from 'antd';
import React from 'react';

interface SectionTemplateItem {
    id: number;
    name: string;
    slug: string;
    category: string;
    tags: string[] | null;
    is_active: boolean;
    is_custom: boolean;
    sort_order: number;
    created_at: string;
    [key: string]: unknown;
}

interface Props {
    tags: string[];
    categories: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
    hero: 'blue',
    features: 'green',
    content: 'purple',
    testimonials: 'orange',
    pricing: 'gold',
    cta: 'red',
    footer: 'default',
    header: 'cyan',
    gallery: 'magenta',
    contact: 'volcano',
    team: 'geekblue',
    faq: 'lime',
    stats: 'processing',
};

function getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category.toLowerCase()] ?? 'default';
}

function buildFilters(categories: string[]): FilterConfig[] {
    return [
        {
            type: 'select',
            key: 'category',
            label: 'Category',
            placeholder: 'All categories',
            options: categories.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
        },
        {
            type: 'boolean',
            key: 'is_active',
            label: 'Status',
            trueLabel: 'Active',
            falseLabel: 'Inactive',
        },
        {
            type: 'boolean',
            key: 'is_custom',
            label: 'Type',
            trueLabel: 'Custom',
            falseLabel: 'Built-in',
        },
    ];
}

const fetchTemplates = async (params: DataTableQueryParams): Promise<LaravelPaginatedResponse<SectionTemplateItem>> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.per_page) queryParams.set('per_page', params.per_page.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.filters) queryParams.set('filters', JSON.stringify(params.filters));
    if (params.sorts && params.sorts.length > 0) {
        queryParams.set('sorts', JSON.stringify(params.sorts));
    }

    const response = await axios.get<LaravelPaginatedResponse<SectionTemplateItem>>(`/admin/page-builder/templates/data?${queryParams.toString()}`);
    return response.data;
};

const columns: ColumnDef<SectionTemplateItem>[] = [
    {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        enableSorting: true,
        cell: ({ getValue }) => <div style={{ fontWeight: 500 }}>{getValue() as string}</div>,
    },
    {
        id: 'category',
        header: 'Category',
        accessorKey: 'category',
        enableSorting: true,
        size: 140,
        cell: ({ getValue }) => {
            const category = getValue() as string;
            return <Tag color={getCategoryColor(category)}>{category.charAt(0).toUpperCase() + category.slice(1)}</Tag>;
        },
    },
    {
        id: 'tags',
        header: 'Tags',
        accessorKey: 'tags',
        enableSorting: false,
        size: 220,
        cell: ({ getValue }) => {
            const tags = getValue() as string[] | null;
            if (!tags || tags.length === 0) {
                return <span style={{ color: '#999' }}>No tags</span>;
            }
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {tags.slice(0, 3).map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                    {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
                </div>
            );
        },
    },
    {
        id: 'is_custom',
        header: 'Type',
        accessorKey: 'is_custom',
        enableSorting: true,
        size: 110,
        cell: ({ getValue }) => {
            const isCustom = getValue() as boolean;
            return isCustom ? <Tag color="purple">Custom</Tag> : <Tag color="default">Built-in</Tag>;
        },
    },
    {
        id: 'is_active',
        header: 'Status',
        accessorKey: 'is_active',
        enableSorting: true,
        size: 100,
        cell: ({ getValue }) => {
            const isActive = getValue() as boolean;
            return isActive ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>;
        },
    },
    {
        id: 'sort_order',
        header: 'Order',
        accessorKey: 'sort_order',
        enableSorting: true,
        size: 80,
        cell: ({ getValue }) => <div style={{ textAlign: 'center' }}>{getValue() as number}</div>,
    },
];

export default function SectionTemplateIndex({ categories }: Props) {
    const contentHeader: ContentHeaderProps = {
        primaryAction: {
            label: 'Create Template',
            icon: 'plus',
            onClick: () => router.visit('/admin/page-builder/templates/create'),
        },
        breadcrumb: [
            { title: 'Page Builder', href: '/admin/page-builder' },
            { title: 'Templates', href: '/admin/page-builder/templates' },
        ],
    };

    const filters = buildFilters(categories);

    return (
        <AdminLayout contentHeader={contentHeader}>
            <Head title="Section Templates" />
            <PageCard bodyPadding="none">
                <DataTable<SectionTemplateItem>
                    queryKey={['admin', 'page-builder', 'templates']}
                    queryFn={fetchTemplates}
                    columns={columns}
                    enableColumnVisibility
                    filters={filters}
                    persistenceKey="page-builder-templates"
                    searchPlaceholder="Search templates by name..."
                    defaultPageSize={20}
                    emptyMessage="No section templates found."
                    emptyFilterMessage="No templates match your search criteria."
                    onRowClick={(row) => router.visit(`/admin/page-builder/templates/${row.original.id}/edit`)}
                />
            </PageCard>
        </AdminLayout>
    );
}

SectionTemplateIndex.layout = (page: React.ReactNode) => page;
