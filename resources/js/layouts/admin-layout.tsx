import { type ReactNode } from 'react';
import MasterLayout from './master-layout';
import { adminFooterNavItems, adminMainNavItems } from './menus/admin-menu';

interface AdminLayoutProps {
    children: ReactNode;
    pageTitle?: string;
    actions?: ReactNode;
}

export default function AdminLayout({ children, pageTitle, actions }: AdminLayoutProps) {
    return (
        <MasterLayout pageTitle={pageTitle} actions={actions} mainNavItems={adminMainNavItems} footerNavItems={adminFooterNavItems}>
            {children}
        </MasterLayout>
    );
}
