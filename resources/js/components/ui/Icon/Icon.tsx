import { forwardRef, type CSSProperties } from 'react';

import { iconMap } from './icon-map';
import type { IconProps } from './types';

/**
 * Icon wrapper component that provides:
 * 1. Abstraction over the icon library (Tabler)
 * 2. Type-safe icon names with autocomplete
 * 3. Spin animation support for loading states
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, style, className, spin, size, color, ...props }, ref) => {
    const TablerIcon = iconMap[name];

    if (!TablerIcon) {
        return null;
    }

    // Build final style object with proper alignment and spin animation if needed
    const finalStyle: CSSProperties = {
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
        ...(spin && {
            animation: 'icon-spin 1s linear infinite',
        }),
    };

    return <TablerIcon ref={ref} size={size} color={color} style={finalStyle} className={className} {...props} />;
});

Icon.displayName = 'Icon';
