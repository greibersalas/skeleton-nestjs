import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    expression: `select
	maa.date,concat_ws(' ',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
    ch.attorney,ch."documentNumber" AS patient_doc_num, ch.phone,
    ta.name as tariff,(maa.quantity*maa.value) AS amount,co.code as coin,
    pm.name as paymentmethod,
    'attention' as origin
    from medical_act_attention maa
    inner join clinic_history ch ON ch.id = maa."patientId"
    inner join tariff ta on ta.id = maa."tariffId"
    inner join coin co on co.id = maa."coId"
    inner join payment_method pm on pm.id = maa.idpaymentmethod
    where 
    maa.state = 2
    union all
    select
    qp.payment_date as date,
    concat_ws(' ',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
    ch.attorney,ch."documentNumber" AS patient_doc_num, ch.phone,
    ta.name as tariff,qp.amount,co.code as coin, pm.name as paymentmethod,
    'contract' as origin
    from contract_quota_payment qp
    inner join contract ct on ct.id = qp.idcontract
    inner join clinic_history ch on ch.id = ct.idclinichistory
    inner join tariff ta on ta.id = qp.idtariff
    inner join coin co on co.id = qp.idcoin
    inner join payment_method pm on pm.id = qp.idpaymentmethod
    where qp.state = 2`
})
export class ViewReportDailyPayments {
    @ViewColumn()
    date: string;

    @ViewColumn()
    patient: string;

    @ViewColumn()
    attorney: string;

    @ViewColumn()
    patient_doc_num: string;

    @ViewColumn()
    phone: string;

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