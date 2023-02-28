import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `select
	maa.id, maa.quantity, maa.value AS amount, maa."patientId" AS idclinichistory,
  maa."medicalactId", maa."businesslineId", maa."specialtyId", maa."tariffId", maa."doctorId",
  maa.idpaymentmethod, concat_ws('',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
  ch.history, ch."documentNumber" AS patient_doc_num, bl.name as business_line, sp.name as specialty,
  ta.name as tariff, dc."nameQuote" as doctor, pm.name as payment_method, co.id as idcoin, co.code as coin,
  maa.date, maa.state as status, maa.idbankaccount, maa.operation_number, maa.document_type, maa.document_number, maa.document_date,
  'attention' as origin,
  ch.attorney as client,
  ch.invoise_type_document as client_doc_type,
  ch.invoise_num_document as client_doc_num,
  maa.created_at AS invoise_date,
  case when maa.idbankaccount is not null then
  concat_ws(' ', bk.name, co.code , ba.account_num)
  else null end as bank_account,
  maa.idfile,
  maf.fila_name AS file_name,
  maf.file_ext,
  maa.status_payment
from medical_act_attention maa
inner join clinic_history ch ON ch.id = maa."patientId"
inner join business_line bl on bl.id = maa."businesslineId"
inner join specialty sp on sp.id = maa."specialtyId"
inner join tariff ta on ta.id = maa."tariffId"
inner join doctor dc on dc.id = maa."doctorId"
left join payment_method pm on pm.id = maa.idpaymentmethod
inner join coin co on co.id = maa."coId"
LEFT JOIN bank_accounts ba on ba.id = maa.idbankaccount
LEFT JOIN banks bk on bk.id = ba.idbank
LEFT JOIN medical_act_files maf ON maf.id = maa.idfile`
})
export class ViewServiceOrder {
  @ViewColumn()
  id: number;

  @ViewColumn()
  quantity: number;

  @ViewColumn()
  amount: number;

  @ViewColumn()
  idclinichistory: number;

  @ViewColumn()
  medicalactId: number;

  @ViewColumn()
  businesslineId: number;

  @ViewColumn()
  specialtyId: number;

  @ViewColumn()
  tariffId: number;

  @ViewColumn()
  doctorId: number;

  @ViewColumn()
  idpaymentmethod: number;

  @ViewColumn()
  patient: string;

  @ViewColumn()
  history: string;

  @ViewColumn()
  patient_doc_num: string;

  @ViewColumn()
  business_line: string;

  @ViewColumn()
  specialty: string;

  @ViewColumn()
  tariff: string;

  @ViewColumn()
  doctor: string;

  @ViewColumn()
  payment_method: string;

  @ViewColumn()
  idcoin: number;

  @ViewColumn()
  coin: string;

  @ViewColumn()
  date: string;

  @ViewColumn()
  status: number;

  @ViewColumn()
  client: string;

  @ViewColumn()
  client_doc_type: string;

  @ViewColumn()
  client_doc_num: string;

  @ViewColumn()
  invoise_date: string;

  @ViewColumn()
  bank_account: string;

  @ViewColumn()
  idfile: number;

  @ViewColumn()
  file_name: string;

  @ViewColumn()
  file_ext: string;

  @ViewColumn()
  status_payment: number;
}