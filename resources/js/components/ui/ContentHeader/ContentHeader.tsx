import { Flex, theme } from 'antd';
import ContentHeaderCenter from './ContentHeaderCenter';
import ContentHeaderLeft from './ContentHeaderLeft';
import ContentHeaderRight from './ContentHeaderRight';
import type { ContentHeaderProps } from './types';

const { useToken } = theme;

const HEADER_HEIGHT = 40;

/**
 * Global page header component that sits below the app header.
 * Inspired by Odoo's page header design.
 *
 * Layout:
 * ┌────────────────────────────────────────────────────────────────────────────────────┐
 * │ [Primary] Breadcrumb [Icons]  │  InfoTabs  │  [Discard] [Save]  ◀ 1/10 ▶ │
 * └────────────────────────────────────────────────────────────────────────────────────┘
 *    └── Left section ─────────────┘  └ Center ─┘  └──── Right section ──────┘
 */
export default function ContentHeader({
    // Left section
    primaryAction,
    breadcrumb,
    actionIcons,
    // Center section
    infoTabs,
    // Right section
    isDirty,
    isSaving,
    onSave,
    onDiscard,
    saveLabel,
    discardLabel,
    recordNavigation,
    actionButtons,
    // Layout options
    sticky = true,
}: ContentHeaderProps) {
    const { token } = useToken();

    // Check if there's any content to render
    const hasLeftContent = primaryAction || (breadcrumb && breadcrumb.length > 0) || (actionIcons && actionIcons.length > 0);
    const hasCenterContent = infoTabs && infoTabs.length > 0;
    const hasRightContent = (isDirty && onSave && onDiscard) || (recordNavigation && recordNavigation.total > 0) || (actionButtons && actionButtons.length > 0);

    if (!hasLeftContent && !hasCenterContent && !hasRightContent) {
        return null;
    }

    return (
        <Flex
            align="center"
            justify="space-between"
            style={{
                height: 44,
                paddingLeft: token.paddingMD,
                paddingRight: token.paddingMD,
                background: token.colorBgLayout,
                ...(sticky && {
                    position: 'sticky',
                    top: HEADER_HEIGHT,
                    zIndex: 9,
                }),
            }}
        >
            {/* Left Section */}
            <ContentHeaderLeft
                primaryAction={primaryAction}
                breadcrumb={breadcrumb}
                actionIcons={actionIcons}
            />

            {/* Center Section */}
            <ContentHeaderCenter infoTabs={infoTabs} />

            {/* Right Section */}
            <ContentHeaderRight
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={onSave}
                onDiscard={onDiscard}
                saveLabel={saveLabel}
                discardLabel={discardLabel}
                recordNavigation={recordNavigation}
                actionButtons={actionButtons}
            />
        </Flex>
    );
}
