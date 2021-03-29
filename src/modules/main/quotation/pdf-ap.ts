//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

export class Pdf_ap{

    print(data: any){
        //console.log("Data reporte ",data.detail[0]);
        const pdf = new FPDF('P','mm','A4');
        const y: number = 10;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Cotizacion Apnea - '+data.id);
        pdf.SetFillColor(200,200,200);

        //fecha
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment(data.date).tz('America/Lima').format('DD-MM-YYYY')}`,0,0,'R');

        //Titulo
        pdf.SetFont('Arial','B',12);
        pdf.SetY(y+20);
        pdf.SetX(10);
        pdf.Cell(200,5,`PRESUPUESTO ODONTOLOGÍCO ${data.id}`,0,0,'C');

        //Datos del paciente
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(20,5,`PACIENTE:`,0,0,'L');
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+30);
        pdf.SetX(30);
        pdf.Cell(100,5,`${data.clinicHistory.name} ${data.clinicHistory.lastNameFather} ${data.clinicHistory.lastNameMother}`,0,0,'L');
        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment().tz('America/Lima').diff(data.clinicHistory.birthdate,'years')} años`,0,0,'R');

        //Linea
        pdf.Line(10,(y+35),200,(y+35));

        //Valores
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+40);
        pdf.SetX(10);
        pdf.Cell(20,5,`TRATAMIENTO DE APNEA DE MAXILARES`,0,0,'L');
        pdf.SetY(y+40);
        pdf.SetX(10);
        var formatter = new Intl.NumberFormat('en-US',{ minimumFractionDigits: 2 });
        pdf.Cell(190,5,`${data.detail[0].coin.code} ${formatter.format(data.detail[0].total)}`,0,0,'R');

        //Condiciones
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+50);
        pdf.SetX(10);
        pdf.Cell(20,5,`INCLUYE:`,0,0,'L');

        pdf.SetY(y+55);
        pdf.SetX(13);
        pdf.Cell(20,5,`- 1 DISPOSITIVO DE AVANCE MANDIBULAR (DAM)`,0,0,'L');
        pdf.SetY(y+60);
        pdf.SetX(13);
        pdf.Cell(20,5,`- MANTENIMIENTO PERIÓDICO DE APARATO POR 2 AÑOS`,0,0,'L');
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+65);
        pdf.SetX(13);
        pdf.Cell(20,5,`- CONTROLES QUINCENALES DURANTE 4 – 6 MESES , 2 EXAMENES DE SUEÑO SIMPLIFICADO`,0,0,'L');

        //Controles
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+75);
        pdf.SetX(10);
        pdf.Cell(20,5,`CONTROLES`,0,0,'L');

        pdf.SetY(y+80);
        pdf.SetX(13);
        pdf.Cell(20,5,`- Frecuencia de Controles`,0,0,'L');
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+85);
        pdf.SetX(15);
        pdf.MultiCell(190,5,`Cada 3 a 6 semanas según Indicación del especialista. En caso de daño o ruptura del aparato por mal uso o descuido, el costo por reparación es de S/.60`);

        //Adicional
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+95);
        pdf.SetX(10);
        pdf.Cell(20,5,`APARATOLOGÍA ADICIONAL`,0,0,'L');
        pdf.SetY(y+95);
        pdf.SetX(10);
        pdf.Cell(190,5,`$ 100.00 dólares`,0,0,'R');

        pdf.SetFont('Arial','',10);
        pdf.SetY(y+100);
        pdf.SetX(13);
        pdf.Cell(20,5,`- En caso de necesitar aparatología adicional a los que ya cubre su presupuesto`,0,0,'L');
        pdf.SetY(y+105);
        pdf.SetX(13);
        pdf.Cell(20,5,`- En caso de pérdida del aparato con microchip, el costo Sólo del dispositivo microchip es de $100 dólares.`,0,0,'L');

        //Firma
        pdf.SetY(y+200);
        pdf.SetX(13);
        pdf.Cell(20,5,`VALIDO POR 30 DÍAS`,0,0,'L');

        pdf.Line(110,(y+195),180,(y+195));
        pdf.SetY(y+200);
        pdf.SetX(100);
        pdf.Cell(90,5,`DR. ${data.doctor.nameQuote.toUpperCase()}`,0,0,'C');
        pdf.SetY(y+205);
        pdf.SetX(100);
        pdf.Cell(90,5,`COP 22000`,0,0,'C');

        pdf.SetFont('Arial','',7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `quotation-of-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/quotation/${nameFile}`);
        let response = {link: `pdf/quotation/${nameFile}`}
        return response;
    }
}