import { EntityRepository, Repository } from "typeorm";
import { Brackets } from "./brackets.entity";

@EntityRepository(Brackets)
export class BracketsRepository extends Repository<Brackets>{}