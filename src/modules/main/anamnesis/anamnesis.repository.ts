import { EntityRepository, Repository } from "typeorm";

import { Anamnesis } from "./anamnesis.entity";

@EntityRepository(Anamnesis)
export class AnamnesisRepository extends Repository<Anamnesis>{}