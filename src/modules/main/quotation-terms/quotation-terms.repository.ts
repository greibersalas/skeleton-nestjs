import { EntityRepository, Repository } from "typeorm";
import { QuotationTerms } from "./quotation-terms.entity";

@EntityRepository(QuotationTerms)
export class QuotationTermsRepository extends Repository<QuotationTerms>{}