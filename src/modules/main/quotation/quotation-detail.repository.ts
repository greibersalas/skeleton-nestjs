import { EntityRepository, Repository } from "typeorm";
import { QuotationDetail } from "./quotation-detail.entity";

@EntityRepository(QuotationDetail)
export class QuotationDetailRepository extends Repository<QuotationDetail>{}