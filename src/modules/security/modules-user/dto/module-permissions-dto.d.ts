export interface ModulesPermissionsDto {
    id: number;
    iduser: number;
    idsubmodule: number;
    active: boolean;
    can_insert: boolean;
    cant_update: boolean;
    can_delete: boolean;
    status: number;
    submodule?: string;
    idmodule?: number;
    module?: string;
    idfather: number;
    father_name: string;
}