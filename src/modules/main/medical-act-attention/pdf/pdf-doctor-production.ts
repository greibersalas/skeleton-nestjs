//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

/**
 * Reporte de producción de un médico
 */
export class PdfDoctorProduction{

    print(data: any, filtros: any){
        //console.log("Data reporte ",data.detail[0]);
        const { since,until } = filtros;
        const pdf = new FPDF('P','mm','A4');
        let y: number = 10;
        const pages: number = Math.ceil(data.length/40);
        let page: number = 1;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Reporte de peoducción doctores');

        //Titulo
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(190,5,`Ingresos detallados del Dr(a) ${data[0].doctor} del ${moment(since).format('DD/MM/YYYY')} al ${moment(until).format('DD/MM/YYYY')}`,0,0,'C');

        pdf.SetFont('Arial','',7);
        pdf.SetY(267);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
        pdf.SetY(270);
        pdf.SetX(10);
        pdf.Cell(190,5,`Maxillaris`,0,0,'L');
        pdf.SetY(270);
        pdf.SetX(10);
        pdf.Cell(190,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');

        pdf.SetFont('Arial','B',8);
        pdf.SetFillColor(6,16,80);
        pdf.SetTextColor(255,255,255);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(20,5,`Fecha`,1,0,'C',1);
        pdf.Cell(15,5,`Sede`,1,0,'C',1);
        pdf.Cell(70,5,`Paciente`,1,0,'C',1);
        pdf.Cell(10,5,`%`,1,0,'C',1);
        pdf.Cell(15,5,`Unt.`,1,0,'C',1);
        pdf.Cell(15,5,`Cant.`,1,0,'C',1);
        pdf.Cell(15,5,`Bruto`,1,0,'C',1);
        pdf.Cell(10,5,`Mon`,1,0,'C',1);
        pdf.Cell(15,5,`Neto`,1,0,'C',1);
        pdf.SetFillColor(200,200,200);
        pdf.SetTextColor(255,255,255);

        y = 15;
        let bg: boolean = false;
        let cont: number = 0;
        let total_bruto_sol = 0;
        let total_bruto_usd = 0;
        let total_neto_sol = 0;
        let total_neto_usd = 0;
        data.map((it: any) => {
            bg = bg ? false : true;
            pdf.SetFont('Arial','',8);
            pdf.SetTextColor(0,0,0);
            pdf.SetFillColor(201,202,209);
            y += 10;
            cont ++;
            const {
                date,
                patient,
                porcentage,
                price_sol,
                cost,
                price_usd,
                cost_usd,
                quantity,
                value,
                coin_code,
                idcoin
            } = it;
            let unit_price = (value/1.18);
            let bruto = 0;
            let neto = 0;
            let coin = 'S/';
            if(price_usd > 0){
                unit_price = unit_price-cost;
                bruto = unit_price*quantity;
                neto = (bruto/Number(`1.${porcentage}`));
                total_bruto_sol += bruto;
                total_neto_sol += neto;
            }else{
                unit_price = unit_price-cost_usd;
                bruto = unit_price*quantity;
                neto = (bruto/Number(`1.${porcentage}`));
                total_bruto_usd += bruto;
                total_neto_usd += neto;
                coin = '$';
            }
            if(cont <= 24){
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(20,10,`${moment(date).format('DD/MM/YYYY')}`,1,0,'C',bg);
                pdf.Cell(15,10,`Miraflores`,1,0,'C',bg);
                pdf.Cell(70,10,`${patient}`,1,0,'C',bg);
                pdf.Cell(10,10,`${porcentage}`,1,0,'C',bg);
                pdf.Cell(15,10,`${unit_price.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(15,10,`${quantity.toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(15,10,`${bruto.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(10,10,`${coin}`,1,0,'C',bg);
                pdf.Cell(15,10,`${neto.toFixed(2).toLocaleString()}`,1,0,'R',bg);
            }else{
                pdf.AddPage('P','A4');
                y = 10;
                //Titulo
                pdf.SetFont('Arial','B',10);
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(190,5,`Ingresos detallados del Dr(a) ${data[0].doctor} del ${moment(since).format('DD/MM/YYYY')} al ${moment(until).format('DD/MM/YYYY')}`,0,0,'C');

                pdf.SetFont('Arial','B',8);
                pdf.SetFillColor(6,16,80);
                pdf.SetTextColor(255,255,255);
                pdf.SetY(y+10);
                pdf.SetX(10);
                pdf.Cell(20,5,`Fecha`,1,0,'C',1);
                pdf.Cell(15,5,`Sede`,1,0,'C',1);
                pdf.Cell(70,5,`Paciente`,1,0,'C',1);
                pdf.Cell(10,5,`%`,1,0,'C',1);
                pdf.Cell(15,5,`Unt.`,1,0,'C',1);
                pdf.Cell(15,5,`Cant.`,1,0,'C',1);
                pdf.Cell(15,5,`Bruto`,1,0,'C',1);
                pdf.Cell(10,5,`Mon`,1,0,'C',1);
                pdf.Cell(15,5,`Neto`,1,0,'C',1);

                y = 25;
                pdf.SetFont('Arial','',8);
                pdf.SetTextColor(0,0,0);
                pdf.SetFillColor(201,202,209);
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(20,10,`${moment(date).format('DD/MM/YYYY')}`,1,0,'C',bg);
                pdf.Cell(15,10,`Miraflores`,1,0,'C',bg);
                pdf.Cell(70,10,`${patient}`,1,0,'C',bg);
                pdf.Cell(10,10,`${porcentage}`,1,0,'C',bg);
                pdf.Cell(15,10,`${unit_price.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(15,10,`${quantity.toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(15,10,`${bruto.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(10,10,`${coin}`,1,0,'C',bg);
                pdf.Cell(15,10,`${neto.toFixed(2).toLocaleString()}`,1,0,'R',bg);

                cont = 1;
                page ++;
                pdf.SetFont('Arial','',7);
                pdf.SetY(267);
                pdf.SetX(10);
                pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
                pdf.SetY(270);
                pdf.SetX(10);
                pdf.Cell(190,5,`Maxillaris`,0,0,'L');
                pdf.SetY(270);
                pdf.SetX(10);
                pdf.Cell(190,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');
            }
        });

        pdf.SetFont('Arial','',9);
        pdf.SetY(245);
        pdf.SetX(35);
        pdf.Cell(30,5,`Total Soles`,0,0,'C');
        pdf.Cell(30,5,`Total Dolares`,0,0,'C');

        pdf.SetY(250);
        pdf.SetX(10);
        pdf.Cell(15,5,`Total Ingresos`);
        pdf.Line(35,254,100,254);
        pdf.SetY(255);
        pdf.SetX(10);
        pdf.Cell(15,5,`Honorarios`);
        pdf.Line(35,259,100,259);

        pdf.SetY(250);
        pdf.SetX(35);
        pdf.Cell(25,5,`${total_bruto_sol.toFixed(2).toLocaleString()}`,0,0,'R');
        pdf.Cell(30,5,`${total_bruto_usd.toFixed(2).toLocaleString()}`,0,0,'R');

        pdf.SetY(255);
        pdf.SetX(35);
        pdf.Cell(25,5,`${total_neto_sol.toFixed(2).toLocaleString()}`,0,0,'R');
        pdf.Cell(30,5,`${total_neto_usd.toFixed(2).toLocaleString()}`,0,0,'R');

        const nameFile: string = `report-doctor-production-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/${nameFile}`);
        let response = {link: `pdf/${nameFile}`}
        return response;
    }
}