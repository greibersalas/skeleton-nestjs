import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    expression: `select
        maa.id, maa."doctorId", dc."nameQuote" as doctor, ch.invoise_type_document as type_doc,
    ch.invoise_num_document as num_doc, ch.attorney, maa."patientId" AS idclinichistory,
    ch.email, ch.history, ch."documentNumber" AS patient_doc_num, concat_ws(' ',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
    date_part('year', age(ch.birthdate)) as patient_age, maa."businesslineId",bl.name as business_line,
    maa."tariffId",sp.name as specialty,ta.name as tariff, (maa.quantity*maa.value) AS amount,
    'attention' as origin, co.code as coin
    from medical_act_attention maa
    inner join clinic_history ch ON ch.id = maa."patientId"
    inner join business_line bl on bl.id = maa."businesslineId"
    inner join specialty sp on sp.id = maa."specialtyId"
    inner join tariff ta on ta.id = maa."tariffId"
    inner join doctor dc on dc.id = maa."doctorId"
    inner join coin co on co.id = maa."coId"
    where 
    maa.state <> 0`
})
export class ViewDailyIncome {
    @ViewColumn()
    id: number;

    @ViewColumn()
    doctorId: number;

    @ViewColumn()
    doctor: string;

    @ViewColumn()
    type_doc: string;

    @ViewColumn()
    num_doc: string;

    @ViewColumn()
    attorney: string;

    @ViewColumn()
    idclinichistory: number;

    @ViewColumn()
    email: string;

    @ViewColumn()
    history: string;

    @ViewColumn()
    patient_doc_num: string;

    @ViewColumn()
    patient: string;

    @ViewColumn()
    patient_age: number;

    @ViewColumn()
    businesslineId: number;

    @ViewColumn()
    business_line: string;

    @ViewColumn()
    tariffId: number;

    @ViewColumn()
    specialty: string;

    @ViewColumn()
    tariff: string;

    @ViewColumn()
    amount: number;

    @ViewColumn()
    origin: string;

    @ViewColumn()
    coin: string;

    @ViewColumn()
    date: string;

    @ViewColumn()
    status: number;

    @ViewColumn()
    payment_method: string;

    @ViewColumn()
    bank_account: string;

    @ViewColumn()
    operation_number: string;

    @ViewColumn()
    document_type: string;

    @ViewColumn()
    document_number: string;

    @ViewColumn()
    document_date: string;
}