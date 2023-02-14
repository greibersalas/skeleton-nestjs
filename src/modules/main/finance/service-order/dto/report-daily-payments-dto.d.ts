export interface ReportDailyPaymentsDto {
    date: string;
    patient: string;
    attorney: string;
    patient_doc_num: string;
    phone: string;
    tariff: string;
    amount: number;
    coin: string;
    paymentmethod: string;
    origin: string;
}