import { ContractDetailDto } from "./contract-detail-dto";

export interface ContractQuotaPaymentDto {
    id: number;
    payment_date: string;
    coin: number;
    amount: number;
    observation: string;
    file_name: string;
    file_ext: string;
    bank: string;
    state: number;
    iduser: number;
    contract_detail?: ContractDetailDto[];
}