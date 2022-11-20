export interface ContractDetailDto {
    id: number;
    idcontract: number;
    description: string;
    observation: string;
    date: string;
    amount: number;
    balance: number;
    state: number;
    check?: boolean;
}