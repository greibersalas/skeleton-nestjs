import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { EnvironmentDoctor } from '../environment-doctor/environment-doctor.entity';
import { DiaryLockRepository } from '../main/diary-lock/diary-lock.repository';
import { FormFilter, PatientList} from './form.filter';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';


@Injectable()
export class ReservationService {

    constructor(
        @InjectRepository(ReservationRepository)
        private readonly _reservationRepository: ReservationRepository,
        @InjectRepository(DiaryLockRepository)
        private readonly _diaryLockRepository: DiaryLockRepository
    ){}

    async get(id: number): Promise<Reservation>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const Reservation = await this._reservationRepository.findOne(id,{where:{state: Not(0)}});
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

        attr.state = MoreThan(0);
        const Reservation = await this._reservationRepository.find({where:attr});
        return Reservation
    }

    async getByDate(date:Date):Promise<Reservation[]>{
        const Reservation = await this._reservationRepository.find({where:{date:date}});
        return Reservation
    }

    async getByDoctorEnivronment(date:string,doctor:Doctor,environment:EnvironmentDoctor):Promise<Reservation[]>{
        const Reservation = await this._reservationRepository.find({where:{date:date,doctor:doctor,environment:environment}});
        return Reservation
    }

    async getByEnivronment(date:string,environment:EnvironmentDoctor):Promise<Reservation[]>{
        const Reservation = await this._reservationRepository.find({where:{date:date,environment:environment}});
        return Reservation
    }


    async getAll(): Promise<Reservation[]>{
        const reservations: Reservation[] = await this._reservationRepository
        .find({where:{state:MoreThan(0)}});
       return reservations;
    }

    async create(bl: Reservation): Promise<Reservation>{
        const saveReservation: Reservation = await this._reservationRepository.save(bl);
        return saveReservation;
    }

    async update(id: number, Reservation:Reservation): Promise<Reservation>{
        const ReservationExists = await this._reservationRepository.findOne(id);
        if(!ReservationExists){
            throw new NotFoundException();
        }
        await this._reservationRepository.update(id,Reservation);
        const updateReservation : Reservation = await this._reservationRepository.findOne(id);
        return updateReservation;
    }

    async delete(id: number): Promise<void>{
        const ReservationExists = await this._reservationRepository.findOne(id);
        if(!ReservationExists){
            throw new NotFoundException();
        }

        await this._reservationRepository.update(id,{state:0});
    }

    async getByDateDoctor(filters: any): Promise<any[]>{
        const resers = await this._reservationRepository
        .createQueryBuilder("rs")
        .innerJoinAndSelect("rs.doctor","doctor")
        .innerJoinAndSelect("rs.environment","environment")
        .innerJoinAndSelect("rs.patient","ch")
        .innerJoinAndSelect("rs.tariff","tariff")
        .where("rs.date BETWEEN :since AND :until AND doctor.id = :iddoctor",{
            since:filters.since,
            until: filters.until,
            iddoctor: filters.doctor
        }).orderBy({"rs.appointment":"DESC"})
        .getMany();
        return resers;
    }

    async getByClinicHistory(id: number): Promise<any[]>{
        const data: any = await this._reservationRepository
        .createQueryBuilder("re")
        .innerJoinAndSelect("re.doctor","doc")
        .innerJoinAndSelect("re.environment","ev")
        .leftJoinAndSelect("re.tariff","tf")
        .innerJoinAndSelect("re.patient","ch","ch.id = :ch",{ch: id})
        .where("re.state <> 0").orderBy({"re.date":"DESC"})
        .getMany();
        return data;
    }

    async confirm(id: number): Promise<any>{
        const confirm = await this._reservationRepository.createQueryBuilder()
        .update(Reservation)
        .set({state:2}).where({id}).execute();
        return confirm;
    }

    async getByDay(date: string, campus: number):Promise<Reservation[]>{
        const reservation = await this._reservationRepository
            .createQueryBuilder('rs')
            .select('rs.*, pt.*, dc.nameQuote as doctor, rs.id AS idreservation')
            .innerJoin('rs.environment','ed')
            .innerJoin('rs.doctor','dc')
            .innerJoin('rs.patient','pt')
            .where(`
                rs.state <> 0 AND
                "rs"."date"::DATE = '${date}'
                AND ed.campus = ${campus} AND ed.state <> 0
            `).getRawMany();
        return reservation;
    }

    async validateReservation(iddoctor: number,date: string, appointment: string, idcampus: number): Promise<number>{
        let hours = appointment.split('-');
        //Busco si el doctor tiene la hora bloqueda
        const lock = await this._diaryLockRepository.createQueryBuilder('dl')
        .where(`dl.date = :date AND
        ((:since >= time_since and :since < time_until)
        OR (:until >= time_since AND :until < time_until ))
        AND dl.campus = :campus AND dl.state = 1 AND dl.doctor = :doctor`,
        {date,since: hours[0],until: hours[1],campus: idcampus, doctor: iddoctor})
        //.getQuery();
        .getMany();
        if(lock.length > 0){
            return 2;
        }
        const reservation = await this._reservationRepository
        .findOne({where:{state: MoreThan(0),doctor: iddoctor,date,appointment}});
        if(reservation)
            return 1;
        return 0;
    }

    async cancel(id: number): Promise<boolean>{
        const confirm = await this._reservationRepository.createQueryBuilder()
        .update(Reservation)
        .set({state:0}).where({id}).execute();
        if(!confirm){
            return false;
        }
        return true;
    }

    async getListFilter(patient: number, doctor: number, state: number): Promise<Reservation[]>{
        let attr: any = {};
        if (patient !== 0)
            attr.patient = patient;
        if (doctor > 0)
            attr.doctor = doctor;
        if(state)
            attr.state = state;

        const list = await this._reservationRepository.find(
            {
                where: attr,
                order: {date: 'DESC'}
            }
        );
        return list
    }
}
