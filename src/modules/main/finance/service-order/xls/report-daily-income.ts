//Excel4Node
import * as xl from 'excel4node';
import { DailyIncomeDto } from '../dto/daily-income-view-dto';

export class ReportPayment {
    onCreate(since: string, until: string, status: number, data: DailyIncomeDto[]): Promise<any> {
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(`Datos`);
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
            .string(`Reporte de Ordenes por facturar desde ${since} hasta ${until}`)
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
        ws.row(5).freeze();
        ws.row(5).filter();
        ws.cell(5, 1)
            .string("Doctor")
            .style(style);
        ws.cell(5, 2)
            .string("Fecha")
            .style(style);
        ws.cell(5, 3)
            .string("Tipo Documento")
            .style(style);
        ws.cell(5, 4)
            .string("DNI Cliente")
            .style(style);
        ws.cell(5, 5)
            .string("Nombre Cliente")
            .style(style);
        ws.cell(5, 6)
            .string("Correo Electr.")
            .style(style);
        ws.cell(5, 7)
            .string("HC")
            .style(style);
        ws.cell(5, 8)
            .string("DNI")
            .style(style);
        ws.cell(5, 9)
            .string("Nombre Paciente")
            .style(style);
        ws.cell(5, 10)
            .string("Edad")
            .style(style);
        ws.cell(5, 11)
            .string("Linea de negocio")
            .style(style);
        ws.cell(5, 12)
            .string("Especialidad")
            .style(style);
        ws.cell(5, 13)
            .string("Tratamiento")
            .style(style);
        ws.cell(5, 14)
            .string("Total S/")
            .style(style);
        ws.cell(5, 15)
            .string("Total $")
            .style(style);
        if (status === 2) {
            ws.cell(5, 16)
                .string("Metodo de pago")
                .style(style);
            ws.cell(5, 17)
                .string("Cuenta bancaria")
                .style(style);
            ws.cell(5, 18)
                .string("Num. Operación")
                .style(style);
            ws.cell(5, 19)
                .string("Tipo doc.")
                .style(style);
            ws.cell(5, 20)
                .string("Num. doc.")
                .style(style);
            ws.cell(5, 21)
                .string("Fecha doc.")
                .style(style);
        }
        // size columns
        ws.column(1).setWidth(25);
        ws.column(2).setWidth(15);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(25);
        ws.column(6).setWidth(25);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(30);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(20);
        ws.column(12).setWidth(20);
        ws.column(13).setWidth(30);
        ws.column(14).setWidth(15);
        ws.column(15).setWidth(15);
        if (status === 2) {
            ws.column(16).setWidth(20);
            ws.column(17).setWidth(30);
            ws.column(18).setWidth(20);
            ws.column(19).setWidth(15);
            ws.column(20).setWidth(15);
            ws.column(21).setWidth(15);
        }
        let y = 6;
        const styleNumeric = wb.createStyle({
            numberFormat: '#,##0.00; (#,##0.00); 0',
        });
        data.map((it: DailyIncomeDto) => {
            const {
                doctor,
                date,
                type_doc,
                num_doc,
                attorney,
                email,
                history,
                patient_doc_num,
                patient,
                patient_age,
                business_line,
                specialty,
                tariff,
                amount,
                coin,
                payment_method,
                bank_account,
                operation_number,
                document_type,
                document_number,
                document_date

            } = it;
            ws.cell(y, 1)
                .string(`${doctor}`);
            ws.cell(y, 2)
                .date(new Date(date)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 3)
                .string(`${type_doc === null ? '' : type_doc}`);
            ws.cell(y, 4)
                .string(`${num_doc === null ? '' : num_doc}`);
            ws.cell(y, 5)
                .string(`${attorney === null ? '' : attorney}`);
            ws.cell(y, 6)
                .string(`${email}`);
            ws.cell(y, 7)
                .string(`${history}`);
            ws.cell(y, 8)
                .string(`${patient_doc_num}`);
            ws.cell(y, 9)
                .string(`${patient}`);
            ws.cell(y, 10)
                .number(Number(patient_age));
            ws.cell(y, 11)
                .string(`${business_line}`);
            ws.cell(y, 12)
                .string(`${specialty}`);
            ws.cell(y, 13)
                .string(`${tariff}`);
            ws.cell(y, 14)
                .number(coin === 'S/' ? amount : 0).style(styleNumeric);
            ws.cell(y, 15)
                .number(coin === '$' ? amount : 0).style(styleNumeric);
            if (status === 2) {
                ws.cell(y, 16)
                    .string(`${payment_method}`);
                ws.cell(y, 17)
                    .string(`${bank_account}`);
                ws.cell(y, 18)
                    .string(`${operation_number}`);
                ws.cell(y, 19)
                    .string(`${document_type === 'invoice' ? 'Factura' : 'Boleta'}`);
                ws.cell(y, 20)
                    .string(`${document_number}`);
                ws.cell(y, 21)
                    .date(new Date(document_date)).style({ numberFormat: 'dd/mm/yyyy' });
            }
            y++;
        });
        const styleTotal = wb.createStyle({
            font: {
                size: 14,
                bold: true
            },
        });
        const styleTotalNumeric = wb.createStyle({
            font: {
                size: 14,
                bold: true
            },
            numberFormat: '#,##0.00; (#,##0.00); -',
        });
        ws.cell(y, 13)
            .string(`Total`).style(styleTotal);
        ws.cell(y, 14)
            .formula(`SUM(N6:N${y - 1})`)
            .style(styleTotalNumeric);
        ws.cell(y, 15)
            .formula(`SUM(O6:O${y - 1})`)
            .style(styleTotalNumeric);
        return wb.writeToBuffer();
    }
}