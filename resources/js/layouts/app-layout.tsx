import { ContentHeader, type ContentHeaderProps } from '@/components/ui/ContentHeader';
import { type ReactNode } from 'react';
import MasterLayout from './master-layout';
import { appFooterNavItems, appMainNavItems, appNavGroups } from './menus/app-menu';

interface AppLayoutProps {
    children: ReactNode;
    actions?: ReactNode;
    contentHeader?: ContentHeaderProps;
}

export default function AppLayout({ children, actions, contentHeader }: AppLayoutProps) {
    return (
        <MasterLayout actions={actions} mainNavItems={appMainNavItems} navGroups={appNavGroups} footerNavItems={appFooterNavItems}>
            {contentHeader && <ContentHeader {...contentHeader} />}
            {children}
        </MasterLayout>
    );
}
