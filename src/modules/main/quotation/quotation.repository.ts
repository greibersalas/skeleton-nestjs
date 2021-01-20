import { EntityRepository, Repository } from "typeorm";
import { Quotation } from "./quotation.entity";

@EntityRepository(Quotation)
export class QuotationRepository extends Repository<Quotation>{}