import { type ReactNode } from 'react';
import MasterLayout from './master-layout';
import { appFooterNavItems, appMainNavItems } from './menus/app-menu';

interface AppLayoutProps {
    children: ReactNode;
    pageTitle?: string;
    actions?: ReactNode;
}

export default function AppLayout({ children, pageTitle, actions }: AppLayoutProps) {
    return (
        <MasterLayout pageTitle={pageTitle} actions={actions} mainNavItems={appMainNavItems} footerNavItems={appFooterNavItems}>
            {children}
        </MasterLayout>
    );
}
