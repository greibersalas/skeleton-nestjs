import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('insurance_carrier')
export class InsuranceCarrier extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 40, nullable:false})
    name: string;

    @Column({type: 'varchar', nullable: false})
    address: string;

    @Column({type: 'int8', nullable: false})
    ruc: number;

    @Column({type: 'varchar', nullable: true, length: 60})
    contacName: string;
    
    @Column({type: 'varchar', nullable: true, length: 20})
    phone: string;

    @Column({type: 'varchar', nullable: true, length: 60})
    position: string; //Cargo

    @Column({type: 'varchar', nullable: true, length: 80})
    email: string;

    @Column({type: 'int2', default: 1, nullable:false})
    state: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;
}