import { EntityRepository, Repository } from "typeorm";
import { Specialty } from "./specialty.entity";

@EntityRepository(Specialty)
export class SpecialtyRepository extends Repository<Specialty>{}