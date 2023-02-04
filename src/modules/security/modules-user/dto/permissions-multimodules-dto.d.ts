export interface PermissionsMultiModules {
    iduser: number;
    idsubmodule: number[];
    active: boolean;
    can_insert: boolean;
    can_update: boolean;
    can_delete: boolean;
    list?: any[]
}