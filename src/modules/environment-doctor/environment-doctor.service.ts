import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import _ = require("lodash");
//import moment from 'moment-timezone';
var moment = require('moment-timezone');

import { ReservationRepository } from '../reservation/reservation.repository';
import { EnvironmentDoctorRepository } from './environment-doctor.repository';
import { EnvironmentDoctor } from './environment-doctor.entity';

@Injectable()
export class EnvironmentDoctorService {

    constructor(
        @InjectRepository(EnvironmentDoctorRepository)
        private readonly _environmentDoctorRepository: EnvironmentDoctorRepository,
        @InjectRepository(ReservationRepository)
        private readonly _reservationRepository: ReservationRepository
    ){}

    async get(id: number): Promise<EnvironmentDoctor>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const environmentDoctor = await this._environmentDoctorRepository.findOne(id,{where:{state:1}});
        if(!environmentDoctor){
            throw new NotFoundException();
        }

        return environmentDoctor;
    }

    async getAll(): Promise<EnvironmentDoctor[]>{
        const ed: EnvironmentDoctor[] = await this._environmentDoctorRepository
        .find({where:{state:1},order:{id:'ASC'}});
        return ed;
    }

    async create(ed: EnvironmentDoctor): Promise<EnvironmentDoctor>{
        const saveEd: EnvironmentDoctor = await this._environmentDoctorRepository.save(ed);
        return saveEd;
    }

    async update(id: number, ed: EnvironmentDoctor): Promise<EnvironmentDoctor>{
        const edExists = await this._environmentDoctorRepository.findOne(id);
        if(!edExists){
            throw new NotFoundException();
        }
        await this._environmentDoctorRepository.update(id,ed);
        const updateEd : EnvironmentDoctor = await this._environmentDoctorRepository.findOne(id);
        return updateEd;
    }

    async delete(id: number): Promise<void>{
        const edExists = await this._environmentDoctorRepository.findOne(id);
        if(!edExists){
            throw new NotFoundException();
        }
        await this._environmentDoctorRepository.update(id,{state:0});
    }

    async programmingDay(day: string): Promise<any>{
        let prog: any[] = [];
        //Busco la lista de consultorios
        const ed = await this._environmentDoctorRepository.find({where:{state: 1},order:{id:'ASC'}});
        ed.forEach(async (i: EnvironmentDoctor) => {
            //Busco las reservas del día
            /* const reservation = await this._reservationRepository
            .createQueryBuilder('rs')
            .innerJoinAndSelect('rs.doctor','dc')
            .innerJoinAndSelect('rs.patient','pt')
            .where(`
                rs.state <> 0 AND
                rs.environment_id = ${i.id} AND
                "rs"."date"::DATE = '${day}'
            `).getMany();
            console.log(reservation); */
            let hours: any[]= [];
            let since = moment(`${day} 08:00:00`).tz('America/Lima');
            let until = moment(`${day} 19:00:00`).tz('America/Lima');
            //Morning
            let schedule_morning_since = i.schedule_morning_since < 10 ? `0${i.schedule_morning_since}` : i.schedule_morning_since;
            let schedule_morning_until = i.schedule_morning_until < 10 ? `0${i.schedule_morning_until}` : i.schedule_morning_until;
            //Lunch
            let lunch_since = i.lunch_since < 10 ? `0${i.lunch_since}` : i.lunch_since;
            let lunch_until = i.lunch_until < 10 ? `0${i.lunch_until}` : i.lunch_until;
            //afternoon
            let schedule_afternoon_since = i.schedule_afternoon_since < 10 ? `0${i.schedule_afternoon_since}` : i.schedule_afternoon_since;
            let schedule_afternoon_until = i.schedule_afternoon_until < 10 ? `0${i.schedule_afternoon_until}` : i.schedule_afternoon_until;

            let timetable = {
                schedule_morning_since: moment(`${day} ${schedule_morning_since}:00:00`).tz('America/Lima'),
                schedule_morning_until: moment(`${day} ${schedule_morning_until}:00:00`).tz('America/Lima'),
                lunch_since: moment(`${day} ${lunch_since}:00:00`).tz('America/Lima'),
                lunch_until: moment(`${day} ${lunch_until}:00:00`).tz('America/Lima'),
                schedule_afternoon_since: moment(`${day} ${schedule_afternoon_since}:00:00`).tz('America/Lima'),
                schedule_afternoon_until: moment(`${day} ${schedule_afternoon_until}:00:00`).tz('America/Lima')
            }
            while(since <= until){
                //Calculamos el horario de la mañana
                if(i.schedule_morning_since > 0 && timetable.schedule_morning_since <= since && since < timetable.schedule_morning_until){
                    //Busco si hay reserva en la hora
                    /* const schedule = `${moment(since).tz('America/Lima').format('HH:mm:ss')}-${moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm:ss')}`;
                    const reservation = await this._reservationRepository
                    .createQueryBuilder('rs')
                    .innerJoinAndSelect('rs.doctor','dc')
                    .innerJoinAndSelect('rs.patient','pt')
                    .where(`
                        rs.state <> 0 AND
                        rs.environment_id = ${i.id} AND
                        "rs"."date"::DATE = '${day}' AND
                        rs.appointment = '${schedule}'
                    `).getMany();
                    console.log(reservation); */
                    /* const schedule = `${moment(since).tz('America/Lima').format('HH:mm:ss')}-${moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm:ss')}`;
                    const reserv = _.find(reservation, function(o:any){ return o.appointment === schedule});
                    if(reserv){
                        hours.push({
                            since: moment(since).tz('America/Lima').format('HH:mm'),
                            until: moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm'),
                            rowspan: (i.interval/10)*20,
                            type: 4, //reservado,
                            data: reserv
                        });
                    }else{ */
                        hours.push({
                            since: moment(since).tz('America/Lima').format('HH:mm'),
                            until: moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm'),
                            rowspan: (i.interval/10)*20,
                            type: 1 //disponible
                        });
                    //}
                    since = moment(since).add(i.interval,'minutes');
                    //Calculamos el tiempo de limpieza
                    if(i.time_cleaning > 0){
                        hours.push({
                            since: moment(since).tz('America/Lima').format('HH:mm'),
                            until: moment(since).tz('America/Lima').add(i.time_cleaning,'minutes').format('HH:mm'),
                            rowspan: (i.time_cleaning/10)*20,
                            type: 2 //limpieza
                        });
                        since = moment(since).add(i.time_cleaning,'minutes');
                    }
                }else if(i.lunch_since > 0 && timetable.lunch_since <= since && since < timetable.lunch_until){
                    //Calculamos el horario del refrigerio
                    hours.push({
                        since: moment(since).tz('America/Lima').format('HH:mm'),
                        until: moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm'),
                        rowspan: (i.interval/10)*20,
                        type: 3 //refrigerio
                    });
                    since = moment(since).add(i.interval,'minutes');
                }else if(i.schedule_afternoon_since > 0 && timetable.schedule_afternoon_since <= since && since < timetable.schedule_afternoon_until){
                    //Calculamos el horario de la tarde
                    //Busco si hay reserva en la hora
                    /* const schedule = `${moment(since).tz('America/Lima').format('HH:mm:ss')}-${moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm:ss')}`;
                    const reservation = await this._reservationRepository
                    .createQueryBuilder('rs')
                    .innerJoinAndSelect('rs.doctor','dc')
                    .innerJoinAndSelect('rs.patient','pt')
                    .where(`
                        rs.state <> 0 AND
                        rs.environment_id = ${i.id} AND
                        "rs"."date"::DATE = '${day}' AND
                        rs.appointment = '${schedule}'
                    `).getMany();
                    if(reservation.length > 0){
                        hours.push({
                            since: moment(since).tz('America/Lima').format('HH:mm'),
                            until: moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm'),
                            rowspan: (i.interval/10)*20,
                            type: 4, //reservado,
                            data: reservation[0]
                        });
                    }else{ */
                        hours.push({
                            since: moment(since).tz('America/Lima').format('HH:mm'),
                            until: moment(since).tz('America/Lima').add(i.interval,'minutes').format('HH:mm'),
                            rowspan: (i.interval/10)*20,
                            type: 1 //disponible
                        });
                    //}
                    since = moment(since).add(i.interval,'minutes');
                    //Calculamos el tiempo de limpieza
                    if(i.time_cleaning > 0){
                        hours.push({
                            since: moment(since).tz('America/Lima').format('HH:mm'),
                            until: moment(since).tz('America/Lima').add(i.time_cleaning,'minutes').format('HH:mm'),
                            rowspan: (i.time_cleaning/10)*20,
                            type: 2 //limpieza
                        });
                        since = moment(since).add(i.time_cleaning,'minutes');
                    }
                }else{
                    hours.push({
                        since: moment(since).tz('America/Lima').format('HH:mm'),
                        until: moment(since).tz('America/Lima').add(10,'minutes').format('HH:mm'),
                        rowspan: 20,
                        type: 0 //No disponible
                    });
                    since = moment(since).add(10,'minutes');
                }
            }
            prog.push({
                dentalOffice: i.name,
                interval: i.interval,
                time_cleaning: i.time_cleaning,
                hours
            });
        });
        return prog;
    }

}
