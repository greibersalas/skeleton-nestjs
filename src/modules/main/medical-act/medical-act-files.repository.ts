import { EntityRepository, Repository } from "typeorm";

import { MedicalActFiles } from "./medical-act-files.entity";

@EntityRepository(MedicalActFiles)
export class MedicalActFilesRepository extends Repository<MedicalActFiles>{}