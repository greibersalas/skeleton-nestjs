//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

export class Pdf_ficha{

    print(data: any){
        const { patient, doctors } = data;
        const pdf = new FPDF('P','mm','A4');
        let y: number = 40;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Ficha de evaluacion - '+patient.id);
        pdf.SetFillColor(200,200,200);

        //pdf.Image('assets/img/logo.jpg',10,10,60,20,'jpg');
        pdf.Image('assets/img/hoja_membretada_maxillaris_1.jpg',0,0,210,297,'jpg');

        pdf.SetFont('Arial','',8);
        pdf.SetY(10);
        pdf.SetX(160);
        pdf.Cell(40,5,`Fecha Creación`,0,0,'R');
        pdf.SetY(13);
        pdf.SetX(160);
        pdf.Cell(40,5,`${moment(patient.date).tz('America/Lima').format('DD/MM/YYYY')}`,0,0,'R');

        pdf.SetFont('Arial','B',16);
        pdf.SetY(13);
        pdf.SetX(105);
        pdf.Cell(60,20,'Ficha de Datos');

        pdf.SetFont('Arial','B',10);
        pdf.SetY(19);
        pdf.SetX(170);
        pdf.Cell(30,6,`${patient.history}`,1,0,'C');
        pdf.SetFont('Arial','',8);
        pdf.SetY(25);
        pdf.SetX(170);
        pdf.Cell(30,5,`N° HIST. CLINICA`,0,0,'C');

        pdf.SetFont('Arial','',12);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(45,5,`FECHA: `);
        pdf.SetFont('Arial','B',12);
        pdf.SetY(y);
        pdf.SetX(27);
        pdf.Cell(45,5,`${moment().tz('America/Lima').format('DD/MM/YYYY')}`);

        pdf.Line(10,y+5,200,y+5);

        pdf.SetFont('Arial','',9);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(40,5,`Nombre y apellidos: `,0,0,'R');
        pdf.Cell(150,5,`DNI/CI/PASAPORTE: ${patient.documentNumber}`,0,0,'R');
        pdf.SetFont('Arial','B',9);
        pdf.SetY(y+10);
        pdf.SetX(50);
        pdf.Cell(40,5,`${patient.name} ${patient.lastNameFather} ${patient.lastNameMother}`);

        pdf.SetFont('Arial','',9);
        pdf.SetY(y+15);
        pdf.SetX(10);
        pdf.Cell(40,5,`Edad: `,0,0,'R');
        pdf.Cell(40,5,`${moment().diff(patient.birthdate,'years') ? moment().diff(patient.birthdate,'years') : ''} año(s)`);

        pdf.SetY(y+15);
        pdf.SetX(90);
        pdf.Cell(40,5,`Fecha de Nacimiento: ${patient.birthdate ? moment(patient.birthdate).format("DD/MM/YYYY") : ''}`,0,0,'R');

        pdf.SetY(y+20);
        pdf.SetX(10);
        pdf.Cell(40,5,`Apoderado`,0,0,'R');
        pdf.Cell(100,5,`Parentesco ${patient.relationship}`,0,0,'R');

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
        pdf.Cell(40,5,`${patient.distrito ? patient.distrito : ''}`);

        pdf.SetY(y+40);
        pdf.SetX(10);
        pdf.Cell(40,5,`E-Mail`,0,0,'R');
        pdf.Cell(40,5,`${patient.email}`);
        pdf.Cell(40,5,`Teélfono ${patient.phone}`,0,0,'R');
        pdf.Cell(50,5,`Celular ${patient.cellphone}`,0,0,'R');

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

        pdf.Line(10,y+80,200,y+80);
        pdf.SetY(y+80);
        pdf.SetX(10);
        pdf.Cell(40,5,`Dentistas que le atendieron anteriormente y tratamientos realizados`);

        pdf.Line(10,y+98,200,y+98);
        pdf.SetFont('Arial','B',12);
        pdf.SetY(y+100);
        pdf.SetX(10);
        pdf.Cell(40,5,`PARA CASOS DE EMERGENCIA DAR LOS SIGUIENTES DATOS`);

        let medico: string = '';
        if(patient.medico_confianza){
            medico = `${patient.medico_confianza} ${patient.medico_confianza_telefono}`;
        }
        pdf.SetFont('Arial','',9);
        pdf.SetY(y+105);
        pdf.SetX(10);
        pdf.Cell(40,4,`Médico de confianza: ${medico}`);
        pdf.SetY(y+109);
        pdf.SetX(10);
        pdf.Cell(40,4,`Servicio de Ambulancia`);
        let contacto: string = '';
        if(patient.contacto){
            contacto = `${patient.contacto} - ${patient.contacto_telefono}`;
        }
        pdf.SetY(y+113);
        pdf.SetX(10);
        pdf.Cell(40,4,`En caso de emergencia contactar ${contacto}`);

        pdf.SetFont('Arial','B',12);
        pdf.SetY(y+125);
        pdf.SetX(10);
        pdf.Cell(40,5,`ANTECEDENTES MEDICOS`);

        pdf.SetFont('Arial','',9);
        pdf.SetY(y+130);
        pdf.SetX(10);
        pdf.Cell(40,4,`Alérgico a `);
        pdf.SetY(y+134);
        pdf.SetX(10);
        let medicine: string = '', medicine_name: string = '';
        if(patient.medicine){
            medicine = 'Sí';
            medicine_name = patient.medicine_name;
        }
        pdf.Cell(40,4,`Está tomando algún tipo de medicamento ${medicine} ${medicine_name}`);
        pdf.SetY(y+138);
        pdf.SetX(10);
        pdf.Cell(120,4,`Nombre de su medico `);
        pdf.Cell(40,4,`Telef. `);
        pdf.SetY(y+142);
        pdf.SetX(10);
        pdf.Cell(50,4,`Ha padecido hepatitis `);
        pdf.Cell(5,4,`SI`);
        pdf.Cell(5,3,`${patient.hepatitis ? 'X' : ''}`,1);
        pdf.Cell(5,4,``);
        pdf.Cell(7,4,`NO`);
        pdf.Cell(5,3,`${!patient.hepatitis ? 'X' : ''}`,1);
        pdf.Cell(5,4,``);
        pdf.Cell(10,4,`Tipo ${patient.hepatitis ? patient.hepatitis_type : ''}`);
        pdf.SetY(y+146);
        pdf.SetX(10);
        pdf.Cell(50,4,`Sufre de Diabetes `);
        pdf.Cell(5,4,`SI`);
        pdf.Cell(5,3,`${patient.diabetes ? 'X' : ''}`,1);
        pdf.Cell(5,4,``);
        pdf.Cell(7,4,`NO`);
        pdf.Cell(5,3,`${!patient.diabetes ? 'X' : ''}`,1);
        pdf.Cell(5,4,``);
        pdf.Cell(10,4,`Está compensado ${patient.compensated ? 'Sí' : 'No'}`);
        pdf.SetY(y+150);
        pdf.SetX(10);
        pdf.Cell(50,4,`Sufre de Presión Alta o Corazón `);
        pdf.Cell(5,4,`SI`);
        pdf.Cell(5,3,`${patient.high_pressure ? 'X' : ''}`,1);
        pdf.Cell(5,4,``);
        pdf.Cell(7,4,`NO`);
        pdf.Cell(5,3,`${!patient.high_pressure ? 'X' : ''}`,1);
        pdf.SetY(y+154);
        pdf.SetX(10);
        pdf.MultiCell(190,4,`Sufre de alguna enfermedad que ponga en riesgo su vida o sea de vital importancia para nuestro conocimiento ${patient.suffers_illness}`);

        pdf.SetFont('Arial','B',12);
        pdf.SetY(y+164);
        pdf.SetX(10);
        pdf.Cell(40,5,`ANTECEDENTES ODONTOLOGICOS`);
        pdf.SetFont('Arial','',9);
        pdf.SetY(y+168);
        pdf.SetX(10);
        pdf.Cell(40,4,`Frecuencia con que visita al dentista ${patient.visit_frequency}`);
        pdf.SetY(y+172);
        pdf.SetX(10);
        pdf.Cell(40,4,`Experiencias dentales traumáticas, ${patient.traumatic_experiences}`);
        pdf.SetY(y+176);
        pdf.SetX(10);
        pdf.Cell(40,4,`Le han extraído muelas ${patient.extracted_molars}`);
        pdf.SetY(y+180);
        pdf.SetX(10);
        pdf.Cell(40,4,`Presentó alguna complicación a la anestesia ${patient.complication_anesthesia}`);
        pdf.SetY(y+184);
        pdf.SetX(10);
        pdf.Cell(37,4,`Le sangran las encías`);
        pdf.Cell(5,4,`${patient.gums_bleed ? 'X' : ''}`,1);
        pdf.Cell(40,4,`Fecha de la última profilaxia ${moment(patient.last_prophylaxis).tz('America/Lima').format('DD/MM/YYYY')}`);
        pdf.SetY(y+188);
        pdf.SetX(10);
        pdf.Cell(37,4,`Siente chasquidos y tuidos al masticass o abrir la boca ${patient.popping}`);
        pdf.SetY(y+192);
        pdf.SetX(10);
        pdf.Cell(37,4,`Está satisfecho con estética dental ${patient.satisfied_aesthetic}`);

        if(doctors.length > 0){
            pdf.SetFont('Arial','B',12);
            pdf.SetY(y+198);
            pdf.SetX(10);
            pdf.Cell(40,5,`DRS. TRATANTES`);
            pdf.SetFont('Arial','',9);
            let y_det = y+202;
            doctors.map( (doc: any) => {
                pdf.SetY(y_det);
                pdf.SetX(10);
                pdf.Cell(40,4,`${doc.name}`);
                y_det += 4;
            });
        }

        pdf.SetFont('Arial','',9);
        pdf.SetY(225);
        pdf.SetX(140);
        pdf.Cell(20,5,`Fecha última atención ${moment(patient.last_date).tz('America/Lima').format('DD/MM/YYYY')}`);

        pdf.Line(140,250,190,250);
        pdf.SetY(250);
        pdf.SetX(150);
        pdf.Cell(20,5,`Firma Paciente - Tutor`);


        pdf.SetFont('Arial','',7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `ficha-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/clinichistory/${nameFile}`);
        let response = {link: `pdf/clinichistory/${nameFile}`}
        return response;
    }
}