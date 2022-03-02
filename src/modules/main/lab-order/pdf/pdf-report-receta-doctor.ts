//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

/**
 * Reporte de Recetas por Odontologo
 */
export class Pdf_report_receta_doctor{

    print(data: any, filtros: any){
        //console.log("Data reporte ",data.detail[0]);
        const pdf = new FPDF('P','mm','A4');
        let y: number = 10;
        const pages: number = Math.ceil(data.length/40);
        let page: number = 1;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Reporte de Recetas por Odontólogo');

        //Titulo
        pdf.SetFont('Arial','B',16);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(190,5,`Reporte de Recetas por Odontólogo`,0,0,'C');

        pdf.SetFont('Arial','',10);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(190,5,`Filtros: Desde ${filtros.since} | Hasta ${filtros.until}`);

        pdf.SetFont('Arial','',7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
        pdf.SetY(270);
        pdf.SetX(10);
        pdf.Cell(190,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');

        pdf.SetFont('Arial','B',8);
        pdf.SetFillColor(200,200,200);
        pdf.SetTextColor(255,255,255);
        pdf.SetY(y+20);
        pdf.SetX(10);
        pdf.Cell(25,5,`Nro. Historia`,1,0,'C',1);
        pdf.Cell(60,5,`Paciente`,1,0,'C',1);
        pdf.Cell(50,5,`Doctor`,1,0,'C',1);
        pdf.Cell(50,5,`Aparato`,1,0,'C',1);

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
                history,
                patient,
                aparato,
                doctor
            } = it;
            if(cont <= 40){
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(25,10,`${history}`,1,0,'C',bg);
                pdf.Cell(60,10,`${patient}`,1,0,'C',bg);
                pdf.Cell(50,10,`${doctor}`,1,0,'C',bg);
                pdf.Cell(50,10,`${aparato}`,1,0,'C',bg);
            }else{
                pdf.AddPage('P','A4');
                y = 10;
                //Titulo
                pdf.SetFont('Arial','B',16);
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(190,5,`Reporte de Recetas por Odontólogo`,0,0,'C');

                pdf.SetFont('Arial','',10);
                pdf.SetY(y+10);
                pdf.SetX(10);
                pdf.Cell(190,5,`Filtros: Desde ${filtros.since} | Hasta ${filtros.until}`);

                pdf.SetFont('Arial','B',8);
                pdf.SetFillColor(6,16,80);
                pdf.SetTextColor(255,255,255);
                pdf.SetY(y+20);
                pdf.SetX(10);
                pdf.Cell(25,5,`Nro. Historia`,1,0,'C',1);
                pdf.Cell(60,5,`Paciente`,1,0,'C',1);
                pdf.Cell(50,5,`Doctor`,1,0,'C',1);
                pdf.Cell(50,5,`Aparato`,1,0,'C',1);

                y = 35;
                pdf.SetFont('Arial','',8);
                pdf.SetTextColor(0,0,0);
                pdf.SetFillColor(201,202,209);
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(25,10,`${history}`,1,0,'C',bg);
                pdf.Cell(60,10,`${patient}`,1,0,'C',bg);
                pdf.Cell(50,10,`${doctor}`,1,0,'C',bg);
                pdf.Cell(50,10,`${aparato}`,1,0,'C',bg);

                cont = 1;
                page ++;
                pdf.SetFont('Arial','',7);
                pdf.SetY(260);
                pdf.SetX(10);
                pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
                pdf.SetY(270);
                pdf.SetX(10);
                pdf.Cell(190,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');
            }
        });

        const nameFile: string = `report-receta-doctor-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/lab/${nameFile}`);
        let response = {link: `pdf/lab/${nameFile}`}
        return response;
    }
}