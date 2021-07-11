//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

export class Pdf_of{

    print(data: any){
        //console.log("Data reporte ",data.detail[0]);
        const pdf = new FPDF('P','mm','A4');
        let y: number = 50;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Cotizacion Ortopedia funcional - '+data.id);
        pdf.SetFillColor(200,200,200);

        pdf.Image('assets/img/membrete.jpg',0,0,211,298,'jpg');

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
        pdf.Cell(20,5,`TRATAMIENTO DE ORTOPEDIA FUNCIONAL DE MAXILARES`,0,0,'L');
        pdf.SetY(y+40);
        pdf.SetX(10);
        var formatter = new Intl.NumberFormat('en-US',{ minimumFractionDigits: 2 });
        pdf.Cell(190,5,`${data.detail[0].coin.code} ${formatter.format(data.detail[0].total)}`,0,0,'R');

        //Condiciones
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+50);
        pdf.SetX(10);
        pdf.Cell(20,5,`INCLUYE:`,0,0,'L');

        let incluye = data.terms.filter(function(inclu: any){
            return inclu.type === 'INCLUYE';
        });
        if(incluye.length){
            incluye.forEach((el: any) => {
                pdf.SetY(y+55);
                pdf.SetX(13);
                pdf.MultiCell(180,5,`${el.description}`);
                //console.log("Tamanio de la cadena ",el.description.length);
                if(el.description.length > 90){
                    y += 10;
                }else{
                    y += 5;
                }
            });
        }

        //Controles
        let control = data.terms.find(function(cont: any){
            return cont.type === 'CONTROL';
        });
        if(control){
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+65);
            pdf.SetX(10);
            pdf.Cell(20,5,`CONTROLES`,0,0,'L');
            pdf.SetY(y+65);
            pdf.SetX(10);
            pdf.Cell(190,5,`${control.description} ${formatter.format(control.amount)}`,0,0,'R');
        }

        let controls = data.terms.filter(function(cont: any){
            return cont.type === 'CONTROLES';
        });
        if(controls.length > 0){
            pdf.SetY(y+70);
            pdf.SetX(13);
            pdf.Cell(20,5,`- Frecuencia de Controles`,0,0,'L');
            pdf.SetFont('Arial','',10);
            controls.forEach((el: any) =>{
                pdf.SetY(y+75);
                pdf.SetX(15);
                pdf.MultiCell(180,5,`${el.description}`,0,'L');
                el.description.length > 110 ? y += 10 : y += 5;
            });
        }

        //Adicional
        let aditional = data.terms.find(function(cont: any){
            return cont.type === 'ADICIONAL';
        });
        if(aditional){
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+90);
            pdf.SetX(10);
            pdf.Cell(20,5,`APARATOLOGÍA ADICIONAL`,0,0,'L');
            pdf.SetY(y+90);
            pdf.SetX(10);
            pdf.Cell(190,5,`${aditional.description}`,0,0,'R');
        }

        let aditionals = data.terms.filter(function(cont: any){
            return cont.type === 'ADICIONALES';
        });
        if(aditionals){
            pdf.SetFont('Arial','',10);
            aditionals.forEach((el: any) =>{
                pdf.SetY(y+100);
                pdf.SetX(13);
                pdf.Cell(20,5,`${el.description}`,0,0,'L');
                pdf.SetY(y+105);
                y += 5;
            });
        }

        //Firma
        pdf.SetY(260);
        pdf.SetX(13);
        pdf.Cell(20,5,`VALIDO POR 30 DÍAS`,0,0,'L');

        pdf.Line(110,(245),180,(245));
        pdf.SetY(250);
        pdf.SetX(100);
        pdf.Cell(90,5,`DR. ${data.doctor.nameQuote.toUpperCase()}`,0,0,'C');
        pdf.SetY(255);
        pdf.SetX(100);
        pdf.Cell(90,5,`COP ${data.doctor.cop}`,0,0,'C');

        pdf.SetFont('Arial','',7);
        pdf.SetY(265);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `quotation-of-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/quotation/${nameFile}`);
        let response = {link: `pdf/quotation/${nameFile}`}
        return response;
    }
}