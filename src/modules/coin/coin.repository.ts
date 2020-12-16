import { EntityRepository, Repository } from "typeorm";
import { Coin } from "./coin.entity";

@EntityRepository(Coin)
export class CoinRepository extends Repository<Coin>{}