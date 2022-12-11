import { User } from "src/modules/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contract } from "../../contract/entity/contract.entity";

@Entity('contract_notes')
export class ContractNotes extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    note: string;

    @ManyToOne(type => Contract, co => co.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'idcontract' })
    contract: Contract | number;

    @Column({ type: 'int2', default: 1, nullable: false })
    state: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => User, us => us.id, { cascade: true, nullable: false, eager: false })
    @JoinColumn({ name: 'iduser' })
    user: User | number;
}