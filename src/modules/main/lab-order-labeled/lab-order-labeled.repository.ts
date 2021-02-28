import { EntityRepository, Repository } from "typeorm";

import { LabOrderLabeled } from "./lab-order-labeled.entity";

@EntityRepository(LabOrderLabeled)
export class LabOrderLabeledRepository extends Repository<LabOrderLabeled>{}