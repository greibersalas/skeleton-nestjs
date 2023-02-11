import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `select
	maa.id, maa.quantity, maa.value AS amount, maa."patientId" AS idclinichistory,
  maa."medicalactId", maa."businesslineId", maa."specialtyId", maa."tariffId", maa."doctorId",
  maa.idpaymentmethod, concat_ws('',ch.name, ch."lastNameFather", ch."lastNameMother") AS patient,
  ch.history, ch."documentNumber" AS patient_doc_num, bl.name as business_line, sp.name as specialty,
  ta.name as tariff, dc."nameQuote" as doctor, pm.name as payment_method, co.id as idcoin, co.code as coin,
  maa.date, maa.state as status, maa.idbankaccount, maa.operation_number, maa.document_type, maa.document_number, maa.document_date
from medical_act_attention maa
inner join clinic_history ch ON ch.id = maa."patientId"
inner join business_line bl on bl.id = maa."businesslineId"
inner join specialty sp on sp.id = maa."specialtyId"
inner join tariff ta on ta.id = maa."tariffId"
inner join doctor dc on dc.id = maa."doctorId"
inner join payment_method pm on pm.id = maa.idpaymentmethod
inner join coin co on co.id = maa."coId"`
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
}