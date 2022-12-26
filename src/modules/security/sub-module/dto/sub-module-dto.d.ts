export interface SubModuleDto {
    id: number;
    title: string;
    type: 'item' | 'collapse' | 'group';
    description: string;
    status: number;
    module: number;
    module_name: string;
    code?: string;
    icon?: string;
    url?: string;
    target?: boolean;
    breadcrumbs?: boolean;
    children?: Navigation[];
}

export interface Navigation extends SubModuleDto {
    children?: SubModuleDto[];
}