import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { can, canAny, canAll } from '@/utils/permissions';

/**
 * Hook to check if user has a specific permission.
 */
export function usePermission(permissionKey: string): boolean {
    const { auth } = usePage<SharedData>().props;
    return can(permissionKey, auth.user?.permissions);
}

/**
 * Hook to get all user permissions.
 */
export function usePermissions(): string[] {
    const { auth } = usePage<SharedData>().props;
    return auth.user?.permissions || [];
}

/**
 * Hook to get permission check functions.
 */
export function usePermissionCheck() {
    const { auth } = usePage<SharedData>().props;
    const userPermissions = auth.user?.permissions;

    return {
        can: (permissionKey: string) => can(permissionKey, userPermissions),
        canAny: (permissionKeys: string[]) => canAny(permissionKeys, userPermissions),
        canAll: (permissionKeys: string[]) => canAll(permissionKeys, userPermissions),
    };
}
