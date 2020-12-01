import { EntityRepository, Repository } from "typeorm";
import { Doctor } from "./doctor.entity";

@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor>{}