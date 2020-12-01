import { EntityRepository, Repository } from "typeorm";
import { InsuranceCarrier } from "./insurance-carrier.entity";

@EntityRepository(InsuranceCarrier)
export class InsuranceCarrierRepository extends Repository<InsuranceCarrier>{}