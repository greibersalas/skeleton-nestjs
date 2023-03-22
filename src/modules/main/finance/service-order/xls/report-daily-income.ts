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
        const title = status === 1 ? 'por facturar' : 'facturadas';
        ws.cell(1, 1, 1, 11, true)
            .string(`Reporte de Ordenes ${title} desde ${since} hasta ${until}`)
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
            .string("Nro. Orden servicio")
            .style(style);
        ws.cell(5, 2)
            .string("Fecha O/S")
            .style(style);
        ws.cell(5, 3)
            .string("Hora solicitud")
            .style(style);
        ws.cell(5, 4)
            .string("Usuario solicitante")
            .style(style);
        ws.cell(5, 5)
            .string("Doctor")
            .style(style);
        ws.cell(5, 6)
            .string("Tipo Documento")
            .style(style);
        ws.cell(5, 7)
            .string("DNI Cliente")
            .style(style);
        ws.cell(5, 8)
            .string("Nombre Cliente")
            .style(style);
        ws.cell(5, 9)
            .string("Correo Electr.")
            .style(style);
        ws.cell(5, 10)
            .string("HC")
            .style(style);
        ws.cell(5, 11)
            .string("DNI")
            .style(style);
        ws.cell(5, 12)
            .string("Nombre Paciente")
            .style(style);
        ws.cell(5, 13)
            .string("Edad")
            .style(style);
        ws.cell(5, 14)
            .string("Linea de negocio")
            .style(style);
        ws.cell(5, 15)
            .string("Especialidad")
            .style(style);
        ws.cell(5, 16)
            .string("Tratamiento")
            .style(style);
        ws.cell(5, 17)
            .string("Descuento")
            .style(style);
        ws.cell(5, 18)
            .string("Total S/")
            .style(style);
        ws.cell(5, 19)
            .string("Total $")
            .style(style);
        if (status === 2) {
            ws.cell(5, 20)
                .string("Metodo de pago")
                .style(style);
            ws.cell(5, 21)
                .string("Cuenta bancaria")
                .style(style);
            ws.cell(5, 22)
                .string("Num. Operación")
                .style(style);
            ws.cell(5, 23)
                .string("Tipo doc.")
                .style(style);
            ws.cell(5, 24)
                .string("Num. doc.")
                .style(style);
            ws.cell(5, 25)
                .string("Fecha doc.")
                .style(style);
        }
        // size columns
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(25);
        ws.column(6).setWidth(20);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(25);
        ws.column(9).setWidth(25);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(15);
        ws.column(12).setWidth(30);
        ws.column(13).setWidth(15);
        ws.column(14).setWidth(20);
        ws.column(15).setWidth(20);
        ws.column(16).setWidth(30);
        ws.column(17).setWidth(15);
        ws.column(18).setWidth(15);
        ws.column(19).setWidth(15);
        if (status === 2) {
            ws.column(20).setWidth(20);
            ws.column(21).setWidth(30);
            ws.column(22).setWidth(20);
            ws.column(23).setWidth(15);
            ws.column(24).setWidth(15);
            ws.column(25).setWidth(15);
        }
        let y = 6;
        const styleNumeric = wb.createStyle({
            numberFormat: '#,##0.00; (#,##0.00); 0',
        });
        data.map((it: DailyIncomeDto) => {
            const {
                id,
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
                document_date,
                created_hour,
                username,
                discount_amount,
                discount_type

            } = it;
            let total = amount;
            let discount = '';
            if (discount_amount > 0) {
                if (discount_type === 'P') {
                    total = total - ((total * discount_amount / 100));
                    discount = `${discount_amount}%`;
                } else {
                    total -= discount_amount;
                    discount = `${discount_amount} ${coin}`;
                }
            }
            ws.cell(y, 1)
                .number(id);
            ws.cell(y, 2)
                .date(new Date(date)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 3)
                .string(created_hour);
            ws.cell(y, 4)
                .string(username);
            ws.cell(y, 5)
                .string(`${doctor}`);
            ws.cell(y, 6)
                .string(`${type_doc === null ? '' : type_doc}`);
            ws.cell(y, 7)
                .string(`${num_doc === null ? '' : num_doc}`);
            ws.cell(y, 8)
                .string(`${attorney === null ? '' : attorney}`);
            ws.cell(y, 9)
                .string(`${email}`);
            ws.cell(y, 10)
                .string(`${history}`);
            ws.cell(y, 11)
                .string(`${patient_doc_num}`);
            ws.cell(y, 12)
                .string(`${patient}`);
            ws.cell(y, 13)
                .number(Number(patient_age));
            ws.cell(y, 14)
                .string(`${business_line}`);
            ws.cell(y, 15)
                .string(`${specialty}`);
            ws.cell(y, 16)
                .string(`${tariff}`);
            ws.cell(y, 17)
                .string(`${discount}`);
            ws.cell(y, 18)
                .number(coin === 'S/' ? total : 0).style(styleNumeric);
            ws.cell(y, 19)
                .number(coin === '$' ? total : 0).style(styleNumeric);
            if (status === 2) {
                ws.cell(y, 20)
                    .string(`${payment_method}`);
                ws.cell(y, 21)
                    .string(`${bank_account ? bank_account : ''}`);
                ws.cell(y, 22)
                    .string(`${operation_number ? operation_number : ''}`);
                ws.cell(y, 23)
                    .string(`${document_type === 'invoice' ? 'Factura' : 'Boleta'}`);
                ws.cell(y, 24)
                    .string(`${document_number}`);
                ws.cell(y, 25)
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
        ws.cell(y, 17)
            .string(`Total`).style(styleTotal);
        ws.cell(y, 18)
            .formula(`SUM(R6:R${y - 1})`)
            .style(styleTotalNumeric);
        ws.cell(y, 19)
            .formula(`SUM(S6:S${y - 1})`)
            .style(styleTotalNumeric);
        return wb.writeToBuffer();
    }
}