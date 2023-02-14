//Excel4Node
import * as xl from 'excel4node';
import { ReportDailyPaymentsDto } from '../dto/report-daily-payments-dto';

export class ReportDailyPayment {
    onCreate(date: string, data: ReportDailyPaymentsDto[]): Promise<any> {
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(`Ingresos ${date}`);
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
            .string(`Reporte de pagos del día ${date}`)
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
            .string("FECHA DE REGISTRO")
            .style(style);
        ws.cell(5, 2)
            .string("PACIENTE")
            .style(style);
        ws.cell(5, 3)
            .string("APODERADO")
            .style(style);
        ws.cell(5, 4)
            .string("DNI DEL PACIENTE")
            .style(style);
        ws.cell(5, 5)
            .string("TELEFONO")
            .style(style);
        ws.cell(5, 6)
            .string("SERVICIO")
            .style(style);
        ws.cell(5, 7)
            .string("MONTO")
            .style(style);
        ws.cell(5, 8)
            .string("MONEDA")
            .style(style);
        ws.cell(5, 9)
            .string("MEDIO PAGO")
            .style(style);
        ws.cell(5, 10)
            .string("FECHA AGENDA")
            .style(style);
        ws.cell(5, 11)
            .string("VENDEDOR")
            .style(style);
        // size columns
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(30);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(25);
        ws.column(10).setWidth(20);
        ws.column(11).setWidth(20);
        let y = 6;
        data.map((it: ReportDailyPaymentsDto) => {
            const {
                date,
                patient,
                attorney,
                patient_doc_num,
                phone,
                tariff,
                amount,
                coin,
                paymentmethod,
                origin,
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
                .string(`${phone}`);
            ws.cell(y, 6)
                .string(`${tariff}`);
            ws.cell(y, 7)
                .number(Number(amount));
            ws.cell(y, 8)
                .string(`${coin}`);
            ws.cell(y, 9)
                .string(`${paymentmethod}`);
            ws.cell(y, 10)
                .string('');
            ws.cell(y, 11)
                .string(``);
            y++;
        });
        return wb.writeToBuffer();
    }
}