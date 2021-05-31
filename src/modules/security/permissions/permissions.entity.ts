import { User } from "../../user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {MasterPermissions} from "../master-permissions/master-permissions.entity"


@Entity('permissions')
export class Permissions extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'boolean', default: false})
    view: boolean;

    @Column({type: 'boolean', default: false})
    delete: boolean;

    @Column({type: 'boolean', default: false})
    update: boolean;

    @Column({type: 'boolean', default: false})
    insert: boolean;

    @ManyToOne(type=>User,{cascade:true,nullable:false,eager:true})
    @JoinColumn({name:'user_id'})
    user: User;

    @Column({type:'int2', nullable:false, default:1})
    estado: number;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt: Date;

    @ManyToOne(type=>MasterPermissions,{cascade:true,nullable:false,eager:true})
    @JoinColumn({name:'mpermissions_id'})
    mpermissions: MasterPermissions;


}