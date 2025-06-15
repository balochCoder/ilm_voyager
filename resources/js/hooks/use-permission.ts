import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';


export function usePermission() {
    const { auth } = usePage<SharedData>().props;

    const hasRole = (role: string ): boolean => {
        return auth.user.roles.includes(role);
    };

    // const hasAnyRole = (roles: (keyof typeof TenantRolesEnum)[]): boolean => {
    //     return roles.some(role => hasRole(role));
    // };

    // const hasAllRoles = (roles: (keyof typeof TenantRolesEnum)[]): boolean => {
    //     return roles.every(role => hasRole(role));
    // };

    // const hasPermission = (permission: string): boolean => {
    //     return auth.user.permissions.includes(permission);
    // };

    // const hasAnyPermission = (permissions: string[]): boolean => {
    //     return permissions.some(permission => hasPermission(permission));
    // };

    // const hasAllPermissions = (permissions: string[]): boolean => {
    //     return permissions.every(permission => hasPermission(permission));
    // };

    // const check = ({ role, roles, permission, permissions }: PermissionCheck): boolean => {
    //     if (role) return hasRole(role);
    //     if (roles) return hasAnyRole(roles);
    //     if (permission) return hasPermission(permission);
    //     if (permissions) return hasAnyPermission(permissions);
    //     return false;
    // };

    return {
        hasRole,
        // hasAnyRole,
        // hasAllRoles,
        // hasPermission,
        // hasAnyPermission,
        // hasAllPermissions,
        // check,
    };
}
