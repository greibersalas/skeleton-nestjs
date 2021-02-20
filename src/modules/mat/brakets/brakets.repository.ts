import { EntityRepository, Repository } from "typeorm";
import { Brakets } from "./brakets.entity";

@EntityRepository(Brakets)
export class BraketsRepository extends Repository<Brakets>{}