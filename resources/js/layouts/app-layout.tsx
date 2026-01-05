import { type ReactNode } from 'react';
import MasterLayout from './master-layout';
import { appFooterNavItems, appMainNavItems, appNavGroups } from './menus/app-menu';

interface AppLayoutProps {
    children: ReactNode;
    actions?: ReactNode;
}

export default function AppLayout({ children, actions }: AppLayoutProps) {
    return (
        <MasterLayout actions={actions} mainNavItems={appMainNavItems} navGroups={appNavGroups} footerNavItems={appFooterNavItems}>
            {children}
        </MasterLayout>
    );
}
