import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClinicHistory } from '../clinic-history/clinic-history.entity'

@Entity('attentioncard')
export class AttentionCard extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @ManyToOne(type => ClinicHistory, clinichistory =>clinichistory.id,{cascade:true, nullable:false, eager:false})
    @JoinColumn({name:'clinichistory'})
    clinichistory: ClinicHistory;

    @Column({type: 'date', nullable: false})
    dateadmission: Date;

    @Column({type: 'varchar', nullable: false})
    motivo: string;

    @Column({type: 'boolean', default:false})
    ma: boolean;

    @Column({type: 'boolean', default:false})
    mmp: boolean;

    @Column({type: 'boolean', default:false})
    mp: boolean;

    @Column({type: 'boolean', default:false})
    ar: boolean;

    @Column({type: 'boolean', default:false})
    dcb: boolean;

    @Column({type: 'boolean', default:false})
    dtm: boolean;

    @Column({type: 'boolean', default:false})
    mm: boolean;

    @Column({type: 'boolean', default:false})
    af: boolean;

    @Column({type: 'boolean', default:false})
    asc: boolean;


    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}