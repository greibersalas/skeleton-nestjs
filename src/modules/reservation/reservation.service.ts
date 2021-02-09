import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { EnvironmentDoctor } from '../environment-doctor/environment-doctor.entity';
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

        if(!Reservation){
            throw new NotFoundException();
        }

        return Reservation;
    }

    async getByDate(date:Date):Promise<Reservation[]>{
        const Reservation = await this._ReservationRepository.find({where:{date:date}});
        return Reservation
    }

    async getByDoctorEnivronment(date:string,doctor:Doctor,environment:EnvironmentDoctor):Promise<Reservation[]>{
        const Reservation = await this._ReservationRepository.find({where:{date:date.split('T')[0],doctor:doctor,environment:environment}});
        return Reservation
    }

    async getByEnivronment(date:string,environment:EnvironmentDoctor):Promise<Reservation[]>{
        const Reservation = await this._ReservationRepository.find({where:{date:date.split('T')[0],environment:environment}});
        return Reservation
    }

       
    async getAll(): Promise<Reservation[]>{
        const Reservation: Reservation[] = await this._ReservationRepository.find({where:{state:1}});
        return Reservation;
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
}
