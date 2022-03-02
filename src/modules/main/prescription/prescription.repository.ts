import { EntityRepository, Repository } from "typeorm";

import { Prescription } from "./prescription.entity";

@EntityRepository(Prescription)
export class PrescriptionRepository extends Repository<Prescription>{}