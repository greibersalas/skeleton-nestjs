import { EntityRepository, Repository } from "typeorm";
import { EnvironmentDoctor } from "./environment-doctor.entity";

@EntityRepository(EnvironmentDoctor)
export class EnvironmentDoctorRepository extends Repository<EnvironmentDoctor>{}