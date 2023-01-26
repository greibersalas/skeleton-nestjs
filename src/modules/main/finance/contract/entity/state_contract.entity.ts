import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity('state_contract')
export class State_contract extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @Column({ type: 'int4', nullable: false })
    value: string;

    @Column({ type: 'int4', nullable: false })
    state: string;

}