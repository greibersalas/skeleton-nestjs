import { EntityRepository, Repository } from "typeorm";

import { ClinicHistoryNotes } from "./clinic-history-notes.entity";

@EntityRepository(ClinicHistoryNotes)
export class ClinicHistoryNotesRepository extends Repository<ClinicHistoryNotes>{}