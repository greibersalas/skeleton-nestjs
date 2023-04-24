//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

/**
 * Reporte contratos
 * Contratos niños
 * @date 04-12-2022
 * @author Ing. Greiber Salas <greibersalas@gmail.com>
 */
export class PdfContractChildren {
    print(data: any) {

        const pdf = new FPDF('P', 'mm', 'A4');
        let y: number = 20;
        pdf.AddPage('P', 'A4');
        pdf.SetTitle('Contrato');
        pdf.SetFillColor(200, 200, 200);

        pdf.Image('assets/img/hoja_membretada.jpg', 0, 0, 211, 298, 'jpg');

        //Titulo
        const title = `CONTRATO DE TRATAMIENTO ODONTOLOGICO  NRO: ${data.num}- OFM/${moment(data.date).format('YYYY')}/${moment(data.date).format('MM')}/${moment(data.date).format('DD')}`;
        pdf.SetFont('Arial', 'B', 11);
        pdf.SetY(y + 20);
        pdf.SetX(5);
        pdf.Cell(200, 5, `${title}`, 0, 0, 'C');

        pdf.SetFont('Arial', '', 11);
        pdf.SetY(y + 30);
        pdf.SetX(10);
        pdf.MultiCell(190, 5, `Conste por el presente documento el Contrato de Tratamiento Odontológico que celebran de una parte: `);

        const part1 = `El Sr (a) SALAZAR CANGALAYA ROSALIA MAXIMINA, identificado con DNI No. 10104367, con domicilio en JR 11 JUNIO MZ Ñ2 LT 6D, SAN ANTONIO - HUAROCHIRI, con número telefónico 940561237 y correo electrónico shey_14@outlook.es en adelante denominada “EL CONTRATANTE”, quien contrata el servicio de tratamiento odontológico en nombre de ODONTOLOGIA FUNCIONAL E.I.R.L , para ${data.patient} de 10 años (mayor de edad), quien adelante se denominara EL PACIENTE.  `;
        pdf.SetY(y + 40);
        pdf.SetX(10);
        pdf.Text(190, 5, `${part1}`);

        pdf.SetFont('Arial', '', 7);
        pdf.SetY(267);
        pdf.SetX(10);
        pdf.Cell(190, 5, `Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`, 0, 0, 'L');
        pdf.SetY(270);
        pdf.Cell(190, 5, `Usuario: `, 0, 0, 'L');

        const nameFile: string = `contrato-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F', `uploads/contract/pdf/${nameFile}`);
        let response = { link: `contract/pdf/${nameFile}` };
        return response;
    }
}