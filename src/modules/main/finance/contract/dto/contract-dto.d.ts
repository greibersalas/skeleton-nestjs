export interface ContractDto {
    id: number;
    idclinichistory: number;
    type: string;
    date: string;
    duration: number;
    amount: number;
    quota: number;
    exchange_house: string;
    exchange_house_url: string;
    amount_controls: number;
    num: string;
    state: number;
    executive?: string;
    detail?: any[];
    patient?: string;
    patient_doc?: string;
    history?: string;
    balance?: number;
    signature?: string;
}