export interface NavigationItemDto {
    id: number;
    title: string;
    type: 'item' | 'collapse' | 'group';
    translate?: string;
    icon?: string;
    hidden?: boolean;
    url?: string;
    classes?: string;
    exactMatch?: boolean;
    external?: boolean;
    target?: boolean;
    breadcrumbs?: boolean;
    function?: any;
    badge?: {
        title?: string;
        type?: string;
    };
    children?: NavigationDto[];
    idpermission?: number;
    active?: boolean;
    can_insert?: boolean;
    can_update?: boolean;
    can_delete?: boolean;
    father?: string;
    idfather?: number;
    idmodule?: number;
    icon_father?: string;
}

export interface NavigationDto extends NavigationItemDto {
    children?: NavigationItemDto[];
}
