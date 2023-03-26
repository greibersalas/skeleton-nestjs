import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const moment = require('moment-timezone');
import _ = require("lodash");

import { DoctorProgrammingDto } from './dto/doctor-programing-dto';
import { ProgrammingDto } from './dto/programmimg-dto';

import { ViewDoctorProgramming } from './entity/doctor-programming-view.entity';
import { DoctorProgramming } from './entity/doctor-programming.entity';

@Injectable()
export class DoctorProgrammingService {

    constructor(
        @InjectRepository(DoctorProgramming)
        private readonly repository: Repository<DoctorProgramming>,
        @InjectRepository(ViewDoctorProgramming)
        private readonly repositoryView: Repository<ViewDoctorProgramming>,
    ) { }

    // Obtenemos todas las programaciones por iddoctor
    get(iddoctor: number): Promise<DoctorProgrammingDto[]> {
        return this.repository.createQueryBuilder('dp')
            .select(`dp.id, dp.iddoctor, dr."nameQuote" as doctor, dp.idenvironmentdoctor,
            ed.name as environmentdoctor, dp.date_since, dp.date_until, dp.time_since,
            dp.time_until, dp.interval, dp.idcampus, ca.name as campus, dp.status`)
            .innerJoin('dp.iddoctor', 'dr')
            .innerJoin('dp.idenvironmentdoctor', 'ed')
            .innerJoin('dp.idcampus', 'ca')
            .where('dp.status <> 0')
            .andWhere(`dp.iddoctor = ${iddoctor}`)
            .orderBy('dp.date_since', 'DESC')
            .addOrderBy('dp.time_since', 'ASC')
            .getRawMany();
    }

    getOne(id: number): Promise<DoctorProgrammingDto> {
        return this.repository.createQueryBuilder('dp')
            .select(`dp.id, dp.iddoctor, dr."nameQuote" as doctor, dp.idenvironmentdoctor,
            ed.name as environmentdoctor, dp.date_since::DATE, dp.date_until::DATE, dp.time_since,
            dp.time_until, dp.interval, dp.idcampus, ca.name as campus, dp.status`)
            .innerJoin('dp.iddoctor', 'dr')
            .innerJoin('dp.idenvironmentdoctor', 'ed')
            .innerJoin('dp.idcampus', 'ca')
            .andWhere(`dp.id = ${id}`)
            .getRawOne();
    }

    async create(data: DoctorProgramming): Promise<DoctorProgramming> {
        return await this.repository.save(data);
    }

    async update(id: number, data: DoctorProgrammingDto, iduser: number): Promise<DoctorProgramming> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        item.idenvironmentdoctor = data.idenvironmentdoctor;
        item.date_since = data.date_since;
        item.date_until = data.date_until;
        item.time_since = data.time_since;
        item.time_until = data.time_until;
        item.interval = data.interval;
        item.idcampus = data.idcampus;
        item.user = iduser;
        item.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        await item.save();
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { status: 0 });
    }

    async programmingDay(idcampus: number, dateDay: string, reser: any): Promise<any> {
        // Temp
        /*const reser = [{
            iddoctor: 1,
            since: '09:00:00',
            until: '09:20:00'
        }];*/
        // Busco los doctores programados en la sede y fecha seleccionados
        const doctors: DoctorProgrammingDto[] = await this.repositoryView.createQueryBuilder('vp')
            .select('*')
            .where(`date_since < '${dateDay}'`)
            .andWhere(`date_until > '${dateDay}'`)
            .andWhere(`idcampus = '${idcampus}'`)
            .getRawMany();
        // console.log({ doctors });
        const programming: ProgrammingDto[] = [];
        // Recorremos cada doctor programado
        let i = 0;
        //doctors.forEach((ele: ViewDoctorProgramming) => {
        let sameDoctor = false;
        let hours: any[] = []; // Lista de horas
        let since = moment(`${dateDay} 08:00:00`);
        let until = moment(`${dateDay} 21:00:00`);
        let cant = 0;
        outer: while (i < doctors.length) {
            const ele = doctors[i];
            cant++;
            if (!sameDoctor) {
                hours = [];
                since = moment(`${dateDay} 08:00:00`);
                until = moment(`${dateDay} 21:00:00`);
            }

            // Horario programado
            const schedule_since = moment(`${dateDay} ${ele.time_since}`);
            const schedule_until = moment(`${dateDay} ${ele.time_until}`);
            let hasShedule = false;
            // Ciclo del horario
            while (since <= until) {
                // Si el horario programado esta dentro del rango vamos agregando bloques
                if (schedule_since <= since && since < schedule_until) {
                    hasShedule = true;
                    // recorrer cada 10 minutos
                    //Busco si hay reserva en la hora
                    const intervalo = ele.interval; // Nuevo - 2022-04-02

                    const schedule2 = `${moment(since).format('HH:mm:ss')}-${moment(since).add(intervalo, 'minutes').format('HH:mm:ss')}`; // Nuevo - 2022-04-02

                    let first_reservation_hour = since;
                    let boolean = false;
                    const array_no_reservation = [];
                    let iterador = ele.interval / 10;
                    while (iterador > 0) {
                        const reservation_hour = moment(first_reservation_hour).format('HH:mm:ss');
                        //console.log({ reservation_hour });

                        let filter = {
                            doctor_id: ele.iddoctor,
                            since: reservation_hour,
                        };
                        const reserv = _.find(reser, filter);
                        //console.log({ reserv });

                        // Nuevo cambio 2022-04-02
                        let filter2 = filter;
                        filter2.since = schedule2;
                        const reserv2 = _.find(reser, filter2);
                        // Fin nuevo cambio
                        if (reserv) {
                            boolean = true;
                            iterador = 0;
                            //Si el otro perfil mostramos todo
                            array_no_reservation.push({
                                since: moment(`${dateDay} ${reserv.since}`).format('HH:mm'),
                                until: moment(`${dateDay} ${reserv.until}`).format('HH:mm'),
                                rowspan: (reserv.interval / 10) * 20,
                                type: 4, //reservado,
                                environtment: ele.idenvironmentdoctor,
                                environtment_name: ele.environmentdoctor,
                                interval: ele.interval,
                                data: reserv ? reserv : reserv2 // Nuevo cambio 2022-04-02
                            });
                            since = moment(`${dateDay} ${reserv.until}`);
                        } else {
                            array_no_reservation.push({
                                since: moment(first_reservation_hour).format('HH:mm'),
                                until: moment(first_reservation_hour).add(10, 'minutes').format('HH:mm'),
                                rowspan: 20,
                                environtment: ele.idenvironmentdoctor,
                                environtment_name: ele.environmentdoctor,
                                type: moment(first_reservation_hour) < moment() ? 0 : 1,
                                interval: ele.interval
                            });
                            first_reservation_hour = moment(first_reservation_hour).add(10, 'minutes');
                            iterador--;
                            since = moment(since).add(10, 'minutes');
                        }
                    }
                    hours = [...hours, ...array_no_reservation];
                } else {
                    if (hasShedule) {
                        //console.log('has');

                        sameDoctor = false;
                        const doc = doctors.filter(el => el.iddoctor === ele.iddoctor);
                        //console.log({ doc: doc.length, cant });

                        if (doc.length > cant) {
                            /* hours.push({
                                since: moment(since).format('HH:mm'),
                                until: moment(since).add(10, 'minutes').format('HH:mm'),
                                rowspan: 19.5,
                                type: 0, //No disponible
                                environtment: ele.idenvironmentdoctor,
                                environtment_name: ele.environmentdoctor,
                                interval: ele.interval
                            }); */
                            since = moment(since).add(10, 'minutes');
                            sameDoctor = true;
                            hasShedule = false;
                            i++;
                            continue outer;
                        }
                    }
                    hours.push({
                        since: moment(since).format('HH:mm'),
                        until: moment(since).add(10, 'minutes').format('HH:mm'),
                        rowspan: 19.5,
                        type: 0, //No disponible
                        environtment: ele.idenvironmentdoctor,
                        environtment_name: ele.environmentdoctor,
                        interval: ele.interval
                    });
                    since = moment(since).add(10, 'minutes');
                }

            }
            programming.push({
                iddoctor: ele.iddoctor,
                doctor: ele.doctor,
                date: dateDay,
                schedule: hours
            });
            i++;
            // Busco si ya el doctor tiene programación
            //const doc = programming.findIndex(el => el.iddoctor === ele.iddoctor);
            //console.log({ doc });

            /*if (doc >= 0) {
                //
                programming[doc].schedule.push({
                    since: moment(since).format('HH:mm'),
                    until: moment(since).add(10, 'minutes').format('HH:mm'),
                    rowspan: 19.5,
                    type: 1 //No disponible
                });
            } else {
                hours.push({
                    since: moment(since).format('HH:mm'),
                    until: moment(since).add(10, 'minutes').format('HH:mm'),
                    rowspan: 19.5,
                    type: 0 //No disponible
                });
                programming.push({
                    iddoctor: ele.iddoctor,
                    date: dateDay,
                    schedule: hours
                });
            }*/
        };
        // console.log({ programming });

        return programming;
    }
}
