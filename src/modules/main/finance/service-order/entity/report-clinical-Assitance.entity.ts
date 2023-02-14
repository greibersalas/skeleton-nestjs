import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    expression: `select
	maa.date,concat_ws(' ',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
    ch.attorney,ch."documentNumber" AS patient_doc_num,ch.invoise_num_document,
    ch.history,date_part('year', age(ch.birthdate)) as patient_age,
    dc."nameQuote" AS doctor, bl.name AS business_line,sp.name AS specialty,
    ta.name as tariff,
    (maa.quantity*maa.value) AS amount,co.code as coin,
    pm.name as paymentmethod,
    'attention' as origin
    from medical_act_attention maa
    inner join clinic_history ch ON ch.id = maa."patientId"
    inner join tariff ta on ta.id = maa."tariffId"
    inner join business_line bl on bl.id = maa."businesslineId"
        inner join specialty sp on sp.id = maa."specialtyId"
        inner join doctor dc on dc.id = maa."doctorId"
    inner join coin co on co.id = maa."coId"
    inner join payment_method pm on pm.id = maa.idpaymentmethod
    where 
    maa.state = 2

    union all
    select
    qp.payment_date as date,
    concat_ws(' ',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
    ch.attorney,ch."documentNumber" AS patient_doc_num, ch.invoise_num_document,
    ch.history,date_part('year', age(ch.birthdate)) as patient_age,
    dc."nameQuote" AS doctor, bl.name AS business_line,
    sp.name AS specialty,ta.name as tariff,
    qp.amount,co.code as coin, pm.name as paymentmethod,
    'contract' as origin
    from contract_quota_payment qp
    inner join contract ct on ct.id = qp.idcontract
    inner join clinic_history ch on ch.id = ct.idclinichistory
    JOIN business_line bl ON bl.id = qp.idbusinessline
    JOIN specialty sp ON sp.id = qp.idspecialty
    JOIN tariff ta ON ta.id = qp.idtariff
    inner join coin co on co.id = qp.idcoin
    JOIN doctor dc ON dc.id = qp.iddoctor
    inner join payment_me`
})

export class ViewReportClinicalAssistance {
    @ViewColumn()
    date: string;

    @ViewColumn()
    patient: string;

    @ViewColumn()
    attorney: string;

    @ViewColumn()
    patient_doc_num: string;

    @ViewColumn()
    invoise_num_document: string;

    @ViewColumn()
    history: string;

    @ViewColumn()
    patient_age: string;

    @ViewColumn()
    doctor: string;

    @ViewColumn()
    business_line: string;

    @ViewColumn()
    specialty: string;

    @ViewColumn()
    tariff: string;

    @ViewColumn()
    amount: number;

    @ViewColumn()
    coin: string;

    @ViewColumn()
    paymentmethod: string;

    @ViewColumn()
    origin: string;
}