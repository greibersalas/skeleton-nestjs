import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { EnvironmentDoctor } from '../environment-doctor/environment-doctor.entity';
import { ReservationService } from './reservation.service';
import { EnvironmentDoctorService } from '../environment-doctor/environment-doctor.service'
import { DoctorService } from '../doctor/doctor.service';
import { Hours } from './interface.hours';
import { FormFilter } from './form.filter';

@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly _ReservationService: ReservationService, 
        private _serviceEnviroment:EnvironmentDoctorService,
        private _serviceDoctor:DoctorService){}

    @Get(':id')
    async getReservation(@Param('id',ParseIntPipe) id: number): Promise<Reservation>{
        const Reservation = await this._ReservationService.get(id);
        return Reservation;
    }

    
    

    @Get('/environments/available/:day/:month/:year')
    async getEnvironmentAvailable(@Param('day',ParseIntPipe) day: number,
                                  @Param('month',ParseIntPipe) month: number,
                                  @Param('year',ParseIntPipe) year: number): Promise<EnvironmentDoctor[]>{
        let envCheck:EnvironmentDoctor[]=[]
        let date = new Date()
        date.setFullYear(year,month,day)
        const envs = await this._serviceEnviroment.getAll();
        const reservations = await this._ReservationService.getByDate(date)
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
                const beging = 8;
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
                let time = new Date(String(year)+"-"+monthstr+"-"+daystr+"T0" + String(beging)+":00:00Z")
                
                var conth = beging
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

    @Get('/Hours/available/:doctor_id/:environment_id/:day/:month/:year')
    async getHoursAvialiable(@Param('doctor_id',ParseIntPipe) doctor_id: number,
                        @Param('environment_id', ParseIntPipe) environment_id:number,
                        @Param('day',ParseIntPipe) day: number,
                        @Param('month',ParseIntPipe) month: number,
                        @Param('year',ParseIntPipe) year: number): Promise<Hours[]>{
        let date = new Date()
        date.setFullYear(year,month,day)
        let hours:Hours[]=[] ;
        let datestring = String(year)+'-'+String(month)+'-'+String(day)  
        const beging = 8;
        const end = 18
        const environment = await this._serviceEnviroment.get(environment_id)
        const interval =  environment.interval;
        const time_cleaning =  environment.time_cleaning; 
        const doctor = await this._serviceDoctor.get(doctor_id)               
        const reservations = await this._ReservationService.getByDoctorEnivronment(datestring,doctor,environment)
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
            let time = new Date(String(year)+"-"+monthstr+"-"+daystr+"T0" + String(beging)+":00:00Z")
            var conth = beging
            var step = interval/60;
            while(conth != end){
                let hourBegin = (time.toISOString().split('T')[1]).split('.')[0]
                time.setMinutes(time.getMinutes() + (interval-time_cleaning)) 
                let hourend = (time.toISOString().split('T')[1]).split('.')[0]
                hours.push({beging:hourBegin,end:hourend})
                conth= conth + step;
                time.setMinutes(time.getMinutes() + time_cleaning);
            } 
        }
        else{
            //verificar los rangos que estan ocupados.
            var timebusy = []
            
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
            let time = new Date(String(year)+"-"+monthstr+"-"+daystr+"T0" + String(beging)+":00:00Z")
            var conth = beging
            while(conth != end){
                let hourBegin = (time.toISOString().split('T')[1]).split('.')[0];
                time.setMinutes(time.getMinutes() + (interval-time_cleaning));
                let hourend = (time.toISOString().split('T')[1]).split('.')[0];

                if (!timebusy.includes(hourBegin+'-'+hourend))
                    hours.push({beging:hourBegin,end:hourend})
                
                time.setMinutes(time.getMinutes() + time_cleaning);
                conth++  
            } 
        }
        return hours;
    }

    @Get()
    async getReservations(): Promise<Reservation[]>{
        const Reservation = await this._ReservationService.getAll();
        return Reservation;
    }

    @Post()
    async createReservation(@Body() Reservation: Reservation): Promise<Reservation>{
        const create = await this._ReservationService.create(Reservation);
        return create;
    }

    @Post('/filter/')
    async filterReservation(@Body() formfilter: FormFilter): Promise<Reservation[]>{
        let reservations:Reservation[]=[]
        let reservationFilterSpecialty :Reservation[]=[]
        let reservationFilterbl:Reservation []=[]
        if (formfilter.bl.id == 0 && formfilter.environment.id == 0 && formfilter.specialty.id == 0 && formfilter.doctor.id == 0 ){
            reservations = await this._ReservationService.getAll();
        }
        else{
            reservations = await this._ReservationService.filterReservation(formfilter);
        }
        if (formfilter.specialty.id!=0){
            reservations.forEach(element => {
                if (element.qdetail.tariff.specialty.id == formfilter.specialty.id)
                    reservationFilterSpecialty.push(element)
            });
            reservations = reservationFilterSpecialty
        }
        
        if (formfilter.bl.id!=0){
            reservations.forEach(element=>{
                if (element.qdetail.tariff.specialty.businessLines.id == formfilter.bl.id)
                    reservationFilterbl.push(element)
            })
            reservations = reservationFilterbl
        }
        //console.log(reservations[0].qdetail.tariff.)
        return reservations;
    }

    @Put(':id')
    async updateReservation(@Param('id',ParseIntPipe) id: number, @Body() Reservation: Reservation){
        const update = await this._ReservationService.update(id,Reservation);
        return update;
    }

    @Delete(':id')
    async deleteReservation(@Param('id',ParseIntPipe) id: number){
        await this._ReservationService.delete(id);
        return true;
    }

    @Get('get-date-doctor/:date/:iddoctor')
    async getFirst(@Param('date') date,@Param('iddoctor',ParseIntPipe) doctor): Promise<any[]>{
        return await this._ReservationService.getByDateDoctor(date,doctor);
    }
}
