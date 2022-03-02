import { EntityRepository, Repository } from "typeorm";
import { Districts } from "./districts.entity";

@EntityRepository(Districts)
export class DistrictsRepository extends Repository<Districts>{}