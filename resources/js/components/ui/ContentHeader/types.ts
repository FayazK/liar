import type { IconName } from '@/components/ui/Icon';
import type { BreadcrumbItem } from '@/types';

/**
 * Primary action button configuration
 */
export interface ContentHeaderAction {
    label: string;
    icon?: IconName;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
}

/**
 * Icon-only action button configuration
 */
export interface ContentHeaderIcon {
    icon: IconName;
    tooltip?: string;
    onClick: () => void;
    disabled?: boolean;
}

/**
 * Info tab configuration for center section
 */
export interface ContentHeaderInfoTab {
    key: string;
    icon?: IconName;
    label: string;
    value?: string | number;
    onClick?: () => void;
}

/**
 * Record pagination configuration
 */
export interface ContentHeaderRecordNav {
    current: number;
    total: number;
    onPrevious: () => void;
    onNext: () => void;
    label?: string;
}

/**
 * Props for the left section of ContentHeader
 */
export interface ContentHeaderLeftProps {
    primaryAction?: ContentHeaderAction;
    breadcrumb?: BreadcrumbItem[];
    actionIcons?: ContentHeaderIcon[];
}

/**
 * Props for the center section of ContentHeader
 */
export interface ContentHeaderCenterProps {
    infoTabs?: ContentHeaderInfoTab[];
}

/**
 * Props for the right section of ContentHeader
 */
export interface ContentHeaderRightProps {
    isDirty?: boolean;
    isSaving?: boolean;
    onSave?: () => void;
    onDiscard?: () => void;
    saveLabel?: string;
    discardLabel?: string;
    recordNavigation?: ContentHeaderRecordNav;
}

/**
 * Complete props for the ContentHeader component
 */
export interface ContentHeaderProps extends ContentHeaderLeftProps, ContentHeaderCenterProps, ContentHeaderRightProps {
    sticky?: boolean;
}
