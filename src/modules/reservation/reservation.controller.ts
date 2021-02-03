import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { EnvironmentDoctor } from '../environment-doctor/environment-doctor.entity';
import { ReservationService } from './reservation.service';
import { EnvironmentDoctorService } from '../environment-doctor/environment-doctor.service'
import { DoctorService } from '../doctor/doctor.service';
import { Hours } from './interface.hours';

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
            envs.forEach((env:EnvironmentDoctor)=>{
                reservations.forEach((reservation:Reservation)=>{
                    if (reservation.environment == env){
                        //comprobar la disponibilidad 
                    }
                    else{
                        envCheck.push(env);
                    }
                })
            })
            return envCheck;
        }
        
    }

    @Get('/hours/:doctor_id/:environment_id/:day/:month/:year')
    async getHoursAvialiable(@Param('idoctor_d',ParseIntPipe) doctor_id: number,
                        @Param('environment_id', ParseIntPipe) environment_id:number,
                        @Param('day',ParseIntPipe) day: number,
                        @Param('month',ParseIntPipe) month: number,
                        @Param('year',ParseIntPipe) year: number): Promise<Hours[]>{
        let date = new Date()
        date.setFullYear(year,month,day)
        let hours:Hours[]=[] ;  
        const beging = 8;
        const end = 18
        const environment = await this._serviceEnviroment.get(environment_id) 
        const doctor = await this._serviceDoctor.get(doctor_id)               
        const reservations = await this._ReservationService.getByDoctorEnivronment(date,doctor,environment)
        if (reservations.length ==0){
            hours.push({beging:String(beging)+":00",end:String(end)+":00"})
        }
        else{
            //verificar los rangos que estan ocupados.
            for(var h =beging;h <= end; h++){
                reservations.forEach((res:Reservation)=>{
                    
                })
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
}
