export interface IncidentDto {
    id: number;
    idclinichistory: number;
    patient: string;
    date: string;
    arrival_time: string;
    office_admission_time: string;
    office_departure_time: string;
    departure_time: string;
    reason_attendance: string;
    reason: string;
    observations: string;
    iduser: number;
    user: string;
    status: number;
    idreservation: number;
    appointment: string;
}