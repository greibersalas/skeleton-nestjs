import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { EnvironmentDoctor } from '../environment-doctor/environment-doctor.entity';
import { DiaryLockRepository } from '../main/diary-lock/diary-lock.repository';
import { FormFilter } from './form.filter';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';
import { MailService } from '../mail/mail.service';
var moment = require('moment-timezone');
import { emailValidator } from '../../utils/email.utils';

@Injectable()
export class ReservationService {

    constructor(
        @InjectRepository(ReservationRepository)
        private readonly _reservationRepository: ReservationRepository,
        @InjectRepository(DiaryLockRepository)
        private readonly _diaryLockRepository: DiaryLockRepository,
        private mailService: MailService
    ) { }

    async get(id: number): Promise<Reservation> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }
        const Reservation = await this._reservationRepository.createQueryBuilder('re')
            .select(`re.id, re.reason, re.appointment,re.date::DATE,
            ev.name as environment,ev.id as idenvironment,
            dr.nameQuote as doctor,dr.id as iddoctor,
            pa.id as idpatient,ta.id as idtariff,
            concat(pa.name,' ',"pa"."lastNameFather") as patient,
            dr2.nameQuote as doctor2, dr2.id as iddoctor2, re.state,
            ta.description AS product, re.pending_payment, re.amount, re.idcoin, co.code AS coin`)
            .innerJoin("re.environment", "ev")
            .innerJoin("re.doctor", "dr")
            .innerJoin("re.patient", "pa")
            .leftJoin("re.tariff", "ta")
            .leftJoin("re.coin", "co")
            .leftJoin("doctor", "dr2", "dr2.id = re.doctor_id2")
            .where("re.id = :id AND re.state <> 0", { id }).getRawOne();

        return Reservation;
    }

    async filterReservation(formfilter: FormFilter): Promise<Reservation[]> {
        let attr: any = {}

        if (formfilter.environment.id != 0)
            attr.environment = formfilter.environment
        if (formfilter.doctor.id != 0)
            attr.doctor = formfilter.doctor

        attr.state = MoreThan(0);
        const Reservation = await this._reservationRepository.find({ where: attr });
        return Reservation
    }

    async getByDate(date: Date): Promise<Reservation[]> {
        const Reservation = await this._reservationRepository.find({ where: { date } });
        return Reservation
    }

    async getByDateWithOutNotify(date: Date): Promise<Reservation[]> {
        //const Reservation = await this._reservationRepository.find({where:{date,notify2h:false}});
        const reservation = await this._reservationRepository.createQueryBuilder('re')
            .leftJoinAndSelect('re.tariff', 'tr')
            .where('re.date >= :date AND (re.notify2h = FALSE OR re.notify24h = FALSE ) AND re.state <> 0', { date })
            .getMany();
        return reservation
    }

    async getByDoctorEnivronment(date: string, doctor: Doctor, environment: EnvironmentDoctor): Promise<Reservation[]> {
        const Reservation = await this._reservationRepository.find({ where: { date, doctor: doctor, environment: environment } });
        return Reservation
    }

    async getByEnivronment(date: string, environment: EnvironmentDoctor): Promise<Reservation[]> {
        const Reservation = await this._reservationRepository.find({ where: { date, environment: environment } });
        return Reservation
    }


    async getAll(): Promise<Reservation[]> {
        const reservations: Reservation[] = await this._reservationRepository
            .find({ where: { state: MoreThan(0) } });
        return reservations;
    }

    async create(bl: Reservation): Promise<Reservation> {
        const saveReservation: Reservation = await this._reservationRepository.save(bl);
        let template = 'R';
        const tr = Number(bl.tariff);
        if (bl.tariff && tr === 58) {
            template = 'COFM'; //Control OFM
        }
        //enviamos el correo de notificación al cliente
        await this.sendMail(saveReservation.id, template);
        return saveReservation;
    }

    async validateCupo(rese: Reservation): Promise<Reservation> {
        const reservation = await this._reservationRepository.createQueryBuilder('re')
            .where(`re.date = :date AND re.appointment = :appointment AND re.state <> 0
        AND re.environment_id = :environment`, {
                date: rese.date,
                appointment: rese.appointment,
                environment: rese.environment
            })
            .getOne();
        return reservation
    }

    async update(id: number, Reservation: Reservation): Promise<Reservation> {
        const ReservationExists = await this._reservationRepository.findOne(id);
        if (!ReservationExists) {
            throw new NotFoundException();
        }
        await this._reservationRepository.update(id, Reservation);
        const updateReservation: Reservation = await this._reservationRepository.findOne(id);
        return updateReservation;
    }

    async updateNotify2h(id: number): Promise<Reservation> {
        const ReservationExists = await this._reservationRepository.findOne(id);
        if (!ReservationExists) {
            throw new NotFoundException();
        }
        ReservationExists.notify2h = true
        await this._reservationRepository.update(id, ReservationExists);
        const updateReservation: Reservation = await this._reservationRepository.findOne(id);
        return updateReservation;
    }

    async updateNotify24h(id: number): Promise<Reservation> {
        const ReservationExists = await this._reservationRepository.findOne(id);
        if (!ReservationExists) {
            throw new NotFoundException();
        }
        ReservationExists.notify24h = true
        await this._reservationRepository.update(id, ReservationExists);
        const updateReservation: Reservation = await this._reservationRepository.findOne(id);
        return updateReservation;
    }

    async delete(id: number): Promise<void> {
        const ReservationExists = await this._reservationRepository.findOne(id);
        if (!ReservationExists) {
            throw new NotFoundException();
        }

        await this._reservationRepository.update(id, { state: 0 });
    }

    async getByDateDoctor(filters: any): Promise<any[]> {
        const resers = await this._reservationRepository
            .createQueryBuilder("rs")
            .innerJoinAndSelect("rs.doctor", "doctor")
            .innerJoinAndSelect("rs.environment", "environment")
            .innerJoinAndSelect("rs.patient", "ch")
            .innerJoinAndSelect("rs.tariff", "tariff")
            .where("rs.date BETWEEN :since AND :until AND doctor.id = :iddoctor AND rs.state <> 0", {
                since: filters.since,
                until: filters.until,
                iddoctor: filters.doctor
            }).orderBy({ "rs.appointment": "DESC" })
            .getMany();
        return resers;
    }

    async getByClinicHistory(id: number): Promise<any[]> {
        const data: any = await this._reservationRepository
            .createQueryBuilder("re")
            .innerJoinAndSelect("re.doctor", "doc")
            .innerJoinAndSelect("re.environment", "ev")
            .leftJoinAndSelect("re.tariff", "tf")
            .innerJoinAndSelect("re.patient", "ch", "ch.id = :ch", { ch: id })
            .where("re.state <> 0")
            .orderBy("re.date", "DESC")
            .addOrderBy('re.appointment', 'DESC')
            .getMany();

        return data;
    }

    async getById(id: number): Promise<any> {
        const data: any = await this._reservationRepository
            .createQueryBuilder("re")
            .innerJoinAndSelect("re.doctor", "doc")
            .innerJoinAndSelect("re.environment", "ev")
            .leftJoinAndSelect("re.tariff", "tf")
            .innerJoinAndSelect("re.patient", "ch",)
            .where("re.state <> 0 AND re.id = :id", { id }).orderBy({ "re.date": "DESC" })
            .getOne();
        return data;
    }

    async confirm(id: number, state: number): Promise<any> {
        const confirm = await this._reservationRepository.update({ id }, { state });
        //enviamos el correo de notificación al cliente
        if (state === 2)
            await this.sendMail(id, 'C');
        return confirm;
    }

    async getByDay(date: string, campus: number): Promise<Reservation[]> {
        const reservation = await this._reservationRepository
            .createQueryBuilder('rs')
            .select('rs.*, pt.*, dc.nameQuote as doctor, rs.id AS idreservation, rs.state as status')
            .innerJoin('rs.environment', 'ed')
            .innerJoin('rs.doctor', 'dc')
            .innerJoin('rs.patient', 'pt')
            .where(`
                rs.state <> 0 AND
                "rs"."date"::DATE = '${date}'
                AND ed.campus = ${campus} AND ed.state <> 0
            `).getRawMany();
        return reservation;
    }

    async validateReservation(iddoctor: number, date: string, appointment: string, idcampus: number): Promise<number> {
        let hours = appointment.split('-');
        //Busco si el doctor tiene la hora bloqueda
        const lock = await this._diaryLockRepository.createQueryBuilder('dl')
            .where(`dl.date = :date AND
        ((:since >= time_since and :since < time_until)
        OR (:until >= time_since AND :until < time_until ))
        AND dl.campus = :campus AND dl.state = 1 AND dl.doctor = :doctor`,
                { date, since: hours[0], until: hours[1], campus: idcampus, doctor: iddoctor })
            //.getQuery();
            .getMany();
        if (lock.length > 0) {
            return 2;
        }
        const reservation = await this._reservationRepository
            .findOne({
                where: {
                    state: MoreThan(0),
                    doctor: iddoctor,
                    date,
                    appointment: Like(`${hours[0]}%`)
                }
            });
        if (reservation)
            return 1;
        return 0;
    }

    async cancel(id: number): Promise<boolean> {
        const confirm = await this._reservationRepository.createQueryBuilder()
            .update(Reservation)
            .set({ state: 0 }).where({ id }).execute();
        if (!confirm) {
            return false;
        }
        return true;
    }

    async getListFilter(
        patient: number,
        doctor: number,
        state: number,
        since: string,
        until: string
    ): Promise<Reservation[]> {
        let attr: any = {};
        let where: string = `rs.date::DATE BETWEEN '${since}' AND '${until}'`;
        if (patient !== 0) {
            //attr.patient = patient;
            where += ` AND rs.patient = ${patient}`;
        }
        if (doctor > 0) {
            //attr.doctor = doctor;
            //attr.date = since;
            where += ` AND rs.doctor = ${doctor}`;
        }
        if (state) {
            //attr.state = state;
            where += ` AND rs.state = ${state}`;
        } else {
            where += ` AND rs.state <> 0`;
        }

        /*const list = await this._reservationRepository.find(
            {
                where: attr,
                order: {date: 'DESC'}
            }
        );*/

        const list = await this._reservationRepository.createQueryBuilder("rs")
            .innerJoinAndSelect("rs.doctor", "doctor")
            .innerJoinAndSelect("rs.patient", "patient")
            .innerJoinAndSelect("rs.environment", "environment")
            .where(`${where}`)
            .getMany();
        return list
    }

    async sendMailTest(id: number) {
        //Buscamos los datos de la reserva
        const reser = await this._reservationRepository.createQueryBuilder('rs')
            .select('rs.date, rs.appointment, ch.name, ch.email')
            .innerJoin('clinic_history', 'ch', 'ch.id = rs.patient')
            .where("rs.id = :id", { id })
            .getRawOne();
        const { name, email, date, appointment } = reser;
        const reservationDate = moment(date).format('DD/MM/YYYY');
        const datetime = `${moment(date).format('YYYY-MM-DD')} ${appointment.split('-')[0]}`;
        const reservationTime = moment(datetime).format('hh:mm a');
        if (email && email !== '') {
            console.log("Sending mail...");
            let dataEmail = {
                name, email,
                date: reservationDate,
                appointment: reservationTime
            };
            await this.mailService.sendReservation24(dataEmail);
        }
    }

    async sendMail(id: number, template: string) {
        //Buscamos los datos de la reserva
        const reser = await this._reservationRepository.createQueryBuilder('rs')
            .select(`rs.date, CONCAT(ch.name,' ',"ch"."lastNameFather",' ',"ch"."lastNameMother") as patient,
        rs.appointment, tr.description as treatment, dc.name as doctor,
        ch.name, ch.email, dc.email as dr_email`)
            .innerJoin('clinic_history', 'ch', 'ch.id = rs.patient')
            .leftJoin('rs.doctor', 'dc')
            .leftJoin('rs.tariff', 'tr')
            .where("rs.id = :id", { id })
            .getRawOne();
        const { name, email, date, appointment, dr_email, treatment, patient, doctor } = reser;
        const reservationDate = moment(date).format('DD/MM/YYYY');
        const datetime = `${moment(date).format('YYYY-MM-DD')} ${appointment.split('-')[0]}`;
        const reservationTime = moment(datetime).format('hh:mm a');
        if (email && email !== '') {
            if (emailValidator(email)) {
                //console.log("Sending mail...");
                let dataEmail = {
                    name, email,
                    date: reservationDate,
                    appointment: reservationTime,
                    template
                };
                await this.mailService.sendReservation(dataEmail);
                if (template === 'R' || template === 'C') {
                    //Enviamos notificación al doctor
                    if (emailValidator(dr_email)) {
                        //console.log("Sending mail doctor...");
                        let dataEmailDoctor = {
                            name: doctor,
                            email: dr_email,
                            date: reservationDate,
                            appointment: reservationTime,
                            treatment,
                            patient,
                            template: `${template}D`
                        };
                        await this.mailService.sendReservation(dataEmailDoctor);
                    }
                }
            }
        }
    }

    /**
     * Reports
     */
    async cantReservation(month: number, year: number): Promise<any> {
        const cant = await this._reservationRepository.createQueryBuilder('re')
            //.select('count(*) as total')
            .where('EXTRACT(month FROM "date") = :month AND EXTRACT(YEAR FROM "date") = :year AND state <> 0', { month, year })
            .getCount();
        return cant;
    }

    async patientFrequentCant(since: string, until: string): Promise<any> {
        const data = await this._reservationRepository.createQueryBuilder('re')
            .select('patient_id,count(patient_id) as total')
            .where(`date BETWEEN :since AND :until AND state <> 0`, { since, until })
            .groupBy('patient_id')
            .getRawMany();
        return data;
    }

    async getResumenDayByChar(id: number): Promise<any> {
        let today = moment().format('YYYY-MM-DD');
        let lastday = moment().subtract(360, 'd').format('YYYY-MM-DD')
        const data = await this._reservationRepository.createQueryBuilder('re')
            .select('date, count(id) as total')
            .where(`date BETWEEN :lastday AND :today AND state <> 0 AND environment_id = :id`, { lastday, today, id })
            .groupBy('date,environment_id')
            .orderBy('date')
            .getRawMany();
        return data;

    }

    async getReservationPatientDate(idpatient: number, date: string): Promise<Reservation[]> {
        return this._reservationRepository.find({
            where: {
                patient: idpatient,
                date
            }
        });
    }
    /**
     * Metodo que me retorna la cantidad de
     * Controles confirmados y atendidos
     * en un mes
     * @params int month, int year
     */
    async cantControls(month: number, year: number): Promise<any> {
        const data = await this._reservationRepository.createQueryBuilder('re')
            .select(`sum(case when state = 1 then 1 else 0 end) as sin_confirmar,
        sum(case when state = 2 then 1 else 0 end) as confirmados,
        sum(case when state = 3 then 1 else 0 end) as atendidos,
        count(*) as total`)
            .where(`tariff_id = 58 AND EXTRACT(month from date) = :month
        AND EXTRACT(year from date) = :year AND state <> 0`, { month, year })
            .getRawOne();
        return data;
    }

    async patientFrequentDetail(since: string, until: string): Promise<any> {
        const data = await this._reservationRepository.createQueryBuilder('re')
            .select(`pa.name as name,"pa"."lastNameFather" as lastnamefather,
        "pa"."lastNameMother" as lastnamemother,"pa"."documentNumber" AS num_document,
        pa.history,pa.birthdate,pa.cellphone`)
            .where(`re.date BETWEEN :since AND :until AND re.state <> 0`, { since, until })
            .innerJoin('re.patient', 'pa')
            .groupBy(`pa.name,"pa"."lastNameFather","pa"."lastNameMother","pa"."documentNumber",
        pa.history,pa.birthdate,pa.cellphone`)
            .getRawMany();
        return data;
    }

    async getCant(filters: any): Promise<any> {
        return await this._reservationRepository.createQueryBuilder('re')
            .select(`count(*) as total,
        sum(CASE WHEN state = 1 then 1 else 0 end) AS reservada,
        sum(CASE WHEN state = 2 then 1 else 0 end) AS confirmada,
        sum(CASE WHEN state = 3 then 1 else 0 end) AS atendida`)
            .where(`re.date BETWEEN :since AND :until AND re.state <> 0`, { since: filters.since, until: filters.until })
            .getRawOne();
    }

    async getCantCanceRepro(filters: any): Promise<any> {
        return await this._reservationRepository.createQueryBuilder('re')
            .select(`count(re.*) AS total,
        sum(CASE WHEN re.state = 0 then 1 else 0 end) AS cancelada,
        count(au) AS reprogramada`)
            .leftJoin('audit', 'au', `au.idregister = re.id AND au.title = 'Reservation' AND au.description = 'Update registro'`)
            .where(`re.date BETWEEN :since AND :until`, { since: filters.since, until: filters.until })
            .getRawOne();
    }

    async getDatesPatient(filters: any): Promise<any> {
        let where = '';
        if (Number(filters.tariff) > 0) {
            where = ` AND tr.id = ${Number(filters.tariff)}`;
        }
        if (Number(filters.specialty)) {
            where = ` AND tr.specialty = ${Number(filters.specialty)}`;
            return await this._reservationRepository.createQueryBuilder('re')
                .select(`ch.history, concat_ws( ' ',ch.name,"ch"."lastNameFather","ch"."lastNameMother" ) AS paciente,
            re.date,re.appointment AS horario,re.reason,ed.name AS environment,"do"."nameQuote" AS doctor,
            re.state, (SELECT
            CONCAT_WS(' ','Usuario:',us.username,'Fecha:',to_char(au.datetime,'DD/MM/YYYY HH:MM'))
            FROM audit au
            JOIN users us On us.id = au.iduser
            WHERE au.title = 'Reservation' AND au.state = 1 AND au.idregister = re.id
            ORDER BY au.idaudit DESC LIMIT 1) AS auditoria,
            tr.name AS treatment, sp.name AS specialty`)
                .leftJoin('clinic_history', 'ch', `ch.id = re.patient_id`)
                .innerJoin(`tariff`, `tr`, `tr.id = re.tariff_id ${where}`)
                .innerJoin(`specialty`, `sp`, `sp.id = tr.specialty`)
                .innerJoin('environment_doctor', 'ed', `ed.id = re.environment_id`)
                .innerJoin('doctor', 'do', `do.id = re.doctor_id`)
                .where(`re.date BETWEEN :since AND :until`, { since: filters.since, until: filters.until })
                .orderBy(`re.date,ch.name,re.appointment`)
                .getRawMany();
        } else {
            return await this._reservationRepository.createQueryBuilder('re')
                .select(`ch.history, concat_ws( ' ',ch.name,"ch"."lastNameFather","ch"."lastNameMother" ) AS paciente,
                re.date,re.appointment AS horario,re.reason,ed.name AS environment,"do"."nameQuote" AS doctor,
                re.state, (SELECT
                CONCAT_WS(' ','Usuario:',us.username,'Fecha:',to_char(au.datetime,'DD/MM/YYYY HH:MM'))
                FROM audit au
                JOIN users us On us.id = au.iduser
                WHERE au.title = 'Reservation' AND au.state = 1 AND au.idregister = re.id
                ORDER BY au.idaudit DESC LIMIT 1) AS auditoria,
                tr.name AS treatment, sp.name AS specialty`)
                .leftJoin('clinic_history', 'ch', `ch.id = re.patient_id`)
                .leftJoin(`tariff`, `tr`, `tr.id = re.tariff_id ${where}`)
                .leftJoin(`specialty`, `sp`, `sp.id = tr.specialty`)
                .innerJoin('environment_doctor', 'ed', `ed.id = re.environment_id`)
                .innerJoin('doctor', 'do', `do.id = re.doctor_id`)
                .where(`re.date BETWEEN :since AND :until`, { since: filters.since, until: filters.until })
                .orderBy(`re.date,ch.name,re.appointment`)
                .getRawMany();

        }
    }
}
