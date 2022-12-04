export class KpiQuotaDetailDto {
    idcontract: number;
    idclinichistory: number;
    num_contract: string;
    description: string;
    date: string;
    amount: number;
    observation: string;
    patient: string;
    history: string;
    patient_document: string;
    patient_phone: string;
    patient_email: string;
    dayDelinquency?: number;
}

export class KpiQuotaDto {
    overdueQuota: number;
    quotaExpiration: number;
    kpiQuotaDetail: KpiQuotaDetailDto[]
}