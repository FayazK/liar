import type { Icon as TablerIconRef } from '@tabler/icons-react';
import { forwardRef, type CSSProperties } from 'react';

import { iconMap } from './icon-map';
import type { IconProps } from './types';

/**
 * Icon wrapper component that provides:
 * 1. Abstraction over the icon library (Tabler)
 * 2. Type-safe icon names with autocomplete
 * 3. Spin animation support for loading states
 */
export const Icon = forwardRef<TablerIconRef, IconProps>(({ name, style, className, spin, size, color, ...props }, ref) => {
    const TablerIcon = iconMap[name];

    if (!TablerIcon) {
        console.warn(`Icon "${name}" not found in icon map`);
        return null;
    }

    // Build final style object with spin animation if needed
    const finalStyle: CSSProperties = {
        ...style,
        ...(spin && {
            animation: 'icon-spin 1s linear infinite',
        }),
    };

    return <TablerIcon ref={ref} size={size} color={color} style={finalStyle} className={className} {...props} />;
});

Icon.displayName = 'Icon';
