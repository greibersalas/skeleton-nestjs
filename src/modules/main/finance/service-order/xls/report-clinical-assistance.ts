//Excel4Node
import * as xl from 'excel4node';
import { ReportClinicalAssistanceDto } from '../dto/report-clinical-assistance-dto';

export class ReportClinicalAssistance {
    onCreate(date: string, data: ReportClinicalAssistanceDto[]): Promise<any> {
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(`${date}`);
        const styleTitle = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            font: {
                size: 14,
                bold: true
            }
        });
        ws.cell(1, 1, 1, 11, true)
            .string(`Reporte de asistencias a clinica del día ${date}`)
            .style(styleTitle);

        const style = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#808080',
            },
            font: {
                color: '#ffffff',
                bold: true
            }
        });
        ws.row(5).filter();
        ws.cell(5, 1)
            .string("FECHA DE ASISTENCIA")
            .style(style);
        ws.cell(5, 2)
            .string("PACIENTE")
            .style(style);
        ws.cell(5, 3)
            .string("CLIENTE")
            .style(style);
        ws.cell(5, 4)
            .string("DNI PACIENTE")
            .style(style);
        ws.cell(5, 5)
            .string("DNI CLIENTE")
            .style(style);
        ws.cell(5, 6)
            .string("HC")
            .style(style);
        ws.cell(5, 7)
            .string("EDAD")
            .style(style);
        ws.cell(5, 8)
            .string("DOCTOR")
            .style(style);
        ws.cell(5, 9)
            .string("LINEA DE NEGOCIO")
            .style(style);
        ws.cell(5, 10)
            .string("ESPECIALIDAD")
            .style(style);
        ws.cell(5, 11)
            .string("TRATAMIENTO")
            .style(style);
        ws.cell(5, 12)
            .string("MONTO A PAGAR")
            .style(style);
        ws.cell(5, 13)
            .string("MONEDA")
            .style(style);
        ws.cell(5, 14)
            .string("MEDIO PAGO")
            .style(style);
        ws.cell(5, 15)
            .string("VENDEDOR")
            .style(style);
        ws.cell(5, 16)
            .string("EJECUTIVO DE CIERRE")
            .style(style);
        ws.cell(5, 17)
            .string("OBSERVACIONES")
            .style(style);
        // size columns
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(30);
        ws.column(9).setWidth(25);
        ws.column(10).setWidth(20);
        ws.column(11).setWidth(20);
        ws.column(12).setWidth(20);
        ws.column(13).setWidth(20);
        ws.column(14).setWidth(20);
        ws.column(15).setWidth(20);
        ws.column(16).setWidth(20);
        ws.column(17).setWidth(20);
        let y = 6;
        data.map((it: ReportClinicalAssistanceDto) => {
            const {
                date,
                patient,
                attorney,
                patient_doc_num,
                invoise_num_document,
                history,
                patient_age,
                doctor,
                business_line,
                specialty,
                tariff,
                amount,
                coin,
                paymentmethod
            } = it;
            ws.cell(y, 1)
                .date(new Date(date)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 2)
                .string(`${patient}`);
            ws.cell(y, 3)
                .string(`${attorney === null ? '' : attorney}`);
            ws.cell(y, 4)
                .string(`${patient_doc_num}`);
            ws.cell(y, 5)
                .string(`${invoise_num_document === null ? '' : invoise_num_document}`);
            ws.cell(y, 6)
                .string(`${history}`);
            ws.cell(y, 7)
                .string(`${patient_age} años`);
            ws.cell(y, 8)
                .string(`${doctor}`);
            ws.cell(y, 9)
                .string(`${business_line}`);
            ws.cell(y, 10)
                .string(`${specialty}`);
            ws.cell(y, 11)
                .string(`${tariff}`);
            ws.cell(y, 12)
                .number(Number(amount));
            ws.cell(y, 13)
                .string(`${coin}`);
            ws.cell(y, 14)
                .string(`${paymentmethod}`);
            ws.cell(y, 15)
                .string(``);
            ws.cell(y, 16)
                .string(``);
            ws.cell(y, 17)
                .string(``);
            y++;
        });
        return wb.writeToBuffer();
    }
}