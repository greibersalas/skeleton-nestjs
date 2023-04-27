export interface DoctorProgrammingDto {
    id: number;
    iddoctor: number;
    doctor: string;
    idenvironmentdoctor: number;
    environmentdoctor: string;
    date_since: string;
    date_until: string;
    time_since: string;
    time_until: string;
    interval: number;
    idcampus: number;
    campus: string;
    status: number;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
    schedule_type: string;
    lock_time_since: string;
    lock_time_until: string;
}