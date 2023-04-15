import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `select ic.id,
    ic.idclinichistory,
    concat_ws(' ',ch."lastNameFather",ch."lastNameMother",ch.name) as patient,
    ic.date,
    ic.arrival_time,
    ic.office_admission_time,
    ic.office_departure_time,
    ic.departure_time,
    ic.reason_attendance,
    ic.reason,
    ic.observations,
    ic.iduser,
    us.username as user,
    ic.status,
	ic.idreservation,
	re.appointment,
  ch.history,
  ch."documentNumber" as patient_num_document
from incidents ic
inner join clinic_history ch on ch.id = ic.idclinichistory
inner join users us on us.id = ic.iduser
inner join reservation re on re.id = ic.idreservation
where ic.status <> 0`
})
export class ViewIncidents {
  @ViewColumn()
  id: number;

  @ViewColumn()
  idclinichistory: number;

  @ViewColumn()
  patient: string;

  @ViewColumn()
  date: string;

  @ViewColumn()
  arrival_time: string;

  @ViewColumn()
  office_admission_time: string;

  @ViewColumn()
  office_departure_time: string;

  @ViewColumn()
  departure_time: string;

  @ViewColumn()
  reason_attendance: string;

  @ViewColumn()
  reason: string;

  @ViewColumn()
  observations: string;

  @ViewColumn()
  iduser: number;

  @ViewColumn()
  user: string;

  @ViewColumn()
  status: number;

  @ViewColumn()
  idreservation: number;

  @ViewColumn()
  appointment: string;

  @ViewColumn()
  history: string;

  @ViewColumn()
  patient_num_document: string;
}