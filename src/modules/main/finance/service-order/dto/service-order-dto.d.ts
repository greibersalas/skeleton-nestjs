import { ServiceOrderDetailDto } from "./service-order-detail-dto";

export interface ServiceOrderDto {
    id: number;
    idclinichistory: number;
    type: string;
    state: number;
    num_doc: string;
    date_doc: string;
    date_order?: string;
    patient_doc?: string;
    history?: string;
    patient?: string;
    detail?: ServiceOrderDetailDto[]
}