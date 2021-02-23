import { EntityRepository, Repository } from "typeorm";

import { MedicalActFileGroup } from "./medical-act-file-group.entity";

@EntityRepository(MedicalActFileGroup)
export class MedicalActFileGroupRepository extends Repository<MedicalActFileGroup>{}