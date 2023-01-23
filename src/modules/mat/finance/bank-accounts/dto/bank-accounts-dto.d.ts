export interface BankAccountsDto {
    id: number;
    bank: number;
    coin: number;
    account_num: string;
    beneficiary: string;
    amount: number;
    status: number;
    bank_name?: string;
    coin_name?: string;
}