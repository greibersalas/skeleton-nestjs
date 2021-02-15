import { EntityRepository, Repository } from "typeorm";

import { MedicalAct } from "./medical-act.entity";

@EntityRepository(MedicalAct)
export class MedicalActRepository extends Repository<MedicalAct>{}