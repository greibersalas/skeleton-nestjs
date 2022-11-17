import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContractDetail } from "./contract-detail.entity";
import { ContractQuotaPayment } from "./contract-quota-payment.entity";

@Entity('contract_quota_payment_detail')
export class ContractQuotaPaymentDetail extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => ContractQuotaPayment, qp => qp.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcontractquotapayment' })
    contractquotapayment: ContractQuotaPayment | number;

    @ManyToOne(type => ContractDetail, cd => cd.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcontractdetail' })
    contractdetail: ContractDetail | number;

    @Column({ type: 'float', nullable: false })
    amount: number;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;
};