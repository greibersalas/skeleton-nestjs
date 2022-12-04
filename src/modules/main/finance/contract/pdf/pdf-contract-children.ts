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
        let y: number = 10;
        pdf.AddPage('P', 'A4');
        pdf.SetTitle('Contrato');
        pdf.SetFillColor(200, 200, 200);

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