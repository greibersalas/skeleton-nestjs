import { EntityRepository, Repository } from "typeorm";
import { Deparments } from "./deparments.entity";

@EntityRepository(Deparments)
export class DeparmentsRepository extends Repository<Deparments>{}