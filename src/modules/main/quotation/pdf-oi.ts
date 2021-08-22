//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

import { QuotationDetail } from "./quotation-detail.entity";
export class Pdf_oi{

    print(data: any){
        //console.log("Data reporte ",data);
        const pdf = new FPDF('P','mm','A4');
        var y: number = 50;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Cotizacion Odontologia Integral - '+data.id);
        pdf.SetFillColor(200,200,200);

        pdf.Image('assets/img/membrete.jpg',0,0,211,298,'jpg');

        //fecha
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment(data.date).tz('America/Lima').format('DD-MM-YYYY')}`,0,0,'R');

        //Titulo
        pdf.SetFont('Arial','B',14);
        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(200,5,`PRESUPUESTO ODONTOLOGÍCO ${data.id}`,0,0,'C');

        //Datos del paciente
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+50);
        pdf.SetX(10);
        pdf.Cell(20,5,`PACIENTE:`,0,0,'L');
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+50);
        pdf.SetX(30);
        pdf.Cell(100,5,`${data.clinicHistory.name} ${data.clinicHistory.lastNameFather} ${data.clinicHistory.lastNameMother}`,0,0,'L');
        pdf.SetY(y+50);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment().tz('America/Lima').diff(data.clinicHistory.birthdate,'years')} años`,0,0,'R');

        //Linea
        pdf.Line(10,(y+55),200,(y+55));

        //Valores
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+65);
        pdf.SetX(10);
        pdf.Cell(20,5,`TRATAMIENTO DE ODONTOLOGÍA INTEGRAL`,0,0,'L');

        //Detalle
        pdf.SetFont('Arial','',10);
        var total_sol: number = 0;
        var total_usd: number = 0;
        var formatter = new Intl.NumberFormat('en-US',{ minimumFractionDigits: 2 });
        data.detail.forEach( (it: QuotationDetail) => {
            if(it.coin.id === 1){
                pdf.SetY(y+75);
                pdf.SetX(10);
                pdf.Cell(20,5,`${it.quantity} ${it.tariff.name}`,0,0,'L');

                pdf.SetY(y+75);
                pdf.SetX(10);
                pdf.Cell(190,5,`${it.coin.code} ${formatter.format(it.total)}`,0,0,'R');
                total_sol += it.total;
                y += 5;
            }
        });

        //Total
        if(total_sol > 0){
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+80);
            pdf.SetX(10);
            pdf.Cell(20,5,`PRESUPUESTO TOTAL`,0,0,'L');
            pdf.SetY(y+80);
            pdf.SetX(10);
            pdf.Cell(190,5,`S/ ${formatter.format(total_sol)}`,0,0,'R');
            y += 25
        }

        pdf.SetFont('Arial','',10);
        data.detail.forEach( (it: QuotationDetail) => {
            if(it.coin.id === 2){
                pdf.SetY(y+75);
                pdf.SetX(10);
                pdf.Cell(20,5,`${it.quantity} ${it.tariff.name}`,0,0,'L');

                pdf.SetY(y+75);
                pdf.SetX(10);
                pdf.Cell(190,5,`${it.coin.code} ${formatter.format(it.total)}`,0,0,'R');
                total_usd += it.total
                y += 5;
            }
        });

        if(total_usd > 0){
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+80);
            pdf.SetX(10);
            pdf.Cell(20,5,`PRESUPUESTO TOTAL`,0,0,'L');
            pdf.SetY(y+80);
            pdf.SetX(10);
            pdf.Cell(190,5,`$ ${formatter.format(total_usd)}`,0,0,'R');
        }
        pdf.Line(130,240,180,240);
        pdf.SetFont('Arial','',9);
        pdf.SetY(240);
        pdf.SetX(130);
        pdf.Cell(50,5,`Dr(a). ${data.doctor.nameQuote}`,0,0,'C');
        if(data.doctor.cop > 0){
            pdf.SetY(243);
            pdf.SetX(130);
            pdf.Cell(50,5,`COP: ${data.doctor.cop}`,0,0,'C');
        }
        pdf.SetFont('Arial','',10);
        pdf.SetY(250);
        pdf.SetX(10);
        pdf.Cell(15,5,`VALIDO POR 30 DÍAS`);

        pdf.SetFont('Arial','',7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `quotation-oi-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/quotation/${nameFile}`);
        let response = {link: `pdf/quotation/${nameFile}`}
        return response;
    }
}