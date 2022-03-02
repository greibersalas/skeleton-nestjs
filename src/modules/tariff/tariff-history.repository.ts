import { EntityRepository, Repository } from "typeorm";
import { TariffHistory } from "./tariff-history.entity";

@EntityRepository(TariffHistory)
export class TariffHistoryRepository extends Repository<TariffHistory>{}