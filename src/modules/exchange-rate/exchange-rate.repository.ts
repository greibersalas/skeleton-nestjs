import { EntityRepository, Repository } from "typeorm";
import { ExchangeRate } from "./exchange-rate.entity";

@EntityRepository(ExchangeRate)
export class ExchangeRateRepository extends Repository<ExchangeRate>{}