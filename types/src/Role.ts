import { PERMISSIONS_STRING } from "./Permission";

export interface Role {
    id: number;
    name: string;
    permissions: RolePermission[];
}

export interface RolePermission {
    permissionId: number;
    permission_string: PERMISSIONS_STRING;
}