import { PERMISSIONS_STRING } from "./Permission";

export interface Role {
    id: number;
    name: string;
}

export interface RolePermission {
    permissionId: number;
    permission_string: PERMISSIONS_STRING;
}