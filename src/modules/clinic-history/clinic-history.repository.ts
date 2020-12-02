import { EntityRepository, Repository } from "typeorm";
import { ClinicHistory } from "./clinic-history.entity";

@EntityRepository(ClinicHistory)
export class ClinicHistoryRepository extends Repository<ClinicHistory>{}