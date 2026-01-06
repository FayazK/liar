import type { IconProps as TablerIconProps } from '@tabler/icons-react';
import type { CSSProperties, ForwardRefExoticComponent, RefAttributes } from 'react';

/**
 * Icon name literals - provides autocomplete and type safety
 */
export type IconName =
    // Navigation & Layout
    | 'dashboard'
    | 'menu'
    | 'menu-fold'
    | 'menu-unfold'
    | 'home'
    // User & Auth
    | 'user'
    | 'user-plus'
    | 'users'
    | 'users-group'
    | 'login'
    | 'logout'
    | 'lock'
    | 'shield'
    | 'shield-check'
    // Settings & Preferences
    | 'settings'
    | 'palette'
    // Finance
    | 'credit-card'
    // Actions
    | 'search'
    | 'edit'
    | 'trash'
    | 'download'
    | 'upload'
    | 'plus'
    | 'refresh'
    | 'filter'
    | 'dots'
    | 'eye'
    // Files & Folders
    | 'folder'
    | 'folder-plus'
    | 'file'
    | 'file-text'
    | 'file-image'
    | 'file-pdf'
    | 'file-word'
    | 'file-excel'
    | 'file-ppt'
    | 'file-zip'
    | 'video'
    // Status & Feedback
    | 'loader'
    | 'alert-circle'
    | 'mail'
    | 'phone'
    // Data & Analytics
    | 'chart-bar'
    | 'database'
    | 'trending-up'
    | 'currency-dollar'
    | 'shopping-cart'
    | 'clock'
    // Features & Misc
    | 'api'
    | 'code'
    | 'world'
    | 'rocket'
    | 'bolt'
    // Theme & Appearance
    | 'sun'
    | 'moon'
    | 'device-desktop'
    // Additional
    | 'inbox'
    | 'bell'
    | 'check'
    // Chevrons
    | 'chevron-right'
    | 'chevron-down'
    | 'chevron-left'
    | 'chevron-up'
    // Arrows & Sorting
    | 'arrow-up'
    | 'arrow-down'
    | 'arrows-sort'
    // Drag & Drop
    | 'grip-vertical';

/**
 * Props for the Icon wrapper component
 */
export interface IconProps extends Omit<TablerIconProps, 'ref'> {
    /** The icon name from the IconName union type */
    name: IconName;
    /** Optional className for additional styling */
    className?: string;
    /** Optional inline styles */
    style?: CSSProperties;
    /** Whether the icon should spin (for loading states) */
    spin?: boolean;
}

/**
 * Tabler icon component type
 */
export type TablerIconComponent = ForwardRefExoticComponent<TablerIconProps & RefAttributes<SVGSVGElement>>;
