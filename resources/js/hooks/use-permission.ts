import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { can, canAny, canAll, isRootUser } from '@/utils/permissions';

/**
 * Hook to check if user has a specific permission.
 */
export function usePermission(permissionKey: string): boolean {
    const { auth } = usePage<SharedData>().props;
    return can(permissionKey, auth.user?.permissions, auth.user);
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
    const user = auth.user;

    return {
        can: (permissionKey: string) => can(permissionKey, userPermissions, user),
        canAny: (permissionKeys: string[]) => canAny(permissionKeys, userPermissions, user),
        canAll: (permissionKeys: string[]) => canAll(permissionKeys, userPermissions, user),
        isRootUser: () => isRootUser(user),
    };
}
