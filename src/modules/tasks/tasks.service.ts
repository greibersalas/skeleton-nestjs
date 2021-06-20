import { Injectable, Logger } from '@nestjs/common';
import { Interval} from '@nestjs/schedule';
import { ReservationService } from '../reservation/reservation.service';

var moment = require('moment-timezone');

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
      private _reservation: ReservationService
  ){}

  @Interval(60000)
  async handleInterval() {
    let now = moment().format("YYYY-MM-DD")
    //verify two hours before appointment
    let reservation = await this._reservation.getByDateWithOutNotify(now)
    reservation.forEach(element => {
        var hour = element.appointment.split("-")[0]
        hour = hour.replace(':','').substring(0,4)
        let datestring = moment().format("YYYYMMDD")+hour
        this.logger.debug(moment(datestring, "YYYYMMDDhhmm").fromNow());
        let tiempo = moment(datestring, "YYYYMMDDhhmm").fromNow()
        this.logger.debug(tiempo)
        if (tiempo=="in 2 hours"){
            this.logger.debug("enviando email correo")
            this._reservation.sendMail(element.id,"R2H").then(()=>{
                this.logger.debug("correo enviado")
                this.logger.debug("marcando reservacion como notificada")
                this._reservation.updateNotify2h(element.id).then(()=>{
                  this.logger.debug("marcado como notificada")
                })
            })
        }
    });
  }
}
