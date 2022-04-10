import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require("lodash");
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

    async getByCampus(idcampus: number): Promise<EnvironmentDoctor[]>{
        if(!idcampus){
            throw new BadRequestException('id must be send.');
        }
        const environmentDoctor = await this._environmentDoctorRepository
        .find(
            {
                where:
                {
                    campus: idcampus,
                    state: 1
                },
                order:
                {
                    id:'ASC'
                }
            }
        );
        if(!environmentDoctor){
            throw new NotFoundException();
        }
        return environmentDoctor;
    }

    async create(ed: EnvironmentDoctor): Promise<EnvironmentDoctor>{
        if( ed.lunch_since === ''){
            ed.lunch_since = null;
            ed.lunch_until = null;
        }
        if( ed.schedule_afternoon_since === ''){
            ed.schedule_afternoon_since = null;
            ed.schedule_afternoon_until = null;
        }
        return await this._environmentDoctorRepository.save(ed);
    }

    async update(id: number, ed: EnvironmentDoctor): Promise<EnvironmentDoctor>{
        const edExists = await this._environmentDoctorRepository.findOne(id);
        if(!edExists){
            throw new NotFoundException();
        }
        if( ed.lunch_since === ''){
            ed.lunch_since = null;
            ed.lunch_until = null;
        }
        if( ed.schedule_afternoon_since === ''){
            ed.schedule_afternoon_since = null;
            ed.schedule_afternoon_until = null;
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

    async programmingDay(
        day: string,
        reser: any,
        campus: number,
        doctor: number,
        patient: number,
        state: number,
        rol: boolean
    ): Promise<any>{
        //console.log("Reser ",reser);
        let prog: any[] = [];
        //Busco la lista de consultorios
        const ed = await this._environmentDoctorRepository.find({where:{state: 1, campus},order:{id:'ASC'}});
        ed.forEach(async (i: EnvironmentDoctor) => {
            let hours: any[]= [];
            let since = moment(`${day} 08:00:00`);
            let until = moment(`${day} 21:00:00`);
            //Lunch
            //Si no tiene hora re refrigerio asignamos una para el calulo del refrigerio
            i.lunch_since = !i.lunch_since ? i.schedule_morning_until : i.lunch_since;
            //i.lunch_until = !i.lunch_since ? i.schedule_morning_until : i.lunch_until;
            let timetable = {
                schedule_morning_since: moment(`${day} ${i.schedule_morning_since ? i.schedule_morning_since : '00:00:00'}`),//.tz('America/Lima')
                schedule_morning_until: moment(`${day} ${i.schedule_morning_until ? i.schedule_morning_until : '00:00:00'}`),
                lunch_since: moment(`${day} ${i.lunch_since}`),
                lunch_until: moment(`${day} ${i.lunch_until ? i.lunch_until : '00:00:00'}`),
                schedule_afternoon_since: moment(`${day} ${i.schedule_afternoon_since ? i.schedule_afternoon_since : '00:00:00'}`),
                schedule_afternoon_until: moment(`${day} ${i.schedule_afternoon_until ? i.schedule_afternoon_until : '00:00:00'}`)
            }
            while(since <= until){
                //Calculamos el horario de la mañana
                if(i.schedule_morning_since && timetable.schedule_morning_since <= since && since < timetable.schedule_morning_until){
                    //Busco si hay reserva en la hora
                    const intervalo = i.time_cleaning === 0 ? (i.interval - 10) : i.interval; // Nuevo - 2022-04-02
                    const schedule = `${moment(since).format('HH:mm:ss')}-${moment(since).add(i.interval,'minutes').format('HH:mm:ss')}`;
                    const schedule2 = `${moment(since).format('HH:mm:ss')}-${moment(since).add(intervalo,'minutes').format('HH:mm:ss')}`; // Nuevo - 2022-04-02
                    //crear objeto para filtrar
                    let filter = {
                        environment_id: i.id,
                        appointment: schedule,
                    };
                    if (doctor != 0)
                        //filter["doctor_id"] = doctor;
                    if (patient != 0)
                        filter["patient_id"] = patient;
                    if (state != 0)
                        filter["state"] = state;
                    const reserv = _.find(reser,filter);
                    // Nuevo cambio 2022-04-02
                    let filter2 = filter;
                    filter2.appointment = schedule2;
                    const reserv2 = _.find(reser,filter2);
                    // Fin nuevo cambio
                    let interval = 0;
                    if(reserv || reserv2){
                        //Si el rol es doctor o especialista OFM
                        //Mostramos solo sus reservas y las demas las bloqueamos
                        if(rol){
                            if(reserv.doctor_id === doctor){
                                hours.push({
                                    since: moment(since).format('HH:mm'),
                                    until: moment(since).add(i.interval,'minutes').format('HH:mm'),
                                    rowspan: (i.interval/10)*20,
                                    type: 4, //reservado,
                                    data: reserv
                                });
                            }else{
                                hours.push({
                                    since: moment(since).format('HH:mm'),
                                    until: moment(since).add(i.interval,'minutes').format('HH:mm'),
                                    rowspan: (i.interval/10)*20,
                                    type: 0, //no disponible en el perfil
                                    data: reserv
                                });
                            }
                        }else{
                            //Si el otro perfil mostramos todo
                            hours.push({
                                since: moment(since).format('HH:mm'),
                                until: moment(since).add(i.interval,'minutes').format('HH:mm'),
                                rowspan: (i.interval/10)*20,
                                type: 4, //reservado,
                                data: reserv ? reserv : reserv2 // Nuevo cambio 2022-04-02
                            });
                        }
                    }else{
                        let nextTime = moment(since).add(i.interval,'minutes');
                        //Verifico si el siguiente horario supera la hora de refrigerio
                        if(nextTime <= timetable.lunch_since){
                            //if(moment(since) < moment())
                            hours.push({
                                since: moment(since).format('HH:mm'),
                                until: moment(since).add(i.interval,'minutes').format('HH:mm'),
                                rowspan: (i.interval/10)*20,
                                type: moment(since) < moment() ? 0 : 1 //Verifico que la hora sea mayor a la hora actual 1: disponible
                            });
                        //Si supera la hora de refrigerio queda inactivo
                        }else{
                            interval = i.interval-Number(moment(nextTime).format('mm'));
                            hours.push({
                                since: moment(since).format('HH:mm'),
                                until: moment(since).add(interval,'minutes').format('HH:mm'),
                                rowspan: (interval/10)*20,
                                type: 0 //No disponible
                            });
                        }
                    }
                    since = interval === 0 ? moment(since).add(i.interval,'minutes') : moment(since).add(interval,'minutes')
                    //Calculamos el tiempo de limpieza
                    if(i.time_cleaning > 0){
                        //SI la hora siguiente supera el refigerio no agrego el tiempo de limpeza
                        let nextTime = moment(since).add(i.time_cleaning,'minutes');
                        if(nextTime <= timetable.lunch_since){
                            hours.push({
                                since: moment(since).format('HH:mm'),
                                until: moment(since).add(i.time_cleaning,'minutes').format('HH:mm'),
                                rowspan: (i.time_cleaning/10)*19,
                                type: 2 //limpieza
                            });
                            since = moment(since).add(i.time_cleaning,'minutes');
                        }
                    }
                }else if(i.lunch_since && timetable.lunch_since <= since && since < timetable.lunch_until){
                    //Calculamos el horario del refrigerio
                    hours.push({
                        since: moment(since).format('HH:mm'),
                        until: moment(since).add(i.interval,'minutes').format('HH:mm'),
                        rowspan: (20/10)*21,//(i.interval/10)*20,
                        type: 3 //refrigerio
                    });
                    since = moment(since).add(20,'minutes');
                }else if(i.schedule_afternoon_since && timetable.schedule_afternoon_since <= since && since < timetable.schedule_afternoon_until){
                    //Calculamos el horario de la tarde
                    //Busco si hay reserva en la hora
                    const intervalo = i.time_cleaning === 0 ? (i.interval - 10) : i.interval; // Nuevo - 2022-04-02
                    const schedule = `${moment(since).format('HH:mm:ss')}-${moment(since).add(i.interval,'minutes').format('HH:mm:ss')}`;
                    const schedule2 = `${moment(since).format('HH:mm:ss')}-${moment(since).add(intervalo,'minutes').format('HH:mm:ss')}`; // Nuevo - 2022-04-02
                    //crear objeto para filtrar
                    let filter = {
                        environment_id: i.id,
                        appointment: schedule,
                    }
                    if (doctor != 0)
                        filter["doctor_id"] = doctor;
                    if (patient != 0)
                        filter["patient_id"] = patient;
                    if (state != 0)
                        filter["state"] = state;
                    const reserv = _.find(reser,filter);
                    // Nuevo cambio 2022-04-02
                    let filter2 = filter;
                    filter2.appointment = schedule2;
                    const reserv2 = _.find(reser,filter2);
                    // Fin nuevo cambio
                    if(reserv || reserv2){
                        hours.push({
                            since: moment(since).format('HH:mm'),
                            until: moment(since).add(i.interval,'minutes').format('HH:mm'),
                            rowspan: (i.interval/10)*20,
                            type: 4, //reservado,
                            data: reserv ? reserv : reserv2 // Nuevo cambio 2022-04-02
                        });
                    }else{
                        hours.push({
                            since: moment(since).format('HH:mm'),
                            until: moment(since).add(i.interval,'minutes').format('HH:mm'),
                            rowspan: (i.interval/10)*20,
                            type: moment(since) < moment() ? 0 : 1 //Verifico que la hora sea mayor a la hora actual 1: disponible
                        });
                    }
                    
                    since = moment(since).add(i.interval,'minutes');
                    //Calculamos el tiempo de limpieza
                    if(i.time_cleaning > 0){
                        hours.push({
                            since: moment(since).format('HH:mm'),
                            until: moment(since).add(i.time_cleaning,'minutes').format('HH:mm'),
                            rowspan: (i.time_cleaning/10)*20,
                            type: 2 //limpieza
                        });
                        since = moment(since).add(i.time_cleaning,'minutes');
                    }
                }else{
                    hours.push({
                        since: moment(since).format('HH:mm'),
                        until: moment(since).add(10,'minutes').format('HH:mm'),
                        rowspan: 19.5,
                        type: 0 //No disponible
                    });
                    since = moment(since).add(10,'minutes');
                }
            }
            prog.push({
                idenvironment: i.id,
                dentalOffice: i.name,
                interval: i.interval,
                time_cleaning: i.time_cleaning,
                hours
            });
        });
        return prog;
    }

}
