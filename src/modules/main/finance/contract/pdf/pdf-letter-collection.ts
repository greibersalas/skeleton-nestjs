//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');
import { numberFormat } from 'src/utils/numbers.utils';
import { getDateFormatLong } from '../../../../../utils/date.utils';
import { ContractDetailDto } from '../dto/contract-detail-dto';

/**
 * Reporte contratos
 * cartas de cobranza
 * @date 19-01-2023
 * @author Ing. Greiber Salas <greibersalas@gmail.com>
 */
export class PdfLetterCollection {
    print(data: any, type: string) {
        // Tenemos 5 tipos de carta
        // LP => Carta preventiva
        // LCP => Compromiso de pago
        // LMT => Carta mora temprana
        //console.log({ data });
        const date = moment().format('YYYY-MM-DD');
        const fechaLarga = getDateFormatLong(date);

        const pdf = new FPDF('P', 'mm', 'A4');
        let y: number = 30;
        let x: number = 20;
        pdf.AddPage('P', 'A4');
        pdf.SetTitle('Contrato');
        pdf.SetFillColor(200, 200, 200);

        pdf.Image('assets/img/hoja_membretada.jpg', 0, 0, 211, 298, 'jpg');

        //Titulo
        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y);
        pdf.SetX(x);
        pdf.Cell(175, 5, `${fechaLarga}`, 0, 0, 'R');

        pdf.SetY(y + 10);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Área de Cobranza`);

        pdf.SetFont('Arial', 'B', 11);
        pdf.SetY(y + 20);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Apoderado:`);
        pdf.SetY(y + 25);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Paciente:`);
        pdf.SetY(y + 30);
        pdf.SetX(x);
        pdf.Cell(175, 5, `DNI del Paciente:`);
        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y + 20);
        pdf.SetX(x + 25);
        const attorney = data.attorney ? data.attorney : '';
        pdf.Cell(175, 5, `${attorney}`);
        pdf.SetY(y + 25);
        pdf.SetX(x + 20);
        pdf.Cell(175, 5, `${data.patient}`);
        pdf.SetY(y + 30);
        pdf.SetX(x + 35);
        pdf.Cell(175, 5, `${data.patient_doc}`);

        let asunto = '';
        if (type === 'LP') {
            asunto = 'Carta recordatorio';
        } else if (type === 'LCP' || type === 'LMT') {
            asunto = 'Cobranza Administrativa. Cuota Vencida';
        } else if (type === 'LDV') {
            asunto = 'Carta de Cobranza';
        }
        pdf.SetFont('Arial', 'B', 11);
        pdf.SetY(y + 40);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Asunto:`);
        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y + 40);
        pdf.SetX(x + 16);
        pdf.Cell(175, 5, `${asunto}`);

        pdf.SetY(y + 50);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Cordial saludo`);

        let yLP = y + 60;
        pdf.SetY(y + 60);
        pdf.SetX(x);
        if (type === 'LP') {
            pdf.Cell(175, 5, `La presente es para recordarle que en   `);
            pdf.SetX(x + 85);
            pdf.Cell(175, 5, `vence el pago de su cuota.`);
        } else if (type === 'LCP') {
            pdf.Cell(175, 5, `La presente es para recordarle que mantiene usted un compromiso de pago.`);
        } else if (type === 'LDV') {
            pdf.Cell(175, 5, `La presente es para recordarle que`);
            pdf.SetX(x + 73);
            pdf.Cell(175, 5, `vence el pago de su cuota.`);
            pdf.SetFont('Arial', 'B', 11);
            pdf.SetX(x + 63);
            pdf.Cell(175, 5, `HOY`);
        }

        pdf.SetFont('Arial', 'I', 11);
        pdf.SetY(y + 75);
        pdf.SetX(x);
        pdf.Cell(35, 5, `N°`, 0, 0, 'C');
        pdf.Cell(30, 5, `FECHA`, 0, 0, 'C');
        pdf.Cell(30, 5, `ACUENTA`, 0, 0, 'C');
        pdf.Cell(30, 5, `SALDO`, 0, 0, 'C');
        pdf.Cell(45, 5, `PRESUPUESTO TOTAL`, 0, 0, 'C');

        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y + 80);
        pdf.SetX(x);
        pdf.Cell(35, 5, ``, 0, 0, 'C');
        pdf.Cell(30, 5, ``, 0, 0, 'C', true);
        pdf.Cell(30, 5, ``, 0, 0, 'C', true);
        pdf.Cell(30, 5, ``, 0, 0, 'C', true);
        pdf.Cell(45, 5, `$ ${numberFormat(data.amount)}`, 0, 0, 'R', true);
        pdf.Line(x, y + 80, 190, y + 80);
        y = y + 85;
        const yLineStart = y - 5;
        let bg = false;
        // Detalle de la cobranza
        const { detail } = data;
        let balance = data.amount;
        let textColor = 'BLACK';
        let printDays = 0;
        let printDate = '';
        let printQuotas = 0;
        detail.forEach((el: ContractDetailDto) => {
            let balanceDet = '';
            if (el.balance === 0) {
                balance -= el.amount;
                balanceDet = `$ ${numberFormat(balance)}`;
                textColor = 'BLACK';
            } else {
                if (moment(el.date) < moment()) {
                    balanceDet = 'PENDIENTE';
                    if (type === 'LCP' && printDate === '') {
                        printDate = moment(el.date).format('DD/MM/YYYY');
                    }
                    if (type === 'LMT') {
                        printQuotas++;
                        printDate = moment(el.date).format('DD/MM/YYYY');
                    }
                } else {
                    balanceDet = 'POR VENCER';
                    if (type === 'LP' && printDays === 0) {
                        const now = moment();
                        const dateQuota = moment(el.date);
                        printDays = dateQuota.diff(now, 'days');
                    }
                }
                textColor = 'RED';
            }
            pdf.SetY(y);
            pdf.SetX(x);
            pdf.Cell(35, 5, `${el.description}`, 0, 0, 'C');
            pdf.Cell(30, 5, `${moment(el.date).format('DD/MM/YYYY')}`, 0, 0, 'C', bg);
            pdf.Cell(30, 5, `$ ${numberFormat(el.amount)}`, 0, 0, 'C', bg);

            if (textColor === 'RED') {
                pdf.SetTextColor(194, 8, 8);
                pdf.SetFont('Arial', 'B', 11);
            } else {
                pdf.SetFont('Arial', '', 11);
                pdf.SetTextColor(0, 0, 0);
            }
            pdf.Cell(30, 5, `${balanceDet}`, 0, 0, 'C', bg);
            pdf.SetTextColor(0, 0, 0);
            pdf.Cell(45, 5, ``, 0, 0, 'C', bg);
            pdf.SetFont('Arial', '', 11);
            y += 5;
            bg = !bg;
        });
        const yLineEnd = pdf.GetY() + 5;
        pdf.Line(x + 35, yLineStart, x + 35, yLineEnd);

        pdf.SetFont('Arial', '', 11);
        y = pdf.GetY();
        pdf.SetY(y + 15);
        pdf.SetX(x);
        if (type === 'LP') {
            pdf.Cell(175, 5, `Agradeceremos su pago en la fecha acordada.`);
        } else if (type === 'LCP') {
            pdf.MultiCell(175, 5, `Finalmente, en caso de que a la fecha de recepción de este documento usted ya hubiese cancelado, le ofrecemos nuestras disculpas y pedimos que omita la presente información.`);
        } else if (type === 'LDV') {
            pdf.MultiCell(175, 5, `Esperamos su pago el día de hoy.`);
        } else if (type === 'LMT') {
            pdf.MultiCell(175, 5, `Finalmente, en caso de que a la fecha de recepción de este documento usted ya hubiese cancelado, le ofrecemos nuestras disculpas y pedimos que omita la presente información.`);
            pdf.SetY(y + 10);
            pdf.SetX(x);
            pdf.Cell(175, 5, `La cuota adeudada debió pagase el día `);
            pdf.SetFont('Arial', 'B', 11);
            pdf.SetX(x + 70);
            pdf.Cell(175, 5, `${printDate}`);
            pdf.SetFont('Arial', '', 11);
        }

        // Para el formato carta preventiva
        if (printDays > 0) {
            pdf.SetFont('Arial', 'B', 11);
            pdf.SetY(yLP);
            pdf.SetX(x + 68);
            pdf.Cell(175, 5, `${printDays} días`);
        }
        if (printDate !== '' && type === 'LCP') {
            pdf.SetY(yLP + 5);
            pdf.SetX(x);
            pdf.Cell(175, 5, `para el día ${printDate} ante su cuota(s) vencida(s).`);
        }
        if (printQuotas > 0) {
            pdf.SetY(yLP + 5);
            pdf.SetX(x);
            pdf.Cell(175, 5, `La presente es para recordarle que usted mantiene ${printQuotas} cuota(s) vencida(s):`);
        }

        if (type !== 'LP') {
            pdf.Image('assets/img/firma_jhon_castillo.jpg', x - 5, 205, 40, 30, 'jpg');
            pdf.SetY(200);
            pdf.SetX(x);
            pdf.Cell(175, 5, `Atentamente,`);
            pdf.SetY(215);
            pdf.SetX(x);
            pdf.Cell(40, 5, `Atte.`, 0, 0, 'C');
            pdf.SetY(225);
            pdf.SetX(x);
            pdf.Cell(40, 5, `John Castillo`, 0, 0, 'C');
            pdf.SetY(230);
            pdf.SetX(x);
            pdf.Cell(40, 5, `Área de Cobranzas`, 0, 0, 'C');
            pdf.Image('assets/img/sello_cobranza.jpg', 70, 200, 30, 28, 'jpg');
            pdf.Image('assets/img/sello_legal.jpg', 100, 200, 30, 30, 'jpg');
        }

        pdf.SetFont('Arial', 'B', 8);
        pdf.SetY(245);
        pdf.SetX(x);
        pdf.SetTextColor(194, 8, 8);
        pdf.Cell(175, 5, `Importante:`);
        pdf.SetFont('Arial', '', 8);
        pdf.SetY(250);
        pdf.SetX(x + 10);
        pdf.SetTextColor(0, 0, 0);
        pdf.MultiCell(165, 5, `* Estimado cliente se le recuerda que si no está al día en sus pagos se procederá con el cobro de intereses moratorios y/o con reportarlo en las centrales de riesgo.`);
        pdf.SetY(260);
        pdf.SetX(x + 10);
        pdf.MultiCell(165, 5, `* Si cuenta con cuotas pendientes de pago, no podrá ser atendido en sus futuros controles.`);

        const nameFile: string = `letter-${type}-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F', `uploads/contract/pdf/${nameFile}`);
        let response = { link: `contract/pdf/${nameFile}` };
        return response;
    }
}