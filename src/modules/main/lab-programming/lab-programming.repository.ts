
import { EntityRepository, Repository } from "typeorm";

import { LabProgramming } from "./lab-programming.entity";

@EntityRepository(LabProgramming)
export class LabProgrammingRepository extends Repository<LabProgramming>{}