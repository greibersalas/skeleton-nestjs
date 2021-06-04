import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
const path = require('path');

@Injectable()
export class MailService {

    constructor(private _mailerService: MailerService){}

    async sendResult(data: any){
        await this._mailerService.sendMail({
            to: data.email,
            subject: 'Test notificación Maxillaris',
            template: './test',
            context: {
                name: data.name
            },
            attachments: [
                /*{
                    filename: 'header2.png',
                    path: path.join(__dirname, '../../../assets/img/header2.png'),
                    cid: 'header'
                },
                {
                    filename: 'icon-link.png',
                    path: path.join(__dirname, '../../../assets/img/icon-link.png'),
                    cid: 'icon-link'
                }*/
            ],
        })
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log("Error mail ",err);
        });
    }

    async sendReservation(data: any){
        let subject: string;
        var template = 'reservation'
        data.message=null
        if(data.template === 'R'){//Reservación
            subject= '[Maxillaris] Tienes una cita reservada';
            data.message = 'reservada';
        }else if(data.template === 'R2H'){//Recordatorio 2 horas
            subject= '[Maxillaris] Tienes una cita en 2 horas';
            template ='reservation_2h';
        }else if(data.template === 'C'){//Confirmación
            subject= '[Maxillaris] Confirmación de cita reservada';
            data.message = 'confirmada';
        }
        await this._mailerService.sendMail({
            to: data.email,
            subject,
            template: './'+template,
            context: {
                data
            },
            attachments: [
                {
                    filename: 'header2.png',
                    path: path.join(__dirname, '../../../assets/img/maxillaris.png'),
                    cid: 'header'
                }
            ],
        })
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log("Error mail ",err);
        });
    }

    async sendReservation24(data: any){
        await this._mailerService.sendMail({
            to: data.email,
            subject: `${data.name}, mañana tenemos una cita pendiente`,
            template: './reservation_24',
            context: {
                data
            },
            attachments: [
                {
                    filename: 'header2.png',
                    path: path.join(__dirname, '../../../assets/img/maxillaris.png'),
                    cid: 'header'
                }
            ],
        })
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log("Error mail ",err);
        });
    }

    async sendReservation2H(data: any){
        await this._mailerService.sendMail({
            to: data.email,
            subject: `${data.name}, tenemos una cita pendiente en dos horas`,
            template: './reservation_2h',
            context: {
                data
            },
            attachments: [
                {
                    filename: 'header2.png',
                    path: path.join(__dirname, '../../../assets/img/maxillaris.png'),
                    cid: 'header'
                }
            ],
        })
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log("Error mail ",err);
        });
    }
}