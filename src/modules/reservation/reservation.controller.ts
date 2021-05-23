import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    Request
} from '@nestjs/common';
var moment = require('moment-timezone');

import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { Hours } from './interface.hours';
import { Audit } from '../security/audit/audit.entity';
import { EnvironmentDoctor } from '../environment-doctor/environment-doctor.entity';
import { Reservation } from './reservation.entity';
import { ClinicHistoryService  } from '../clinic-history/clinic-history.service'
import { DoctorService } from '../doctor/doctor.service';
import { EnvironmentDoctorService } from '../environment-doctor/environment-doctor.service'
import { ReservationService } from './reservation.service';
import { FormFilter } from './form.filter';

@UseGuards(JwtAuthGuard)
@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly _reservationService: ReservationService,
        private _serviceEnviroment:EnvironmentDoctorService,
        private _serviceDoctor:DoctorService,
        private _servicePatient:ClinicHistoryService
        ){}

    @Get(':id')
    async getReservation(@Param('id',ParseIntPipe) id: number): Promise<Reservation>{
        const Reservation = await this._reservationService.get(id);
        return Reservation;
    }

    @Get('/environments/available/:day/:month/:year')
    async getEnvironmentAvailable(@Param('day',ParseIntPipe) day: number,
                                  @Param('month',ParseIntPipe) month: number,
                                  @Param('year',ParseIntPipe) year: number): Promise<EnvironmentDoctor[]>{
        let envCheck:EnvironmentDoctor[]=[]
        let date = new Date()
        let dateDr = new Date()
        date.setFullYear(year,month,day)
        dateDr.setFullYear(year,month,day-1)
        //var dayweek = dateDr.toUTCString().split(',')[0].toLowerCase()
        const envs = await this._serviceEnviroment.getAll();
        const reservations = await this._reservationService.getByDate(date)
        if (reservations.length==0){
            return envs
        }
        else{
            //verificar que ambiente tiene por lo menos una sola programación
            let environmentBusy:EnvironmentDoctor[] = []
            envs.forEach((env:EnvironmentDoctor)=>{
                reservations.forEach((reservation:Reservation)=>{
                    if (reservation.environment.id == env.id){
                        var exit = false
                        environmentBusy.forEach(ev=>{
                            if (ev.id == env.id)
                                exit = true
                        })
                        if (!exit)
                            environmentBusy.push(env)
                    }
                    else{
                        var exit = false
                        envCheck.forEach(re=>{
                            if (re.id == env.id)
                                exit = true
                        })
                        if (!exit)
                            envCheck.push(env);
                    }
                })
            })
            var process = 0
            environmentBusy.forEach(env=>{
                var beging = '08';
                const dateActu = `${year}-${month}-${day}`;
                if(moment().tz("America/Lima").format('YYYY-MM-DD') === moment(dateActu).format('YYYY-MM-DD')){
                    beging = moment().tz("America/Lima").format('HH');
                    //console.log("beging ",beging);
                }
                const end = 18
                const interval =  env.interval
                let Hours:Hours[]=[];
                var monthstr=''
                var daystr=''
                if (month < 10)
                    monthstr = '0'+String(month)
                else
                    monthstr = String(month)
                if (day<10)
                    daystr = '0'+String(day)
                else
                    daystr = String(day)
                let time = new Date(String(year)+"-"+monthstr+"-"+daystr+"T" + String(beging)+":00:00Z")

                var conth = Number(beging);
                var step = interval/60
                var hbusy = 0
                while(conth <= end){
                    let hourBegin = (time.toISOString().split('T')[1]).split('.')[0]
                    time.setMinutes(time.getMinutes() + interval) 
                    let hourend = (time.toISOString().split('T')[1]).split('.')[0]
                    Hours.push({beging:hourBegin,end:hourend})
                    reservations.forEach(resv=>{
                        if (resv.appointment == String(hourBegin+'-'+hourend))
                            hbusy++
                    })
                    conth=conth+step
                } 
                if (Hours.length!=hbusy)
                    envCheck.push(env)
                process++
            })
            return envCheck
        }
    }

    @Get('/hours/available/:doctor_id/:environment_id/:day/:month/:year')
    async getHoursAvialiable(@Param('doctor_id',ParseIntPipe) doctor_id: number,
                        @Param('environment_id', ParseIntPipe) environment_id:number,
                        @Param('day',ParseIntPipe) day: number,
                        @Param('month',ParseIntPipe) month: number,
                        @Param('year',ParseIntPipe) year: number): Promise<Hours[]>{
        let date = new Date()
        date.setFullYear(year,month,day)
        let hours:Hours[]=[] ;
        let datestring = String(year)+'-'+String(month)+'-'+String(day);
        var beging = '08';
        const dateActu = Date.parse(`${year}-${month}-${day}`);
        if(moment().tz("America/Lima").format('YYYY-MM-DD') === moment(dateActu).format('YYYY-MM-DD')){
            beging = moment().tz("America/Lima").format('HH');
            //console.log("beging ",beging);
        }
        const end = 18
        const environment = await this._serviceEnviroment.get(environment_id)
        const interval =  environment.interval;
        const time_cleaning =  environment.time_cleaning;
        const doctor = await this._serviceDoctor.get(doctor_id)
        const reservations = await this._reservationService.getByDoctorEnivronment(datestring,doctor,environment)
        let m_schedule = doctor.morning_schedule
        let a_schedule = doctor.afternoon_schedule
        if (reservations.length == 0){
            var monthstr=''
            var daystr=''
            if (month < 10)
                monthstr = '0'+String(month-1)
            else
                monthstr = String(month-1)
            if (day<10)
                daystr = '0'+String(day)
            else
                daystr = String(day)
            let time = new Date(String(year)+"-"+monthstr+"-"+daystr+"T" + String(beging)+":00:00Z")
            var conth = Number(beging);
            var step = interval/60;
            while(conth != end){
                let hourBegin = (time.toISOString().split('T')[1]).split('.')[0]
                time.setMinutes(time.getMinutes() + (interval-time_cleaning)) 
                let hourend = (time.toISOString().split('T')[1]).split('.')[0]
                if (m_schedule != null){
                    let hi = m_schedule.split('-')[0].split(':')
                    let doctorhi = (parseInt(hi[0])*3600)+(parseInt(hi[1])*60)
                    let he = m_schedule.split('-')[1].split(':')
                    let doctorhe = (parseInt(he[0])*3600)+(parseInt(he[1])*60)
                    let hip = hourBegin.split(':')
                    let hiprogr = (parseInt(hip[0])*3600)+(parseInt(hip[1])*60)
                    let hep = hourend.split(':')
                    let heprogr = (parseInt(hep[0])*3600)+(parseInt(hep[1])*60)

                    if (hiprogr>=doctorhi && heprogr<=doctorhe){
                        hours.push({beging:hourBegin,end:hourend})
                    }
                }
                if (a_schedule !== null && typeof a_schedule !== 'undefined' && a_schedule !== 'undefined' && a_schedule !== ''){
                    let hi = a_schedule.split('-')[0].split(':')
                    let doctorhi = (parseInt(hi[0])*3600)+(parseInt(hi[1])*60)
                    let he = a_schedule.split('-')[1].split(':')
                    let doctorhe = (parseInt(he[0])*3600)+(parseInt(he[1])*60)
                    let hip = hourBegin.split(':')
                    let hiprogr = (parseInt(hip[0])*3600)+(parseInt(hip[1])*60)
                    let hep = hourend.split(':')
                    let heprogr = (parseInt(hep[0])*3600)+(parseInt(hep[1])*60)

                    if (hiprogr >= doctorhi && heprogr <= doctorhe){
                        hours.push({beging:hourBegin,end:hourend})
                    }
                }
                //hours.push({beging:hourBegin,end:hourend})
                conth= conth + step;
                time.setMinutes(time.getMinutes() + time_cleaning);
            } 
        }else{
            //verificar los rangos que estan ocupados.
            var timebusy = [];
            reservations.forEach(res=>{
                timebusy.push(res.appointment)
            })
            var monthstr=''
            var daystr=''
            if (month < 10)
                monthstr = '0'+String(month-1)
            else
                monthstr = String(month-1)
            if (day<10)
                daystr = '0'+String(day)
            else
                daystr = String(day)
            let time = new Date(String(year)+"-"+monthstr+"-"+daystr+"T" + String(beging)+":00:00Z")
            var conth = Number(beging);

            while(conth != end){
                let hourBegin = (time.toISOString().split('T')[1]).split('.')[0];
                time.setMinutes(time.getMinutes() + (interval-time_cleaning));
                let hourend = (time.toISOString().split('T')[1]).split('.')[0];

                if (!timebusy.includes(hourBegin+'-'+hourend)){
                    if (m_schedule != null){
                        let hi = m_schedule.split('-')[0].split(':')
                        let doctorhi = (parseInt(hi[0])*3600)+(parseInt(hi[1])*60)
                        let he = m_schedule.split('-')[1].split(':')
                        let doctorhe = (parseInt(he[0])*3600)+(parseInt(he[1])*60)
                        let hip = hourBegin.split(':')
                        let hiprogr = (parseInt(hip[0])*3600)+(parseInt(hip[1])*60)
                        let hep = hourend.split(':')
                        let heprogr = (parseInt(hep[0])*3600)+(parseInt(hep[1])*60)

                        if (hiprogr>=doctorhi && heprogr<=doctorhe){
                            hours.push({beging:hourBegin,end:hourend})
                        }
                    }
                    if (a_schedule != null){
                        let hi = a_schedule.split('-')[0].split(':')
                        let doctorhi = (parseInt(hi[0])*3600)+(parseInt(hi[1])*60)
                        let he = a_schedule.split('-')[1].split(':')
                        let doctorhe = (parseInt(he[0])*3600)+(parseInt(he[1])*60)
                        let hip = hourBegin.split(':')
                        let hiprogr = (parseInt(hip[0])*3600)+(parseInt(hip[1])*60)
                        let hep = hourend.split(':')
                        let heprogr = (parseInt(hep[0])*3600)+(parseInt(hep[1])*60)

                        if (hiprogr >= doctorhi && heprogr <= doctorhe){
                            hours.push({beging:hourBegin,end:hourend})
                        }
                    }
                }
                time.setMinutes(time.getMinutes() + time_cleaning);
                conth++
            }
        }
        return hours;
    }

    @Get()
    async getReservations(): Promise<Reservation[]>{
        const Reservation = await this._reservationService.getAll();
        return Reservation;
    }

    @Post()
    async createReservation(
        @Body() Reservation: Reservation,
        @Request() req: any
    ): Promise<Reservation>{
        const create = await this._reservationService.create(Reservation);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'Reservation';
        audit.description = 'Insert registro';
        audit.data = JSON.stringify(create);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return create;
    }

    @Post('/filter/')
    async filterReservation(@Body() formfilter: FormFilter): Promise<Reservation[]>{
        let reservations:Reservation[]=[]
        let reservationFilterSpecialty :Reservation[]=[]
        let reservationFilterbl:Reservation []=[]
        let reservationRegister:Reservation []=[]
        let reservationPatient:Reservation []=[]
        if (formfilter.bl.id == 0 && formfilter.environment.id == 0 && formfilter.specialty.id == 0 && formfilter.doctor.id == 0 ){
            reservations = await this._reservationService.getAll();
        }
        else{
            reservations = await this._reservationService.filterReservation(formfilter);
        }
        if (formfilter.specialty.id!=0){
            reservations.forEach(element => {
                if (element.tariff.specialty.id == formfilter.specialty.id)
                    reservationFilterSpecialty.push(element)
            });
            reservations = reservationFilterSpecialty
        }
        if (formfilter.bl.id!=0){
            reservations.forEach(element=>{
                if (element.tariff.specialty.businessLines.id == formfilter.bl.id)
                    reservationFilterbl.push(element)
            })
            reservations = reservationFilterbl
        }
       
        if (formfilter.register != true){
            reservations.forEach(element=>{
                if (element.state != 1)
                    reservationRegister.push(element)
            })
            reservations = reservationRegister
        } 

        if (formfilter.confirm != true){
            reservations.forEach(element=>{
                if (element.state != 2)
                    reservationRegister.push(element)
            })
            reservations = reservationRegister
        } 
        
        if (formfilter.attended != true){
            reservations.forEach(element=>{
                if (element.state != 3)
                    reservationRegister.push(element)
            })
            reservations = reservationRegister
        } 

        if (formfilter.patient.id != 0){
            const pa = await this._servicePatient.get(formfilter.patient.id)
            reservations.forEach(element=>{
                if (element.patient.id == pa.id)
                    reservationPatient.push(element)
            })
            reservations = reservationPatient
        }

        //console.log(reservations[0].qdetail.tariff.)
        return reservations;
    }

    @Put(':id')
    async updateReservation(
        @Param('id',ParseIntPipe) id: number,
        @Body() Reservation: Reservation,
        @Request() req: any
    ){
        const update = await this._reservationService.update(id,Reservation);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'Reservation';
        audit.description = 'Update registro';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return update;
    }

    @Delete(':id')
    async deleteReservation(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._reservationService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'Reservation';
        audit.description = 'Delete registro';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return true;
    }

    @Post('get-date-doctor/')
    async getFirst(@Body() filters: any): Promise<any[]>{
        return await this._reservationService.getByDateDoctor(filters);
    }

    @Get('get-by-clinic-history/:id')
    async getByClinicHistory(@Param('id', ParseIntPipe) id: number): Promise<any[]>{
        return await this._reservationService.getByClinicHistory(id);
    }

    @Get('confirm/:id')
    async confirm(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ): Promise<any>{
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'Reservation';
        audit.description = 'Confirm cita';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return await this._reservationService.confirm(id);
    }

    @Get('validate-doctor/:iddoctor/:date/:appointment/:idcampus')
    async validateDoctor(@Param('iddoctor', ParseIntPipe) iddoctor: number,
    @Param('date') date: string,@Param('appointment') appointment: string,
    @Param('idcampus', ParseIntPipe) idcampus: number): Promise<number>{
        return await this._reservationService.validateReservation(iddoctor,date,appointment,idcampus);
    }

    @Get('cancel/:id')
    async cancel(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ): Promise<boolean>{
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'Reservation';
        audit.description = 'Cancelar cita';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return await this._reservationService.cancel(id);
    }

    @Get('list-filter/:patient/:doctor/:state')
    async getListState(
        @Param('patient', ParseIntPipe) patient: number,
        @Param('doctor', ParseIntPipe) doctor: number,
        @Param('state', ParseIntPipe) state: number
    ): Promise<Reservation[]>{
        return await this._reservationService.getListFilter(patient,doctor,state);
    }

    @Get('/send-mail/:id')
    async sendMail(): Promise<boolean>{
        this._reservationService.sendMailTest();
        return true;
    }
}
