import { ContentHeader, type ContentHeaderProps } from '@/components/ui/ContentHeader';
import { type ReactNode } from 'react';
import MasterLayout from './master-layout';
import { adminFooterNavItems, adminMainNavItems, adminNavGroups } from './menus/admin-menu';

interface AdminLayoutProps {
    children: ReactNode;
    actions?: ReactNode;
    contentHeader?: ContentHeaderProps;
}

export default function AdminLayout({ children, actions, contentHeader }: AdminLayoutProps) {
    return (
        <MasterLayout actions={actions} mainNavItems={adminMainNavItems} navGroups={adminNavGroups} footerNavItems={adminFooterNavItems}>
            {contentHeader && <ContentHeader {...contentHeader} />}
            {children}
        </MasterLayout>
    );
}
