import { EntityRepository, Repository } from "typeorm";
import { PaymentMethod } from "./payment-method.entity";

@EntityRepository(PaymentMethod)
export class PaymentMethodRepository extends Repository<PaymentMethod>{}