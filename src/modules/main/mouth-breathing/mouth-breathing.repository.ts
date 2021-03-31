import { EntityRepository, Repository } from "typeorm";
import { MouthBreathing } from "./mouth-breathing.entity";

@EntityRepository(MouthBreathing)
export class MouthBreathingRepository extends Repository<MouthBreathing>{}