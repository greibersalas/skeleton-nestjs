
export interface ServiceOrderDto {
    id: number;
    quantity: number;
    amount: number;
    idclinichistory: number;
    medicalactId: number;
    businesslineId: number;
    specialtyId: number;
    tariffId: number;
    doctorId: number;
    idpaymentmethod: number;
    patient: string;
    history: string;
    patient_doc_num: string;
    business_line: string;
    specialty: string;
    tariff: string;
    doctor: string;
    payment_method: string;
    idcoin: number;
    coin: string;
    date: string;
    status: string;
}