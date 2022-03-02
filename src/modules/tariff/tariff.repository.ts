import { EntityRepository, Repository } from "typeorm";
import { Tariff } from "./tariff.entity";

@EntityRepository(Tariff)
export class TariffRepository extends Repository<Tariff>{}