import { EntityRepository, Repository } from "typeorm";
import { ExchangeRate } from "./entity/exchange-rate.entity";

@EntityRepository(ExchangeRate)
export class ExchangeRateRepository extends Repository<ExchangeRate>{ }