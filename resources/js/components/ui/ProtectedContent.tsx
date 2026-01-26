import { usePermissionCheck } from '@/hooks/use-permission';
import type { ReactNode } from 'react';

interface ProtectedContentProps {
    permission: string | string[];
    fallback?: ReactNode;
    requireAll?: boolean;
    children: ReactNode;
}

export function ProtectedContent({ permission, fallback = null, requireAll = false, children }: ProtectedContentProps) {
    const { can, canAny, canAll } = usePermissionCheck();

    const hasPermission = Array.isArray(permission)
        ? requireAll
            ? canAll(permission)
            : canAny(permission)
        : can(permission);

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
