import { EntityRepository, Repository } from "typeorm";
import { BusinessLine } from "./business-line.entity";

@EntityRepository(BusinessLine)
export class BusinessLineRepository extends Repository<BusinessLine>{}