import {
    IconAlertCircle,
    IconAlertTriangle,
    IconAlignLeft,
    IconApi,
    IconArrowDown,
    IconArrowLeft,
    IconArrowsSort,
    IconArrowUp,
    IconBell,
    IconBolt,
    IconChartBar,
    IconCheck,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronUp,
    IconClock,
    IconCode,
    IconCreditCard,
    IconCurrencyDollar,
    IconDashboard,
    IconDatabase,
    IconDeviceDesktop,
    IconDotsVertical,
    IconDownload,
    IconEdit,
    IconEye,
    IconFile,
    IconFileText,
    IconFileTypePdf,
    IconFileTypeDoc,
    IconFileTypePpt,
    IconFileTypeXls,
    IconFileZip,
    IconFilter,
    IconFolder,
    IconFolderOpen,
    IconFolderPlus,
    IconGlobe,
    IconGripVertical,
    IconHome,
    IconInbox,
    IconLayoutGrid,
    IconLayoutList,
    IconLayoutSidebar,
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconLayoutSidebarRight,
    IconLink,
    IconLoader2,
    IconLock,
    IconLogin,
    IconLogout,
    IconMail,
    IconMenu2,
    IconMessage,
    IconMoon,
    IconMusic,
    IconPalette,
    IconPhone,
    IconPhoto,
    IconPlayerPlay,
    IconPlus,
    IconRefresh,
    IconRocket,
    IconSearch,
    IconSettings,
    IconShield,
    IconShieldCheck,
    IconShoppingCart,
    IconSortAscending,
    IconSortDescending,
    IconStar,
    IconStarFilled,
    IconSun,
    IconTag,
    IconTrash,
    IconTrendingUp,
    IconUpload,
    IconUser,
    IconUserPlus,
    IconUsers,
    IconUsersGroup,
    IconWorld,
} from '@tabler/icons-react';

import type { IconName, TablerIconComponent } from './types';

/**
 * Mapping from icon names to Tabler icon components
 * TypeScript will error if any IconName is missing
 */
export const iconMap: Record<IconName, TablerIconComponent> = {
    // Navigation & Layout
    dashboard: IconDashboard,
    menu: IconMenu2,
    'menu-fold': IconLayoutSidebarLeftCollapse,
    'menu-unfold': IconLayoutSidebarLeftExpand,
    home: IconHome,
    'layout-grid': IconLayoutGrid,
    'layout-list': IconLayoutList,
    'layout-sidebar': IconLayoutSidebar,
    'layout-sidebar-left-collapse': IconLayoutSidebarLeftCollapse,
    'layout-sidebar-right': IconLayoutSidebarRight,

    // User & Auth
    user: IconUser,
    'user-plus': IconUserPlus,
    users: IconUsers,
    'users-group': IconUsersGroup,
    login: IconLogin,
    logout: IconLogout,
    lock: IconLock,
    shield: IconShield,
    'shield-check': IconShieldCheck,

    // Settings & Preferences
    settings: IconSettings,
    palette: IconPalette,

    // Finance
    'credit-card': IconCreditCard,

    // Actions
    search: IconSearch,
    edit: IconEdit,
    trash: IconTrash,
    download: IconDownload,
    upload: IconUpload,
    plus: IconPlus,
    refresh: IconRefresh,
    filter: IconFilter,
    dots: IconDotsVertical,
    eye: IconEye,

    // Files & Folders
    folder: IconFolder,
    'folder-open': IconFolderOpen,
    'folder-plus': IconFolderPlus,
    file: IconFile,
    'file-text': IconFileText,
    'file-image': IconPhoto,
    'file-pdf': IconFileTypePdf,
    'file-word': IconFileTypeDoc,
    'file-excel': IconFileTypeXls,
    'file-ppt': IconFileTypePpt,
    'file-zip': IconFileZip,
    photo: IconPhoto,
    video: IconPlayerPlay,
    music: IconMusic,

    // Status & Feedback
    loader: IconLoader2,
    'alert-circle': IconAlertCircle,
    mail: IconMail,
    phone: IconPhone,

    // Data & Analytics
    'chart-bar': IconChartBar,
    database: IconDatabase,
    'trending-up': IconTrendingUp,
    'currency-dollar': IconCurrencyDollar,
    'shopping-cart': IconShoppingCart,
    clock: IconClock,

    // Features & Misc
    api: IconApi,
    code: IconCode,
    world: IconWorld,
    rocket: IconRocket,
    bolt: IconBolt,

    // Theme & Appearance
    sun: IconSun,
    moon: IconMoon,
    'device-desktop': IconDeviceDesktop,

    // Additional
    inbox: IconInbox,
    bell: IconBell,
    check: IconCheck,

    // Chevrons
    'chevron-right': IconChevronRight,
    'chevron-down': IconChevronDown,
    'chevron-left': IconChevronLeft,
    'chevron-up': IconChevronUp,

    // Arrows & Sorting
    'arrow-up': IconArrowUp,
    'arrow-down': IconArrowDown,
    'arrows-sort': IconArrowsSort,
    'sort-ascending': IconSortAscending,
    'sort-descending': IconSortDescending,

    // Favorites
    star: IconStar,
    'star-filled': IconStarFilled,

    // Drag & Drop
    'grip-vertical': IconGripVertical,

    // Misc
    'dots-vertical': IconDotsVertical,

    // Content & Posts
    'arrow-left': IconArrowLeft,
    'align-left': IconAlignLeft,
    tag: IconTag,
    message: IconMessage,
    link: IconLink,
    globe: IconGlobe,
    warning: IconAlertTriangle,
};
