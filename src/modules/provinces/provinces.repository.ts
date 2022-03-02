import { EntityRepository, Repository } from "typeorm";
import { Provinces } from "./provinces.entity";

@EntityRepository(Provinces)
export class ProvincesRepository extends Repository<Provinces>{}