import { Doctor } from "../doctor/doctor.entity";
import { BusinessLine } from "../business-line/business-line.entity";
import { Specialty } from "../specialty/specialty.entity";
import { EnvironmentDoctor } from "../environment-doctor/environment-doctor.entity";

export class FormFilter{
    doctor: Doctor;
    bl: BusinessLine;
    specialty: Specialty;
    environment: EnvironmentDoctor;
    register:boolean;
    confirm:boolean;
    attended:boolean;
    patient:PatientList;
  }

  export class PatientList{
    id:number;
    name:string;
    lastname:string;
    dni:string;
  }