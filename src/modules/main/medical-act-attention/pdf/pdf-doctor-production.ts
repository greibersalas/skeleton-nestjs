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
        const pdf = new FPDF('L','mm','A4');
        let y: number = 10;
        const pages: number = Math.ceil(data.length/40);
        let page: number = 1;
        pdf.AddPage('L','A4');
        pdf.SetTitle('Reporte de peoducción doctores');

        //Titulo
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(190,5,`Ingresos detallados del Dr(a) ${data[0].doctor} del ${moment(since).format('DD/MM/YYYY')} al ${moment(until).format('DD/MM/YYYY')}`,0,0,'C');

        pdf.SetFont('Arial','',7);
        pdf.SetY(175);
        pdf.SetX(10);
        pdf.Cell(280,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`,0,0,'R');
        pdf.SetY(180);
        pdf.SetX(10);
        pdf.Cell(280,5,`Maxillaris`,0,0,'R');
        pdf.SetY(180);
        pdf.SetX(10);
        pdf.Cell(280,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');

        pdf.SetFont('Arial','B',8);
        pdf.SetFillColor(6,16,80);
        pdf.SetTextColor(255,255,255);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(20,5,`Fecha`,1,0,'C',1);
        pdf.Cell(15,5,`Sede`,1,0,'C',1);
        pdf.Cell(70,5,`Paciente`,1,0,'C',1);
        pdf.Cell(10,5,`%`,1,0,'C',1);
        pdf.Cell(15,5,`Moneda`,1,0,'C',1);
        pdf.Cell(20,5,`Bruto`,1,0,'C',1);
        pdf.Cell(20,5,`Laboratorio`,1,0,'C',1);
        pdf.Cell(25,5,`Tarjeta/Efectivo`,1,0,'C',1);
        pdf.Cell(15,5,`IGV`,1,0,'C',1);
        pdf.Cell(20,5,`Costos`,1,0,'C',1);
        pdf.Cell(20,5,`Util. Bruta`,1,0,'C',1);
        pdf.Cell(20,5,`Honorarios`,1,0,'C',1);
        pdf.SetFillColor(200,200,200);
        pdf.SetTextColor(255,255,255);

        y = 15;
        let bg: boolean = false;
        let cont: number = 0;
        let total_bruto_sol = 0;
        let total_bruto_usd = 0;
        let total_comision_sol = 0;
        let total_comision_usd = 0;
        let total_lab_sol = 0;
        let total_lab_usd = 0;
        let total_igv_sol = 0;
        let total_igv_usd = 0;
        let total_costos_sol = 0;
        let total_costos_usd = 0;
        let total_utilidad_sol = 0;
        let total_utilidad_usd = 0;
        let total_honorario_sol = 0;
        let total_honorario_usd = 0;
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
                cost,
                cost_usd,
                quantity,
                value,
                coin_code,
                idcoin,
                lab_cost,
                commission
            } = it;
            let bruto = 0;
            let coin = coin_code;
            let igv = 0;
            let costo = 0;
            let utilidad = 0;
            let comision = 0;
            let honorarios = 0;
            if(idcoin === 1){
                bruto = value*quantity;
                igv = bruto - (bruto/1.18);
                total_bruto_sol += bruto;
                comision = (bruto * (commission / 100));
                total_comision_sol += comision;
                costo = cost;
                total_lab_sol += lab_cost;
                total_igv_sol += igv;
                total_costos_sol += cost;
                utilidad = (bruto - (lab_cost+igv+(bruto * (commission / 100))+cost));
                total_utilidad_sol += utilidad;
                honorarios = (utilidad * (porcentage / 100));
                total_honorario_sol += honorarios;
            }else{
                bruto = value*quantity;
                igv = bruto - (bruto/1.18);
                total_bruto_usd += bruto;
                comision = (bruto * (commission / 100));
                total_comision_usd += comision;
                costo = cost_usd;
                total_lab_usd += lab_cost;
                total_igv_usd += igv;
                total_costos_usd += cost_usd;
                utilidad = (bruto - (lab_cost+igv+(bruto * (commission / 100))+cost_usd));
                total_utilidad_usd += utilidad;
                honorarios = (utilidad * (porcentage / 100));
                total_honorario_usd += honorarios;
            }
            if(cont <= 13){
                pdf.SetY(y);
                pdf.SetX(10);
                pdf.Cell(20,10,`${moment(date).format('DD/MM/YYYY')}`,1,0,'C',bg);
                pdf.Cell(15,10,`Miraflores`,1,0,'C',bg);
                pdf.Cell(70,10,`${patient}`,1,0,'C',bg);
                pdf.Cell(10,10,`${porcentage}`,1,0,'C',bg);
                pdf.Cell(15,10,`${coin}`,1,0,'R',bg);
                pdf.Cell(20,10,`${bruto.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${lab_cost.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(25,10,`${comision.toFixed(2).toLocaleString()}`,1,0,'C',bg);
                pdf.Cell(15,10,`${igv.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${costo.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${utilidad.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${honorarios.toFixed(2).toLocaleString()}`,1,0,'R',bg);
            }else{
                pdf.AddPage('L','A4');
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
                pdf.Cell(15,5,`Moneda`,1,0,'C',1);
                pdf.Cell(20,5,`Bruto`,1,0,'C',1);
                pdf.Cell(20,5,`Laboratorio`,1,0,'C',1);
                pdf.Cell(25,5,`Tarjeta/Efectivo`,1,0,'C',1);
                pdf.Cell(15,5,`IGV`,1,0,'C',1);
                pdf.Cell(20,5,`Costos`,1,0,'C',1);
                pdf.Cell(20,5,`Util. Bruta`,1,0,'C',1);
                pdf.Cell(20,5,`Honorarios`,1,0,'C',1);

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
                pdf.Cell(15,10,`${coin}`,1,0,'R',bg);
                pdf.Cell(20,10,`${bruto.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${lab_cost.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(25,10,`${comision.toFixed(2).toLocaleString()}`,1,0,'C',bg);
                pdf.Cell(15,10,`${igv.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${costo.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${utilidad.toFixed(2).toLocaleString()}`,1,0,'R',bg);
                pdf.Cell(20,10,`${honorarios.toFixed(2).toLocaleString()}`,1,0,'R',bg);

                cont = 1;
                page ++;
                pdf.SetFont('Arial','',7);
                pdf.SetY(175);
                pdf.SetX(10);
                pdf.Cell(280,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`,0,0,'R');
                pdf.SetY(180);
                pdf.SetX(10);
                pdf.Cell(280,5,`Maxillaris`,0,0,'R');
                pdf.SetY(180);
                pdf.SetX(10);
                pdf.Cell(280,5,`--- Pág. ${pdf.PageNo()}/${pages} ---`,0,0,'C');
            }
        });

        pdf.SetFont('Arial','',9);
        pdf.SetY(165);
        pdf.SetX(35);
        pdf.Cell(30,5,`Total Soles`,0,0,'C');
        pdf.Cell(30,5,`Total Dolares`,0,0,'C');

        pdf.SetY(170);
        pdf.SetX(10);
        pdf.Cell(15,5,`Total Ingresos`);
        pdf.Line(35,254,100,254);
        pdf.SetY(175);
        pdf.SetX(10);
        pdf.Cell(15,5,`Honorarios`);
        pdf.Line(35,259,100,259);

        pdf.SetY(170);
        pdf.SetX(35);
        pdf.Cell(25,5,`${total_bruto_sol.toFixed(2).toLocaleString()}`,0,0,'R');
        pdf.Cell(30,5,`${total_bruto_usd.toFixed(2).toLocaleString()}`,0,0,'R');

        pdf.SetY(175);
        pdf.SetX(35);
        pdf.Cell(25,5,`${total_honorario_sol.toFixed(2).toLocaleString()}`,0,0,'R');
        pdf.Cell(30,5,`${total_honorario_usd.toFixed(2).toLocaleString()}`,0,0,'R');

        const nameFile: string = `report-doctor-production-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/${nameFile}`);
        let response = {link: `pdf/${nameFile}`}
        return response;
    }
}