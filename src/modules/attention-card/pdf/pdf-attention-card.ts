//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

export class PdfAttentionCard {
    print(data: any) {
        const pdf = new FPDF('P', 'mm', 'A4');
        pdf.AddPage('P', 'A4');
        pdf.SetTitle('Ficha de evaluacion de ingreso');
        pdf.SetFillColor(200, 200, 200);

        pdf.Image('assets/img/logo.jpg', 10, 10, 60, 25, 'jpg');

        pdf.SetFont('Arial', '', 16);
        pdf.SetY(10);
        pdf.SetX(110);
        pdf.Cell(90, 20, '', 1);
        pdf.SetY(13);
        pdf.SetX(115);
        pdf.MultiCell(75, 8, 'FICHA DE EVALUACIÓN DE INGRESO', 0, 'C');

        let y = 40;
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.Cell(100, 5, `FECHA DE INGRESO: ${moment(data.dateadmission).tz('America/Lima').format('DD-MM-YYYY')}`);

        pdf.SetY(y + 10);
        pdf.SetX(10);
        pdf.Cell(100, 5, `PACIENTE: ${data.clinichistory.name} ${data.clinichistory.lastNameFather} ${data.clinichistory.lastNameMother}`);
        pdf.SetY(y + 10);
        pdf.SetX(120);
        pdf.Cell(50, 5, `HISTORIA: ${data.clinichistory.history}`);

        pdf.SetY(y + 15);
        pdf.SetX(10);
        pdf.Cell(50, 5, 'MOTIVO DE LA CONSULTA:');
        pdf.SetY(y + 20);
        pdf.SetX(10);
        pdf.MultiCell(200, 5, `${data.motivo}`);

        pdf.SetY(y + 40);
        pdf.SetX(10);
        pdf.Cell(50, 5, 'DIAGNÓSTICOS:');

        pdf.SetY(y + 48);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Apnea del sueño CPAP');
        pdf.SetY(y + 45);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.asc) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 48);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y + 60);
        pdf.SetX(10);
        pdf.Cell(90, 5, `Diagnostico clínico dentario`, 0, 0, 'C');
        pdf.Cell(90, 5, `Diagnostico clínico oseo esqueletico`, 0, 0, 'C');

        /* Seccion 1 */
        pdf.SetY(y + 70);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida cruzada anterior');
        pdf.SetY(y + 70);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_cruzada_a) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 73);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y + 70);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Asimetria facial');
        pdf.SetY(y + 70);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.asimetria_facial) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 73);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }
        y = y + 80;
        /* Seccion 2 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida cruzada posterior');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_cruzada_p) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Retrusión maxilar');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.retrusion_maxilar) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 3 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida clase I');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_clase_i) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Retrusión mandibular');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.retrusion_mandibular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 4 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida clase II');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_clase_ii) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Protusión maxilar');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.protusion_maxilar) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 5 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida clase III');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_clase_iii) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Prognatismo mandibular');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.prognotismo_mandibular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 6 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida profunda');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_profunda) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Desviación mandibular');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_mandibular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 7 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida abierta');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_abierta) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Biprotrusión');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.biprotrusion) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 8 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Mordida en tijera');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.mordida_tijera) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Biretrusión');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.biretrusion) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 9 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Apiñamiento dental');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.apinamiento_dental) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Atresia maxilar');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.atresia_maxilar) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 10 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Inclinación plano oclusal');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.inclinacion_plano_oclusal) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Fisura labio palatina');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.fisura_labio_palatina) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 11 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media superior derecha');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_sd) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'DTM - Articular');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.dtm_articular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 12 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media superior izquierda');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_si) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'DTM - Muscular');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.dtm_muscular) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 13 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media inferior derecha');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_id) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Cefalea atribuida a DTM');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.cefalea_atribuida) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        y = y + 10;
        /* Seccion 14 */
        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(10);
        pdf.MultiCell(50, 5, 'Desviación lineal media inferior izquierda');
        pdf.SetY(y);
        pdf.SetX(75);
        pdf.Cell(15, 10, '', 1);
        if (data.desviacion_media_ii) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(75);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }

        pdf.SetFont('Arial', '', 10);
        pdf.SetY(y);
        pdf.SetX(105);
        pdf.MultiCell(50, 5, 'Sumbido somato sensorial');
        pdf.SetY(y);
        pdf.SetX(180);
        pdf.Cell(15, 10, '', 1);
        if (data.sumbido_somato) {
            pdf.SetFont('Arial', '', 16);
            pdf.SetY(y + 3);
            pdf.SetX(180);
            pdf.Cell(15, 5, 'X', 0, 0, 'C');
        }


        pdf.SetFont('Arial', '', 7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15, 5, `Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);
        pdf.SetY(270);
        pdf.SetX(10);
        pdf.Cell(190, 5, `Página - 1`, 0, 0, 'C');

        const nameFile: string = `attention-card-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F', `uploads/pdf/clinichistory/${nameFile}`);
        let response = { link: `pdf/clinichistory/${nameFile}` }
        return response;
    }
}