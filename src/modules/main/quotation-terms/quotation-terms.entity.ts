import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Quotation } from "../quotation/quotation.entity";
import { User } from "../../user/user.entity";

@Entity('quotation_terms')
export class QuotationTerms extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Quotation, quotation => quotation.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'idquotation'})
    quotation: Quotation;

    @Column({type: 'varchar', nullable: false, length: 15})
    type: string;

    @Column({type: 'varchar', nullable: false, length: 250})
    description: string;

    @Column({type: 'float8', default: 0, nullable:false})
    amount: number;

    @ManyToOne(type => User, user => user.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'user'})
    user: User;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}