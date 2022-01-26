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
    let now = moment().format("YYYY-MM-DD");
    let reservation = await this._reservation.getByDateWithOutNotify(now)
    reservation.forEach(element => {
      let hour = element.appointment.split("-")[0]
      hour = hour.replace(':','').substring(0,4)
      let datestring = moment(element.date).format("YYYYMMDD")+hour;
      //this.logger.debug(moment(datestring, "YYYYMMDDhhmm").fromNow());
      let tiempo = moment(datestring, "YYYYMMDDhhmm").fromNow();
      //this.logger.debug(tiempo)
      if (tiempo=="in 2 hours" && !element.notify2h){
        let template = 'R2H';
        const tr = element.tariff ? element.tariff.id : 0;
        if(tr === 58){
          template = 'COFM2H';
        }
        this.logger.debug("enviando email correo")
        this._reservation.sendMail(element.id,template).then(()=>{
            this.logger.debug("correo enviado")
            this.logger.debug("marcando reservacion como notificada 2")
            this._reservation.updateNotify2h(element.id).then(()=>{
              this.logger.debug("marcado como notificada")
            })
        })
      }
      if (tiempo == "in a day" && !element.notify24h){
        let template = 'R24H';
        const tr = element.tariff ? element.tariff.id : 0;
        if(tr === 58){
          template = 'COFM24H';
        }
        this.logger.debug("enviando email correo")
        this._reservation.sendMail(element.id,template).then(()=>{
            this.logger.debug("correo enviado")
            this.logger.debug("marcando reservacion como notificada 24")
            this._reservation.updateNotify24h(element.id).then(()=>{
              this.logger.debug("marcado como notificada")
            })
        })
      }
    });  
  }
}
