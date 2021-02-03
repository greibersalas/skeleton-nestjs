import { EntityRepository, Repository } from "typeorm";
import { Odontograma } from "./odontograma.entity";

@EntityRepository(Odontograma)
export class OdontogramaRepository extends Repository<Odontograma>{}