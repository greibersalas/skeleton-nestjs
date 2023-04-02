import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `select dp.iddoctor, doc."nameQuote" AS doctor,
    dp.idenvironmentdoctor, ed.name AS environmentdoctor,
    dp.idcampus, ca.name as campus,
    dp.date_since, dp.date_until,
    dp.time_since, dp.time_until,
    dp.interval, dp.status,
    dp.schedule_type, dp.mon, dp.tue, dp.wed, dp.thu, dp.fri, dp.sat, dp.sun
  from doctor_programming dp
  inner join doctor doc on doc.id = dp.iddoctor
  inner join environment_doctor ed on ed.id = dp.idenvironmentdoctor
  inner join campus ca on ca.id = dp.idcampus
  where dp.status <> 0
  order by doc."nameQuote", dp.time_since,ed.name`
})
export class ViewDoctorProgramming {
  @ViewColumn()
  iddoctor: number;

  @ViewColumn()
  doctor: string;

  @ViewColumn()
  idenvironmentdoctor: number;

  @ViewColumn()
  environmentdoctor: string;

  @ViewColumn()
  idcampus: number;

  @ViewColumn()
  campus: string;

  @ViewColumn()
  date_since: string;

  @ViewColumn()
  date_until: string;

  @ViewColumn()
  time_since: string;

  @ViewColumn()
  time_until: string;

  @ViewColumn()
  interval: number;

  @ViewColumn()
  status: number;
}