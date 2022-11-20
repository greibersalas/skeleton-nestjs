import { PaymentDetailDto } from "./payment-detail-dto";

export interface PaymentDto {
    id: number;
    payment_date: string;
    idcoin: number;
    amount: number;
    observation: string;
    state: number;
    file_name: string;
    file_ext: string;
    coin: string;
    idcontract: number;
    cuotas: number;
    idclinichistory: number;
    num_contract: string;
    patient: string;
    history: string;
    bank?: string;
    patient_doc?: string;
    detail?: PaymentDetailDto[];
}