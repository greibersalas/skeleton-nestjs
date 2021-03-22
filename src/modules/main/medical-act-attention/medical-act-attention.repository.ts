import { EntityRepository, Repository } from "typeorm";

import { MedicalActAttention } from "./medical-act-attention.entity";

@EntityRepository(MedicalActAttention)
export class MedicalActAttentionRepository extends Repository<MedicalActAttention>{}