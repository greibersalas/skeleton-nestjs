//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

export class Pdf_frequent_patients{

    print(data: any){
        const pdf = new FPDF('P','mm','A4');
        let y: number = 40;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Reporte - Pacientes frecuentes');
        pdf.SetFillColor(200,200,200);

        //pdf.Image('assets/img/logo.jpg',10,10,60,20,'jpg');
        pdf.Image('assets/img/hoja_membretada_maxillaris_1.jpg',0,0,210,297,'jpg');

        pdf.SetFont('Arial','B',16);
        pdf.SetY(13);
        pdf.SetX(105);
        pdf.Cell(60,20,'Reporte clientes frecuentes');

        pdf.SetFont('Arial','',9);
        pdf.SetY(18);
        pdf.SetX(105);
        pdf.Cell(60,20,'Pacientes con ultima cita no mayor a 1 año');

        pdf.SetTextColor(255,255,255);
        pdf.SetFont('Arial','B',8);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(80,4,'Nombre',1,0,'C',1);
        pdf.Cell(30,4,'Nro. Documento',1,0,'C',1);
        pdf.Cell(30,4,'Nro. Historia',1,0,'C',1);
        pdf.Cell(20,4,'Edad',1,0,'C',1);
        pdf.Cell(20,4,'Teléfono',1,0,'C',1);

        pdf.SetTextColor(0,0,0);
        data.map((el: any) => {
            pdf.SetFont('Arial','',8);
            pdf.SetY(y+4);
            pdf.SetX(10);
            pdf.Cell(80,4,`${el.name} ${el.lastnamefather} ${el.lastnamemother}`.toUpperCase(),1,0,'L',0);
            pdf.Cell(30,4,`${el.num_document}`,1,0,'R',0);
            pdf.Cell(30,4,`${el.history}`,1,0,'R',0);
            pdf.Cell(20,4,`${moment().diff(el.birthdate,'years') ? moment().diff(el.birthdate,'years') : ''} año(s)`,1,0,'R',0);
            pdf.Cell(20,4,`${el.cellphone}`,1,0,'R',0);
            y += 4;
        });

        pdf.SetFont('Arial','',7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `frequent-patients-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/report_${nameFile}`);
        let response = {link: `pdf/report_${nameFile}`}
        return response;
    }

}