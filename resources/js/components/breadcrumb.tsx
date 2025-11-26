import { type BreadcrumbItem } from '@/types';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import { Breadcrumb as AntBreadcrumb, theme } from 'antd';

const { useToken } = theme;

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
}

/**
 * Breadcrumb navigation component for showing page hierarchy
 */
export default function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
    const { token } = useToken();

    // Build breadcrumb items for Ant Design
    const breadcrumbItems = [
        ...(showHome
            ? [
                  {
                      title: (
                          <Link href="/">
                              <HomeOutlined style={{ fontSize: '14px' }} />
                          </Link>
                      ),
                  },
              ]
            : []),
        ...items.map((item, index) => {
            const isLast = index === items.length - 1;

            return {
                title: isLast ? <span style={{ color: token.colorText }}>{item.title}</span> : <Link href={item.href}>{item.title}</Link>,
            };
        }),
    ];

    if (breadcrumbItems.length <= 1) {
        return null; // Don't show breadcrumb if only home or nothing
    }

    return (
        <AntBreadcrumb
            items={breadcrumbItems}
            style={{
                marginBottom: token.marginMD,
                fontSize: '14px',
            }}
        />
    );
}
