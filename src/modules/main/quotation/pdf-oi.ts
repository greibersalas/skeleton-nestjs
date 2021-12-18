//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

import { QuotationDetail } from "./quotation-detail.entity";
export class Pdf_oi{

    print(data: any){
        const {
            id,
            date,
            clinicHistory,
            detail,
            odontograma
        } = data;
        const pdf = new FPDF('P','mm','A4');
        var y: number = 50;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Cotizacion Odontologia Integral - '+id);
        pdf.SetFillColor(200,200,200);

        pdf.Image('assets/img/membrete.jpg',0,0,211,298,'jpg');

        //fecha
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment(date).tz('America/Lima').format('DD-MM-YYYY')}`,0,0,'R');

        //Titulo
        pdf.SetFont('Arial','B',14);
        pdf.SetY(y+10);
        pdf.SetX(30);
        pdf.Cell(100,5,`PRESUPUESTO ODONTOLOGÍCO ${id}`,0,0,'L');

        //Datos del paciente
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(20,5,`PACIENTE:`,0,0,'L');
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+30);
        pdf.SetX(30);
        pdf.Cell(100,5,`${clinicHistory.name} ${clinicHistory.lastNameFather} ${clinicHistory.lastNameMother}`,0,0,'L');
        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment().tz('America/Lima').diff(clinicHistory.birthdate,'years')} años`,0,0,'R');

        //Linea
        pdf.Line(10,(y+35),200,(y+35));

        //Valores
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+40);
        pdf.SetX(10);
        pdf.Cell(20,5,`TRATAMIENTO DE ODONTOLOGÍA INTEGRAL`,0,0,'L');

        //Detalle
        pdf.SetFont('Arial','',10);
        var total_sol: number = 0;
        var total_usd: number = 0;
        var formatter = new Intl.NumberFormat('en-US',{ minimumFractionDigits: 2 });
        detail.forEach( (it: QuotationDetail) => {
            if(it.coin.id === 1){
                pdf.SetY(y+50);
                pdf.SetX(10);
                pdf.Cell(20,5,`${it.quantity} ${it.tariff.name}`,0,0,'L');

                pdf.SetY(y+50);
                pdf.SetX(10);
                pdf.Cell(190,5,`${it.coin.code} ${formatter.format(it.total)}`,0,0,'R');
                total_sol += it.total;
                y += 5;
            }
        });

        //Total
        if(total_sol > 0){
            pdf.Line(10,(y+55),200,(y+55));
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+55);
            pdf.SetX(10);
            pdf.Cell(20,5,`PRESUPUESTO TOTAL S/`,0,0,'L');
            pdf.SetY(y+55);
            pdf.SetX(10);
            pdf.Cell(190,5,`S/ ${formatter.format(total_sol)}`,0,0,'R');
            y += 25
        }

        pdf.SetFont('Arial','',10);
        data.detail.forEach( (it: QuotationDetail) => {
            if(it.coin.id === 2){
                pdf.SetY(y+40);
                pdf.SetX(10);
                pdf.Cell(20,5,`${it.quantity} ${it.tariff.name}`,0,0,'L');

                pdf.SetY(y+40);
                pdf.SetX(10);
                pdf.Cell(190,5,`${it.coin.code} ${formatter.format(it.total)}`,0,0,'R');
                total_usd += it.total
                y += 5;
            }
        });

        if(total_usd > 0){
            pdf.Line(10,(y+45),200,(y+45));
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+45);
            pdf.SetX(10);
            pdf.Cell(20,5,`PRESUPUESTO TOTAL $`,0,0,'L');
            pdf.SetY(y+45);
            pdf.SetX(10);
            pdf.Cell(190,5,`$ ${formatter.format(total_usd)}`,0,0,'R');
        }

        /** Odontograma */
        if(odontograma){
            const { name } = odontograma;
            const odonto = JSON.parse(name);

            pdf.Line(20,(y+125),190,(y+125));
            pdf.Line(100,(y+100),100,(y+150));

            /** teeth 1 and 2 */
            const teeth1 = odonto[0].teeth.reverse();
            let x = 15;
            pdf.SetFont('Arial','',8);
            teeth1.map( (tee: any) => {
                pdf.SetY(y+90);
                pdf.SetX(x);
                pdf.Cell(5,5,`1${tee.id}`,0,0,'C',0);
                pdf.SetY(y+100);
                pdf.SetX(x);
                pdf.Cell(5,5,'',1,0,'C',1);
                x+=10;
            });

            const teeth2 = odonto[1].teeth;
            x = 110;
            teeth2.map( (tee: any) => {
                pdf.SetY(y+90);
                pdf.SetX(x);
                pdf.Cell(5,5,`2${tee.id}`,0,0,'C',0);
                pdf.SetY(y+100);
                pdf.SetX(x);
                pdf.Cell(5,5,'',1,0,'C',1);
                x+=10;
            });

            /** teeth 5 and 6 */
            const teeth5 = odonto[4].teeth.reverse();
            x = 46;
            teeth5.map( (tee: any) => {
                pdf.SetY(y+110);
                pdf.SetX(x);
                pdf.Cell(3,3,`5${tee.id}`,0,0,'C',0);
                pdf.SetY(y+115);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                x+=10;
            });

            const teeth6 = odonto[5].teeth;
            x = 111;
            teeth6.map( (tee: any) => {
                pdf.SetY(y+110);
                pdf.SetX(x);
                pdf.Cell(3,3,`6${tee.id}`,0,0,'C',0);
                pdf.SetY(y+115);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                x+=10;
            });

            /** teeth 8 and 7 */
            const teeth8 = odonto[7].teeth.reverse();
            x = 46;
            teeth5.map( (tee: any) => {
                pdf.SetY(y+130);
                pdf.SetX(x);
                pdf.Cell(3,3,`8${tee.id}`,0,0,'C',0);
                pdf.SetY(y+135);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                x+=10;
            });

            const teeth7 = odonto[6].teeth;
            x = 111;
            teeth7.map( (tee: any) => {
                pdf.SetY(y+130);
                pdf.SetX(x);
                pdf.Cell(3,3,`7${tee.id}`,0,0,'C',0);
                pdf.SetY(y+135);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                x+=10;
            });

            /** teeth 4 and 3 */
            const teeth4 = odonto[3].teeth.reverse();
            x = 15;
            pdf.SetFont('Arial','',8);
            teeth4.map( (tee: any) => {
                pdf.SetY(y+140);
                pdf.SetX(x);
                pdf.Cell(5,5,`1${tee.id}`,0,0,'C',0);
                pdf.SetY(y+145);
                pdf.SetX(x);
                pdf.Cell(5,5,'',1,0,'C',1);
                x+=10;
            });

            const teeth3 = odonto[2].teeth;
            x = 110;
            teeth3.map( (tee: any) => {
                pdf.SetY(y+140);
                pdf.SetX(x);
                pdf.Cell(5,5,`2${tee.id}`,0,0,'C',0);
                pdf.SetY(y+145);
                pdf.SetX(x);
                pdf.Cell(5,5,'',1,0,'C',1);
                x+=10;
            });
        }
        /** Fin odontograma */
        pdf.Line(130,250,180,250);
        pdf.SetFont('Arial','',9);
        pdf.SetY(250);
        pdf.SetX(130);
        pdf.Cell(50,5,`Dr(a). ${data.doctor.nameQuote}`,0,0,'C');
        if(data.doctor.cop > 0){
            pdf.SetY(253);
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