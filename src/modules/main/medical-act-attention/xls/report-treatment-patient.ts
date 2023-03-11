//Excel4Node
import * as xl from 'excel4node';
import { MedicalActAttention } from '../medical-act-attention.entity';

export class ReportTreatmentPatient {
    onCreate(data: MedicalActAttention[]): Promise<any> {
        const wb = new xl.Workbook();
        const { patient } = data[0];
        const ws = wb.addWorksheet(`${patient.history}`);
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
        ws.cell(1, 1, 1, 9, true)
            .string(`Reporte de tratamientos - ${patient.name} ${patient.lastNameFather} ${patient.lastNameMother}`)
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
        ws.cell(2, 1)
            .string("Historia");
        ws.cell(3, 1)
            .string("Apoderado");
        ws.cell(2, 2)
            .string(`${patient.history}`);
        if (patient.attorney !== null || patient.attorney !== '') {
            ws.cell(3, 2)
                .string(`${patient.invoise_type_document} ${patient.invoise_num_document}`);
            ws.cell(3, 3)
                .string(`${patient.attorney}`);
        }
        ws.row(5).filter();
        ws.row(5).freeze();
        ws.cell(5, 1)
            .string("FECHA DE REGISTRO")
            .style(style);
        ws.cell(5, 2)
            .string("DOCTOR")
            .style(style);
        ws.cell(5, 3)
            .string("TRATAMIENTO")
            .style(style);
        ws.cell(5, 4)
            .string("CANTIDAD")
            .style(style);
        ws.cell(5, 5)
            .string("MONEDA")
            .style(style);
        ws.cell(5, 6)
            .string("VALOR")
            .style(style);
        ws.cell(5, 7)
            .string("TOTAL")
            .style(style);
        ws.cell(5, 8)
            .string("FACTURA/BOLETA")
            .style(style);
        ws.cell(5, 9)
            .string("FECHA")
            .style(style);
        // size columns
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(30);
        ws.column(9).setWidth(30);
        let y = 6;
        data.map((it: MedicalActAttention) => {
            const {
                date,
                doctor,
                tariff,
                document_date,
                document_number,
                quantity,
                value,
                co
            } = it;
            ws.cell(y, 1)
                .date(new Date(date)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 2)
                .string(`${doctor.nameQuote}`);
            ws.cell(y, 3)
                .string(`${tariff.name}`);
            ws.cell(y, 4)
                .number(Number(quantity));
            ws.cell(y, 5)
                .string(`${co.code}`);
            ws.cell(y, 6)
                .number(Number(value));
            ws.cell(y, 7)
                .number(Number(quantity * value));
            ws.cell(y, 8)
                .string(`${document_number}`);
            ws.cell(y, 9)
                .string(`${document_date}`);
            y++;
        });
        return wb.writeToBuffer();
    }
}