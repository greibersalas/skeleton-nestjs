import { EntityRepository, Repository } from "typeorm";

import { LabOrder } from "./lab-order.entity";

@EntityRepository(LabOrder)
export class LabOrderRepository extends Repository<LabOrder>{}