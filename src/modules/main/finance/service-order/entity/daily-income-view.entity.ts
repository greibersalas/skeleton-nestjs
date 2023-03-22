import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    expression: `select
        maa.id, maa."doctorId", dc."nameQuote" as doctor, ch.invoise_type_document as type_doc,
    ch.invoise_num_document as num_doc, ch.attorney, maa."patientId" AS idclinichistory,
    ch.email, ch.history, ch."documentNumber" AS patient_doc_num, concat_ws(' ',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
    date_part('year', age(ch.birthdate)) as patient_age, maa."businesslineId",bl.name as business_line,
    maa."tariffId",sp.name as specialty,ta.name as tariff, (maa.quantity*maa.value) AS amount,
    'attention' as origin, co.code as coin,
    maa.date,
    maa.state AS status,
    pm.name AS payment_method,
        CASE
            WHEN maa.idbankaccount IS NOT NULL THEN concat_ws(' '::text, bk.name, co.code, ba.account_num)
            ELSE NULL::text
        END AS bank_account,
    maa.operation_number,
    maa.document_type,
    maa.document_number,
    maa.document_date,
    maa.iddiscounttype,
    dt.name AS discount_type_name,
    maa.discount_type,
    maa.discount_amount,
    maa.created_at::time without time zone AS created_hour,
    us.username
    from medical_act_attention maa
    inner join clinic_history ch ON ch.id = maa."patientId"
    inner join business_line bl on bl.id = maa."businesslineId"
    inner join specialty sp on sp.id = maa."specialtyId"
    inner join tariff ta on ta.id = maa."tariffId"
    inner join doctor dc on dc.id = maa."doctorId"
    inner join coin co on co.id = maa."coId"
    LEFT JOIN bank_accounts ba ON ba.id = maa.idbankaccount
     LEFT JOIN banks bk ON bk.id = ba.idbank
     LEFT JOIN payment_method pm ON pm.id = maa.idpaymentmethod
     LEFT JOIN discount_type dt ON dt.id = maa.iddiscounttype
     JOIN users us ON us.id = maa."userId"
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

    @ViewColumn()
    iddiscounttype: number;

    @ViewColumn()
    discount_type_name: string;

    @ViewColumn()
    discount_type: string;

    @ViewColumn()
    discount_amount: number;

    @ViewColumn()
    created_hour: string;

    @ViewColumn()
    username: string;
}