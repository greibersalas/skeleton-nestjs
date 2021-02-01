import { EntityRepository, Repository } from "typeorm";
import { DentalStatus } from "./dental-status.entity";

@EntityRepository(DentalStatus)
export class DentalStatusRepository extends Repository<DentalStatus>{}