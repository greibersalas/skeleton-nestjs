import { EntityRepository, Repository } from "typeorm";
import { Responsible } from "./responsible.entity";

@EntityRepository(Responsible)
export class ResponsibleRepository extends Repository<Responsible>{}