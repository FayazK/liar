import { type ReactNode } from 'react';
import MasterLayout from './master-layout';
import { adminFooterNavItems, adminMainNavItems, adminNavGroups } from './menus/admin-menu';

interface AdminLayoutProps {
    children: ReactNode;
    actions?: ReactNode;
}

export default function AdminLayout({ children, actions }: AdminLayoutProps) {
    return (
        <MasterLayout actions={actions} mainNavItems={adminMainNavItems} navGroups={adminNavGroups} footerNavItems={adminFooterNavItems}>
            {children}
        </MasterLayout>
    );
}
