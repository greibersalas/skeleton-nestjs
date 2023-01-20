//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');
import { getDateFormatLong } from '../../../../../utils/date.utils';

/**
 * Reporte contratos
 * carta preventiva
 * @date 19-01-2023
 * @author Ing. Greiber Salas <greibersalas@gmail.com>
 */
export class PdfLetterPreventiva {
    print(data: any) {
        console.log({ data });
        const date = moment().format('YYYY-MM-DD');
        const fechaLarga = getDateFormatLong(date);

        const pdf = new FPDF('P', 'mm', 'A4');
        let y: number = 40;
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
        pdf.SetY(y + 30);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Apoderado:`);
        pdf.SetY(y + 40);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Paciente:`);
        pdf.SetY(y + 50);
        pdf.SetX(x);
        pdf.Cell(175, 5, `DNI del Paciente:`);
        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y + 30);
        pdf.SetX(x + 25);
        pdf.Cell(175, 5, `...`);
        pdf.SetY(y + 40);
        pdf.SetX(x + 20);
        pdf.Cell(175, 5, `${data.patient}`);
        pdf.SetY(y + 50);
        pdf.SetX(x + 35);
        pdf.Cell(175, 5, `${data.patient_doc}`);

        pdf.SetY(y + 70);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Asunto:`);

        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y + 80);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Cordial saludo`);
        pdf.SetY(y + 90);
        pdf.SetX(x);
        pdf.Cell(175, 5, `La presente es para recordarle que en   `);
        pdf.SetX(x + 80);
        pdf.Cell(175, 5, `vence el pago de su cuota.`);

        pdf.SetFont('Arial', 'I', 11);
        pdf.SetY(y + 100);
        pdf.SetX(x);
        pdf.Cell(35, 5, `N°`, 0, 0, 'C');
        pdf.Cell(30, 5, `FECHA`, 0, 0, 'C');
        pdf.Cell(30, 5, `ACUENTA`, 0, 0, 'C');
        pdf.Cell(30, 5, `SALDO`, 0, 0, 'C');
        pdf.Cell(45, 5, `PRESUPUESTO TOTAL`, 0, 0, 'C');


        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y + 105);
        pdf.SetX(x);
        pdf.Cell(35, 5, ``, 0, 0, 'C');
        pdf.Cell(30, 5, ``, 0, 0, 'C', true);
        pdf.Cell(30, 5, ``, 0, 0, 'C', true);
        pdf.Cell(30, 5, ``, 0, 0, 'C', true);
        pdf.Cell(45, 5, `$ 2,971.97`, 0, 0, 'R', true);
        pdf.Line(x, y + 105, 190, y + 105);
        const items = 12;
        y = y + 110;
        const yLineStart = y - 5;
        let bg = false;
        for (let index = 0; index < items; index++) {
            pdf.SetY(y);
            pdf.SetX(x);
            pdf.Cell(35, 5, `Cuota ${index + 1}`, 0, 0, 'C');
            pdf.Cell(30, 5, `14/11/2022`, 0, 0, 'C', bg);
            pdf.Cell(30, 5, `$ 100.00`, 0, 0, 'C', bg);
            pdf.Cell(30, 5, `$ 2,871.97`, 0, 0, 'C', bg);
            pdf.Cell(45, 5, ``, 0, 0, 'C', bg);
            y += 5;
            bg = !bg;
        }
        const yLineEnd = pdf.GetY() + 5;
        pdf.Line(x + 35, yLineStart, x + 35, yLineEnd);

        y = pdf.GetY();
        pdf.SetY(y + 15);
        pdf.SetX(x);
        pdf.Cell(175, 5, `Agradeceremos su pago en la fecha acordada.`);

        pdf.SetFont('Arial', 'B', 8);
        pdf.SetY(245);
        pdf.SetX(x);
        pdf.SetTextColor(194, 8, 8);
        pdf.Cell(175, 5, `Importante:`);
        pdf.SetY(250);
        pdf.SetX(x + 10);
        pdf.SetTextColor(0, 0, 0);
        pdf.MultiCell(165, 5, `* Estimado cliente se le recuerda que si no está al día en sus pagos se procederá con el cobro de intereses moratorios y/o con reportarlo en las centrales de riesgo.`);
        pdf.SetY(260);
        pdf.SetX(x + 10);
        pdf.MultiCell(165, 5, `* Si cuenta con cuotas pendientes de pago, no podrá ser atendido en sus futuros controles.`);

        const nameFile: string = `carta-preventiva-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F', `uploads/contract/pdf/${nameFile}`);
        let response = { link: `contract/pdf/${nameFile}` };
        return response;
    }
}