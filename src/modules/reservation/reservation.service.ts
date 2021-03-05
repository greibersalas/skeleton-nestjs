import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { EnvironmentDoctor } from '../environment-doctor/environment-doctor.entity';
import { FormFilter } from './form.filter';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {

    constructor(
        @InjectRepository(ReservationRepository)
        private readonly _ReservationRepository: ReservationRepository
    ){}

    async get(id: number): Promise<Reservation>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const Reservation = await this._ReservationRepository.findOne(id,{where:{state:1}});
        /* const Reservation = await this._ReservationRepository
            .createQueryBuilder("rs")
            .innerJoinAndSelect("rs.doctor","doctor")
            .innerJoinAndSelect("rs.environment","environment")
            .innerJoinAndSelect("rs.qdetail","qd")
            .innerJoinAndSelect("qd.quotation","qt")
            .innerJoinAndSelect("qt.clinicHistory","ch")
            .innerJoinAndSelect("qd.tariff","tariff")
            .where("rs.id = :id AND rs.state=1",{id})
            .getOne() */

        if(!Reservation){
            throw new NotFoundException();
        }

        return Reservation;
    }

    async filterReservation(formfilter:FormFilter):Promise<Reservation[]>{
        let attr:any = {}

        if (formfilter.environment.id!=0)
            attr.environment=formfilter.environment
        if (formfilter.doctor.id!=0)
            attr.doctor=formfilter.doctor
        attr.state = 1    
        const Reservation = await this._ReservationRepository.find({where:attr});
       /*  const Reservation = await this._ReservationRepository
            .createQueryBuilder("rs")
            .innerJoinAndSelect("rs.doctor","doctor")
            .innerJoinAndSelect("rs.environment","environment")
            .innerJoinAndSelect("rs.qdetail","qd")
            .innerJoinAndSelect("qd.quotation","qt")
            .innerJoinAndSelect("qt.clinicHistory","ch")
            .innerJoinAndSelect("qd.tariff","tariff")
            .innerJoinAndSelect("tariff.specialty","specialty")
            .innerJoinAndSelect("specialty.businessLines","businessLines")
            .where(attr)
            .getMany(); */

        return Reservation
    }

    async getByDate(date:Date):Promise<Reservation[]>{
        const Reservation = await this._ReservationRepository.find({where:{date:date}});
        return Reservation
    }

    async getByDoctorEnivronment(date:string,doctor:Doctor,environment:EnvironmentDoctor):Promise<Reservation[]>{
        const Reservation = await this._ReservationRepository.find({where:{date:date,doctor:doctor,environment:environment}});
        return Reservation
    }

    async getByEnivronment(date:string,environment:EnvironmentDoctor):Promise<Reservation[]>{
        const Reservation = await this._ReservationRepository.find({where:{date:date,environment:environment}});
        return Reservation
    }

       
    async getAll(): Promise<Reservation[]>{
        const reservations: Reservation[] = await this._ReservationRepository.find({where:{state:MoreThan(0)}});
       /*  const reservations: Reservation[] = await this._ReservationRepository
        .createQueryBuilder("rs")
        .innerJoinAndSelect("rs.doctor","doctor")
        .innerJoinAndSelect("rs.environment","environment")
        .innerJoinAndSelect("rs.qdetail","qd")
        .innerJoinAndSelect("qd.quotation","qt")
        .innerJoinAndSelect("qt.clinicHistory","ch")
        .innerJoinAndSelect("qd.tariff","tariff")
        .where("rs.state=1")
        .getMany() */
        return reservations;
    }

    async create(bl: Reservation): Promise<Reservation>{
        const saveReservation: Reservation = await this._ReservationRepository.save(bl);
        return saveReservation;
    }

    async update(id: number, Reservation:Reservation): Promise<Reservation>{
        const ReservationExists = await this._ReservationRepository.findOne(id);
        if(!ReservationExists){
            throw new NotFoundException();
        }
        await this._ReservationRepository.update(id,Reservation);
        const updateReservation : Reservation = await this._ReservationRepository.findOne(id);
        return updateReservation;
    }

    async delete(id: number): Promise<void>{
        const ReservationExists = await this._ReservationRepository.findOne(id);
        if(!ReservationExists){
            throw new NotFoundException();
        }

        await this._ReservationRepository.update(id,{state:0});
    }

    async getByDateDoctor(date: Date, doctor: number, state: number): Promise<any[]>{
        const resers: any = await this._ReservationRepository
        .createQueryBuilder("rs")
        .innerJoinAndSelect("rs.doctor","doctor")
        .innerJoinAndSelect("rs.environment","environment")
        .innerJoinAndSelect("rs.qdetail","qd")
        .innerJoinAndSelect("qd.quotation","qt")
        .innerJoinAndSelect("qt.clinicHistory","ch")
        .innerJoinAndSelect("qd.tariff","tariff")
        .where({date,doctor})
        .getMany();
        return resers;
    }

    async getByClinicHistory(id: number): Promise<any[]>{
        const data: any = await this._ReservationRepository
        .createQueryBuilder("re")
        .innerJoinAndSelect("re.doctor","doc")
        .innerJoinAndSelect("re.environment","ev")
        .innerJoinAndSelect("re.qdetail","qd","qd.state <> 0")
        .innerJoinAndSelect("qd.tariff","tf")
        .innerJoinAndSelect("qd.quotation","qt")
        .innerJoinAndSelect("qt.clinicHistory","ch","ch.id = :ch",{ch: id})
        .where("re.state <> 0").orderBy({"re.date":"DESC"})
        .getMany();
        return data;
    }
}
