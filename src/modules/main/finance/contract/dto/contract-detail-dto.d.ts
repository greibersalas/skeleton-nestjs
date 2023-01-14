export interface ContractDetailDto {
    id: number;
    idcontract: number;
    description: string;
    observation: string;
    date: string;
    amount: number;
    balance: number;
    discount: number;
    state: number;
    check?: boolean;
}