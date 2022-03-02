import { EntityRepository, Repository } from "typeorm";
import { LabeledStatus } from "./labeled-status.entity";

@EntityRepository(LabeledStatus)
export class LabeledStatusRepository extends Repository<LabeledStatus>{}