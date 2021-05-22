//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

export class Pdf_lab_resumen{

    print(data: any){
        //console.log("Data reporte ",data.detail[0]);
        const pdf = new FPDF('L','mm','legal');
        let y: number = 10;
        const pages: number = Math.ceil(data.length/10);
        let page: number = 1;
        pdf.AddPage('L','legal');
        pdf.SetTitle('Resumen ordenes de laboratorio - '+data.id);

        //Titulo
        pdf.SetFont('Arial','B',16);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(335,5,`Resumen ordenes de laboratorio`,0,0,'C');

        pdf.SetFont('Arial','',7);
        pdf.SetY(185);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
        pdf.SetY(190);
        pdf.SetX(10);
        pdf.Cell(335,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');

        pdf.SetFont('Arial','B',8);
        pdf.SetFillColor(6,16,80);
        pdf.SetTextColor(255,255,255);
        pdf.SetY(y+20);
        pdf.SetX(10);
        pdf.Cell(30,5,`Doctor`,1,0,'C',1);
        pdf.Cell(25,5,`Asistente dental`,1,0,'C',1);
        pdf.Cell(50,5,`Paciente`,1,0,'C',1);
        pdf.Cell(10,5,`Chip`,1,0,'C',1);
        pdf.Cell(45,5,`Tipo aparato`,1,0,'C',1);
        pdf.Cell(25,5,`Condición`,1,0,'C',1);
        pdf.Cell(15,5,`Color`,1,0,'C',1);
        pdf.Cell(25,5,`Fecha Intalación`,1,0,'C',1);
        pdf.Cell(10,5,`Hora`,1,0,'C',1);
        pdf.Cell(25,5,`Técnico`,1,0,'C',1);
        pdf.Cell(50,5,`Observaciones`,1,0,'C',1);
        pdf.Cell(30,5,`Fecha Elaboración`,1,0,'C',1);

        y = 25;
        let bg: boolean = false;
        let cont: number = 0;
        data.map((it: any) => {
            bg = bg ? false : true;
            pdf.SetFont('Arial','',8);
            pdf.SetTextColor(0,0,0);
            pdf.SetFillColor(201,202,209);
            y += 10;
            cont ++;
            const {
                doctor,
                quotation_detail,
                chip,
                job,
                color,
                instalation,
                elaboration,
                technique,
                tariff,
                assistant,
                observation
            } = it;
            const { nameQuote } = doctor;
            const { quotation } = quotation_detail;
            const { clinicHistory } = quotation;
            const {
                name,
                lastNameFather,
                lastNameMother
            } = clinicHistory;
            if(cont <= 10){
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(30,10,`${nameQuote}`,1,0,'C',bg);
                pdf.Cell(25,10,`${assistant}`,1,0,'C',bg);
                pdf.Cell(50,10,`${name} ${lastNameFather} ${lastNameMother}`,1,0,'C',bg);
                pdf.Cell(10,10,`${chip ? 'Si' : 'No'}`,1,0,'C',bg);
                pdf.Cell(45,10,`${tariff.name}`,1,0,'C',bg);
                pdf.Cell(25,10,`${job}`,1,0,'C',bg);
                pdf.Cell(15,10,`${color}`,1,0,'C',bg);
                pdf.Cell(25,10,`${instalation}`,1,0,'C',bg);
                pdf.Cell(10,10,``,1,0,'C',bg);
                pdf.Cell(25,10,`${technique}`,1,0,'C',bg);
                pdf.Cell(50,10,`${observation}`,1,0,'C',bg);
                pdf.Cell(30,10,`${elaboration}`,1,0,'C',bg);
            }else{
                pdf.AddPage('L','legal');
                y = 10;
                //Titulo
                pdf.SetFont('Arial','B',16);
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(335,5,`Resumen ordenes de laboratorio`,0,0,'C');

                pdf.SetFont('Arial','B',8);
                pdf.SetFillColor(6,16,80);
                pdf.SetTextColor(255,255,255);
                pdf.SetY(y+20);
                pdf.SetX(10);
                pdf.Cell(30,5,`Doctor`,1,0,'C',1);
                pdf.Cell(25,5,`Asistente dental`,1,0,'C',1);
                pdf.Cell(50,5,`Paciente`,1,0,'C',1);
                pdf.Cell(10,5,`Chip`,1,0,'C',1);
                pdf.Cell(45,5,`Tipo aparato`,1,0,'C',1);
                pdf.Cell(25,5,`Condición`,1,0,'C',1);
                pdf.Cell(15,5,`Color`,1,0,'C',1);
                pdf.Cell(25,5,`Fecha Intalación`,1,0,'C',1);
                pdf.Cell(10,5,`Hora`,1,0,'C',1);
                pdf.Cell(25,5,`Técnico`,1,0,'C',1);
                pdf.Cell(50,5,`Observaciones`,1,0,'C',1);
                pdf.Cell(30,5,`Fecha Elaboración`,1,0,'C',1);

                y = 35;
                pdf.SetFont('Arial','',8);
                pdf.SetTextColor(0,0,0);
                pdf.SetFillColor(201,202,209);
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(30,10,`${nameQuote}`,1,0,'C',bg);
                pdf.Cell(25,10,`${assistant}`,1,0,'C',bg);
                pdf.Cell(50,10,`${name} ${lastNameFather} ${lastNameMother}`,1,0,'C',bg);
                pdf.Cell(10,10,`${chip ? 'Si' : 'No'}`,1,0,'C',bg);
                pdf.Cell(45,10,`${tariff.name}`,1,0,'C',bg);
                pdf.Cell(25,10,`${job}`,1,0,'C',bg);
                pdf.Cell(15,10,`${color}`,1,0,'C',bg);
                pdf.Cell(25,10,`${instalation}`,1,0,'C',bg);
                pdf.Cell(10,10,``,1,0,'C',bg);
                pdf.Cell(25,10,`${technique}`,1,0,'C',bg);
                pdf.Cell(50,10,`${observation}`,1,0,'C',bg);
                pdf.Cell(30,10,`${elaboration}`,1,0,'C',bg);

                cont = 1;
                page ++;
                pdf.SetFont('Arial','',7);
                pdf.SetY(185);
                pdf.SetX(10);
                pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
                pdf.SetY(190);
                pdf.SetX(10);
                pdf.Cell(335,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');
            }
        });

        const nameFile: string = `lab-resume-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/lab/${nameFile}`);
        let response = {link: `pdf/lab/${nameFile}`}
        return response;
    }
}