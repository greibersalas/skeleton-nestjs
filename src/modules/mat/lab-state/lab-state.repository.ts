import { EntityRepository, Repository } from "typeorm";
import { LabState } from "./lab-state.entity";

@EntityRepository(LabState)
export class LabStateRepository extends Repository<LabState>{}