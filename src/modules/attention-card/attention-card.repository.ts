import { EntityRepository, Repository } from "typeorm";
import { AttentionCard } from "./attention-card.entity";

@EntityRepository(AttentionCard)
export class AttentionCardRepository extends Repository<AttentionCard>{}