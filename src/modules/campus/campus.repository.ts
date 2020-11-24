import { EntityRepository, Repository } from "typeorm";
import { Campus } from "./campus.entity";

@EntityRepository(Campus)
export class CampusRepository extends Repository<Campus>{}