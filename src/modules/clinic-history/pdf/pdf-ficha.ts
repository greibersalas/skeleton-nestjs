//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

export class Pdf_ficha{

    print(data: any){
        const { patient } = data;
        const pdf = new FPDF('P','mm','A4');
        let y: number = 70;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Ficha de evaluacion - '+patient.id);
        pdf.SetFillColor(200,200,200);

        //pdf.Image('assets/img/logo.jpg',10,10,60,20,'jpg');
        pdf.Image('assets/img/hoja_membretada_maxillaris_1.jpg',0,0,211,298,'jpg');

        pdf.SetFont('Arial','B',16);
        pdf.SetY(30);
        pdf.SetX(10);
        //pdf.Cell(95,20,'',1);
        pdf.Cell(190,20,'Ficha de Datos',0,0,'C');

        pdf.SetFont('Arial','',12);
        pdf.SetY(y-10);
        pdf.SetX(10);
        pdf.Cell(95,5,`Nro. Historia Clinica: ${patient.history}`);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(95,5,`FECHA: ${moment().tz('America/Lima').format('DD/MM/YYYY')}`);
        pdf.Cell(95,5,`DR. TTE.:`,0,0,'R');

        pdf.SetFont('Arial','',10);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(40,5,`Nombre y apellidos: `,0,0,'R');
        pdf.Cell(40,5,`${patient.name} ${patient.lastNameFather} ${patient.lastNameMother}`);

        pdf.SetY(y+15);
        pdf.SetX(10);
        pdf.Cell(40,5,`Edad: `,0,0,'R');
        pdf.Cell(40,5,`${moment().diff(patient.birthdate,'years')} año(s)`);

        pdf.SetY(y+15);
        pdf.SetX(90);
        pdf.Cell(40,5,`Fecha de Nacimiento: ${moment(patient.birthdate).format("DD/MM/YYYY")}`,0,0,'R');

        pdf.SetY(y+20);
        pdf.SetX(10);
        pdf.Cell(40,5,`Apoderado`,0,0,'R');

        pdf.SetY(y+25);
        pdf.SetX(10);
        pdf.Cell(40,5,`Lugar de procedencia`,0,0,'R');

        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(40,5,`Dirección`,0,0,'R');
        pdf.Cell(40,5,`${patient.address}`);

        pdf.SetY(y+35);
        pdf.SetX(10);
        pdf.Cell(40,5,`Distrito`,0,0,'R');
        pdf.Cell(40,5,`${patient.distrito}`);

        pdf.SetY(y+40);
        pdf.SetX(10);
        pdf.Cell(40,5,`E-Mail`,0,0,'R');
        pdf.Cell(40,5,`${patient.email}`);

        pdf.SetY(y+45);
        pdf.SetX(10);
        pdf.Cell(40,5,`Centro de Trabajo`,0,0,'R');

        pdf.SetY(y+50);
        pdf.SetX(10);
        pdf.Cell(40,5,`Centro de Estudios`,0,0,'R');

        pdf.SetY(y+55);
        pdf.SetX(10);
        pdf.Cell(40,5,`Recomendado por`,0,0,'R');

        pdf.SetY(y+60);
        pdf.SetX(10);
        pdf.Cell(40,5,`Cía. de Seguros`,0,0,'R');

        pdf.SetY(y+65);
        pdf.SetX(10);
        pdf.Cell(40,5,`Póliza`,0,0,'R');

        pdf.SetY(y+70);
        pdf.SetX(10);
        pdf.Cell(40,5,`Bancos con los que trabaja`,0,0,'R');

        pdf.SetY(y+75);
        pdf.SetX(10);
        pdf.Cell(40,5,`Tarjetas de Crédito`,0,0,'R');

        pdf.SetY(y+80);
        pdf.SetX(10);
        pdf.Cell(40,5,`Dentistas que le atendieron anteriormente y tratamientos realizados`);

        pdf.SetFont('Arial','B',12);
        pdf.SetY(y+120);
        pdf.SetX(10);
        pdf.Cell(40,5,`PARA CASOS DE EMERGENCIA DAR LOS SIGUIENTES DATOS`);

        let medico: string = '';
        if(patient.medico_confianza){
            medico = `${patient.medico_confianza} ${patient.medico_confianza_telefono}`;
        }
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+125);
        pdf.SetX(10);
        pdf.Cell(40,5,`Médico de confianza: ${medico}`);

        pdf.SetY(y+130);
        pdf.SetX(10);
        pdf.Cell(40,5,`Servicio de Ambulancia`);

        let contacto: string = '';
        if(patient.contacto){
            contacto = `${patient.contacto} - ${patient.contacto_telefono}`;
        }
        pdf.SetY(y+135);
        pdf.SetX(10);
        pdf.Cell(40,5,`En caso de emergencia contactar ${contacto}`);


        pdf.SetFont('Arial','',7);
        pdf.SetY(250);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `ficha-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/clinichistory/${nameFile}`);
        let response = {link: `pdf/clinichistory/${nameFile}`}
        return response;
    }
}