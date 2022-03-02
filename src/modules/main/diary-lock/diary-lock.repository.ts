import { EntityRepository, Repository } from "typeorm";

import { DiaryLock } from "./diary-lock.entity";

@EntityRepository(DiaryLock)
export class DiaryLockRepository extends Repository<DiaryLock>{}