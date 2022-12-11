export interface ContractNotesDto {
    id: number;
    title: string;
    note: string;
    idcontract: number;
    state: number;
    iduser: number;
    username?: string;
    date?: string;
}