export interface PaymentDetailDto {
    id: number;
    idcontractdetail: number;
    amount: number
    description: string;
    quota_date: string;
    quota_amount: number;
    observation: string;
}