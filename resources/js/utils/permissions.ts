import type { Permission, SharedData } from '@/types';

/**
 * Check if user is a root user (super admin by email).
 * Root users bypass ALL permission checks.
 */
export function isRootUser(user?: SharedData['auth']['user']): boolean {
    return user?.is_root_user === true;
}

/**
 * Check if user has a specific permission.
 */
export function can(permissionKey: string, userPermissions?: string[], user?: SharedData['auth']['user']): boolean {
    // Root user bypass - highest priority
    if (isRootUser(user)) {
        return true;
    }

    if (!userPermissions) {
        return false;
    }

    return userPermissions.includes(permissionKey);
}

/**
 * Check if user has any of the specified permissions.
 */
export function canAny(permissionKeys: string[], userPermissions?: string[], user?: SharedData['auth']['user']): boolean {
    // Root user bypass - highest priority
    if (isRootUser(user)) {
        return true;
    }

    if (!userPermissions) {
        return false;
    }

    return permissionKeys.some((key) => userPermissions.includes(key));
}

/**
 * Check if user has all of the specified permissions.
 */
export function canAll(permissionKeys: string[], userPermissions?: string[], user?: SharedData['auth']['user']): boolean {
    // Root user bypass - highest priority
    if (isRootUser(user)) {
        return true;
    }

    if (!userPermissions) {
        return false;
    }

    return permissionKeys.every((key) => userPermissions.includes(key));
}

/**
 * Group permissions by module.
 */
export function groupPermissionsByModule(permissions: Permission[]): Record<string, Permission[]> {
    return permissions.reduce(
        (grouped, permission) => {
            if (!grouped[permission.module]) {
                grouped[permission.module] = [];
            }
            grouped[permission.module].push(permission);
            return grouped;
        },
        {} as Record<string, Permission[]>,
    );
}
