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
    Request,
    BadRequestException,
    Res
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

//pdf
import { Pdf_frequent_patients } from './pdf/pdf-frequent-patients';
import { PdfDatesPatient } from './pdf/pdf-dates-patient';
//Excel4Node
import * as xl from 'excel4node';

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
        return await this._reservationService.get(id);
    }

    @Get('/enviroments/resumen/day/:id')
    async getResumenDayByChar(@Param('id',ParseIntPipe) id: number): Promise<any>{
        return await this._reservationService.getResumenDayByChar(id);
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
        @Body() reservation: Reservation,
        @Request() req: any
    ): Promise<Reservation>{
        //Validamos que no este pcupado el cupo
        const validate = await this._reservationService.validateCupo(reservation);
        if(typeof validate !== 'undefined'){
            throw new BadRequestException('El cupo ya no esta disponible.');
        }
        const create = await this._reservationService.create(reservation);
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

    @Get('get-by-id/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<any[]>{
        return await this._reservationService.getById(id);
    }

    @Get('confirm/:id/:state')
    async confirm(
        @Param('id', ParseIntPipe) id: number,
        @Param('state', ParseIntPipe) state: number,
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
        return await this._reservationService.confirm(id,state);
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

    @Get('list-filter/:patient/:doctor/:state/:since/:until')
    async getListState(
        @Param('patient', ParseIntPipe) patient: number,
        @Param('doctor', ParseIntPipe) doctor: number,
        @Param('state', ParseIntPipe) state: number,
        @Param('since') since: string,
        @Param('until') until: string
    ): Promise<Reservation[]>{
        return await this._reservationService.getListFilter(patient,doctor,state,since,until);
    }

    @Get('/send-mail/:id')
    async sendMail(
        @Param('id', ParseIntPipe) id: number
    ): Promise<boolean>{
        await this._reservationService.sendMailTest(id);
        return true;
    }

    @Get('reservation/cant/:month/:year')
    async getReservationCant(
        @Param('month', ParseIntPipe) month: number,
        @Param('year', ParseIntPipe) year: number
    ): Promise<any>{
        return this._reservationService.cantReservation(month,year);
    }

    /**
     * Metodos para los reportes
     */

    /**
     * Metodo para obtener la cantidad
     * de paciente frecuentes
     * Pacientes con ultima cita no mayor a 1 año
     * solo cantidad
     */
    @Get('patient-frequen-cant/:since/:until')
    async getPatientFrequentCant(
        @Param('since') since: string,
        @Param('until') until: string
    ): Promise<any>{
        return this._reservationService.patientFrequentCant(since,until);
    }

    @Get('controls-cant/:month/:year')
    async getCantControls(
    @Param('month', ParseIntPipe) month: number,
    @Param('year', ParseIntPipe) year: number
    ): Promise<any>{
        return this._reservationService.cantControls(month,year);
    }

    @Get('pdf-report-frequent-patients/:since/:until')
    async getPdfFrequentPatients(
        @Param('since') since: string,
        @Param('until') until: string
    ): Promise<any>{
        const data = await this._reservationService.patientFrequentDetail(since,until);
        const pdf = new Pdf_frequent_patients();
        return pdf.print(data);
    }
    @Post('/get-cant-reservation')
    async getCantReservation(@Body() filters: any): Promise<any>{
        return await this._reservationService.getCant(filters);
    }

    @Post('/get-cant-cancelada-reprogramada')
    async getCantCanceRepro(@Body() filters: any): Promise<any>{
        return await this._reservationService.getCantCanceRepro(filters);
    }

    @Post('/get-report-pdf-dates-patient')
    async getReportPdfPayPatient(@Body() filters: any): Promise<any>{
        const pdf = new PdfDatesPatient();
        const data = await this._reservationService.getDatesPatient(filters);
        return pdf.print(data,filters);
    }

    @Post('/get-report-xlsx-dates-patient')
    async getReportXlsxModelState(
        @Res() response,
        @Body() filters: any
    ): Promise<any>{
        const data = await this._reservationService.getDatesPatient(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Citas por paciente asistido');
        const styleTitle = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            font: {
                size: 14,
                bold: true
            }
        });
        ws.cell(1,1,1,4,true)
        .string(`Reporte Citas por paciente asistido`)
        .style(styleTitle);

        ws.cell(2,1,2,4,true)
        .string(``);
        ws.cell(3,1,3,4,true)
        .string(`Filtros: Desde ${moment(filters.since).format('DD-MM-YYYY')} | Hasta ${moment(filters.until).format('DD-MM-YYYY')}`);
        ws.cell(4,1,4,4,true)
        .string(``);

        const style = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#808080',
                fgColor: '#808080',
            },
            font: {
                color: '#ffffff',
                bold: true
            }
        });
        ws.cell(5,1)
        .string("Nro. Historia")
        .style(style);
        ws.cell(5,2)
        .string("Paciente")
        .style(style);
        ws.cell(5,3)
        .string("Fecha")
        .style(style);
        ws.cell(5,4)
        .string("Horario")
        .style(style);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(35);
        ws.column(3).setWidth(15);
        ws.column(4).setWidth(15);
        let y = 6;
        data.map((it: any) => {
            const {
                history,
                paciente,
                date,
                horario
            } = it;
            ws.cell(y,1)
            .string(`${history}`);
            ws.cell(y,2)
            .string(`${paciente}`);
            ws.cell(y,3)
            .string(`${moment(date).format('DD-MM-YYYY')}`);
            ws.cell(y,4)
            .string(`${horario}`);
            y++;
        });
        await wb.writeToBuffer().then(function (buffer: any) {
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=file.xlsx',
                'Content-Length': buffer.length
            })

            response.end(buffer);
        });
    }
}
