//FPDF
const FPDF = require('node-fpdf');
var moment = require('moment-timezone');

import { QuotationDetail } from "./quotation-detail.entity";
export class Pdf_oi{

    print(data: any){
        const {
            id,
            date,
            clinicHistory,
            detail,
            odontograma
        } = data;
        const pdf = new FPDF('P','mm','A4');
        var y: number = 50;
        pdf.AddPage('P','A4');
        pdf.SetTitle('Cotizacion Odontologia Integral - '+id);
        pdf.SetFillColor(200,200,200);

        pdf.Image('assets/img/membrete.jpg',0,0,211,298,'jpg');

        //fecha
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+10);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment(date).tz('America/Lima').format('DD-MM-YYYY')}`,0,0,'R');

        //Titulo
        pdf.SetFont('Arial','B',14);
        pdf.SetY(y+10);
        pdf.SetX(30);
        pdf.Cell(100,5,`PRESUPUESTO ODONTOLOGÍCO ${id}`,0,0,'L');

        //Datos del paciente
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(20,5,`PACIENTE:`,0,0,'L');
        pdf.SetFont('Arial','',10);
        pdf.SetY(y+30);
        pdf.SetX(30);
        pdf.Cell(100,5,`${clinicHistory.name} ${clinicHistory.lastNameFather} ${clinicHistory.lastNameMother}`,0,0,'L');
        pdf.SetY(y+30);
        pdf.SetX(10);
        pdf.Cell(190,5,`${moment().tz('America/Lima').diff(clinicHistory.birthdate,'years')} años`,0,0,'R');

        //Linea
        pdf.Line(10,(y+35),200,(y+35));

        //Valores
        pdf.SetFont('Arial','B',10);
        pdf.SetY(y+40);
        pdf.SetX(10);
        pdf.Cell(20,5,`TRATAMIENTO DE ODONTOLOGÍA INTEGRAL`,0,0,'L');

        //Detalle
        pdf.SetFont('Arial','',10);
        var total_sol: number = 0;
        var total_usd: number = 0;
        var formatter = new Intl.NumberFormat('en-US',{ minimumFractionDigits: 2 });
        detail.forEach( (it: QuotationDetail) => {
            if(it.coin.id === 1){
                pdf.SetY(y+50);
                pdf.SetX(10);
                pdf.Cell(20,5,`${it.quantity} ${it.tariff.name}`,0,0,'L');

                pdf.SetY(y+50);
                pdf.SetX(10);
                pdf.Cell(190,5,`${it.coin.code} ${formatter.format(it.total)}`,0,0,'R');
                total_sol += it.total;
                y += 5;
            }
        });

        //Total
        if(total_sol > 0){
            pdf.Line(10,(y+55),200,(y+55));
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+55);
            pdf.SetX(10);
            pdf.Cell(20,5,`PRESUPUESTO TOTAL S/`,0,0,'L');
            pdf.SetY(y+55);
            pdf.SetX(10);
            pdf.Cell(190,5,`S/ ${formatter.format(total_sol)}`,0,0,'R');
            y += 25
        }

        pdf.SetFont('Arial','',10);
        data.detail.forEach( (it: QuotationDetail) => {
            if(it.coin.id === 2){
                pdf.SetY(y+50);
                pdf.SetX(10);
                pdf.Cell(20,5,`${it.quantity} ${it.tariff.name}`,0,0,'L');

                pdf.SetY(y+50);
                pdf.SetX(10);
                pdf.Cell(190,5,`${it.coin.code} ${formatter.format(it.total)}`,0,0,'R');
                total_usd += it.total
                y += 5;
            }
        });

        if(total_usd > 0){
            pdf.Line(10,(y+55),200,(y+55));
            pdf.SetFont('Arial','B',10);
            pdf.SetY(y+55);
            pdf.SetX(10);
            pdf.Cell(20,5,`PRESUPUESTO TOTAL $`,0,0,'L');
            pdf.SetY(y+55);
            pdf.SetX(10);
            pdf.Cell(190,5,`$ ${formatter.format(total_usd)}`,0,0,'R');
        }

        /** Odontograma */
        if(odontograma){

            /** CUSTON */
            const rx = 5;
            const ry = 3;
            const lx = (4/3)*(Math.sqrt(2)-1)*rx;
            const ly = (4/3)*(Math.sqrt(2)-1)*ry;
            pdf.SetY(y+80);
            pdf.SetX(40);
            const k = pdf.k;
            const h = pdf.h;
            const x2 = 15;
            //pdf.Cell(5,5,`lx ${((h-((y+30)-ry))*k).toFixed(2)}`,0,0,'C',0);
            // 1 ${((x2+rx)*k).toFixed(2)}
            // 2 ${((h-(y+35))*k).toFixed(2)}
            // 3 ${((x2+rx)*k).toFixed(2)} abre
            // 4 ${((h-((y+65)-ly))*k).toFixed(2)}
            // 5 ${((x2+lx)*k).toFixed(2)}
            // 6 ${((h-(y-ry))*k).toFixed(2)}
            // 7 ${(x2*k).toFixed(2)} abre 2
            // 8 ${((h-((y+30)-ry))*k).toFixed(2)}
            //pdf.SetXY(15,100);
            //pdf._out(`${45} ${505} ${56} ${500} ${40} ${580} ${32} ${505} c`);
            /** END CUSTOM */
            const { name } = odontograma;
            const odonto = JSON.parse(name);

            // titulo del odontogram
            pdf.SetTextColor(255,255,255);
            pdf.SetY(y+85);
            pdf.SetX(10);
            pdf.Cell(190,5,`Odontograma`,1,0,'C',1);
            // borde del odontogram
            pdf.SetY(y+90);
            pdf.SetX(10);
            pdf.Cell(190,65,``,1);
            // linea horizontal
            pdf.Line(10,(y+122),200,(y+122));
            // linea vertical
            pdf.Line(102,(y+90),102,(y+155));

            pdf.SetTextColor(0,0,0);
            pdf.SetFillColor(244,244,244);
            /** teeth 1 and 2 */
            const teeth1 = odonto[0].teeth.reverse();
            let x = 15;
            pdf.SetFont('Arial','',8);
            let bg = 0;
            teeth1.map( (tee: any) => {
                // console.log({tee});
                pdf.SetY(y+91);
                pdf.SetX(x-2);
                pdf.Cell(5,5,`1${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// blue
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+99);
                pdf.SetX(x-4);
                pdf.Cell(3,4,'',1,0,'C',bg);
                // top
                bg = 0;
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+96);
                pdf.SetX(x-1);
                pdf.Cell(4,3,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+99);
                pdf.SetX(x-1);
                pdf.Cell(4,4,'',1,0,'C',1);
                // right
                bg = 0;
                if(tee.r.state){
                    switch(tee.r.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+99);
                pdf.SetX(x+3);
                pdf.Cell(3,4,'',1,0,'C',0);
                // button
                bg = 0;
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+103);
                pdf.SetX(x-1);
                pdf.Cell(4,3,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            const teeth2 = odonto[1].teeth;
            x = 110;
            teeth2.map( (tee: any) => {
                pdf.SetY(y+91);
                pdf.SetX(x-1);
                pdf.Cell(5,5,`2${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+99);
                pdf.SetX(x-4);
                pdf.Cell(3,4,'',1,0,'C',bg);
                // top
                bg = 0;
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+96);
                pdf.SetX(x-1);
                pdf.Cell(4,3,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+99);
                pdf.SetX(x-1);
                pdf.Cell(4,4,'',1,0,'C',1);
                // right
                bg = 0;
                if(tee.r.state){
                    switch(tee.r.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+99);
                pdf.SetX(x+3);
                pdf.Cell(3,4,'',1,0,'C',0);
                // button
                bg = 0;
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+103);
                pdf.SetX(x-1);
                pdf.Cell(4,3,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            /** teeth 5 and 6 */
            const teeth5 = odonto[4].teeth.reverse();
            x = 46;
            teeth5.map( (tee: any) => {
                pdf.SetY(y+110);
                pdf.SetX(x);
                pdf.Cell(3,3,`5${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+115);
                pdf.SetX(x-2);
                pdf.Cell(2,3,'',1,0,'C',0);
                // top
                bg = 0;
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+113);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+115);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                // right
                bg = 0;
                if(tee.r.state){
                    switch(tee.r.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+115);
                pdf.SetX(x+3);
                pdf.Cell(2,3,'',1,0,'C',0);
                // button
                bg = 0;
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+118);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            const teeth6 = odonto[5].teeth;
            x = 111;
            teeth6.map( (tee: any) => {
                pdf.SetY(y+110);
                pdf.SetX(x);
                pdf.Cell(3,3,`6${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+115);
                pdf.SetX(x-2);
                pdf.Cell(2,3,'',1,0,'C',0);
                // top
                bg = 0;
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+113);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+115);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                // right
                bg = 0;
                if(tee.r.state){
                    switch(tee.r.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+115);
                pdf.SetX(x+3);
                pdf.Cell(2,3,'',1,0,'C',0);
                // button
                bg = 0;
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+118);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            /** teeth 8 and 7 */
            const teeth8 = odonto[7].teeth.reverse();
            x = 46;
            teeth8.map( (tee: any) => {
                pdf.SetY(y+125);
                pdf.SetX(x);
                pdf.Cell(3,3,`8${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+130);
                pdf.SetX(x-2);
                pdf.Cell(2,3,'',1,0,'C',0);
                // top
                bg = 0;
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+128);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+130);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                // right
                bg = 0;
                if(tee.r.state){
                    switch(tee.r.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+130);
                pdf.SetX(x+3);
                pdf.Cell(2,3,'',1,0,'C',0);
                // button
                bg = 0;
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+133);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            const teeth7 = odonto[6].teeth;
            x = 111;
            teeth7.map( (tee: any) => {
                pdf.SetY(y+125);
                pdf.SetX(x);
                pdf.Cell(3,3,`7${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+130);
                pdf.SetX(x-2);
                pdf.Cell(2,3,'',1,0,'C',0);
                // top
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+128);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+130);
                pdf.SetX(x);
                pdf.Cell(3,3,'',1,0,'C',1);
                // right
                pdf.SetY(y+130);
                pdf.SetX(x+3);
                pdf.Cell(2,3,'',1,0,'C',0);
                // button
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+133);
                pdf.SetX(x);
                pdf.Cell(3,2,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            /** teeth 4 and 3 */
            const teeth4 = odonto[3].teeth.reverse();
            x = 14;
            pdf.SetFont('Arial','',8);
            teeth4.map( (tee: any) => {
                pdf.SetY(y+137);
                pdf.SetX(x-1);
                pdf.Cell(5,5,`4${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+145);
                pdf.SetX(x-3);
                pdf.Cell(3,4,'',1,0,'C',0);
                // top
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+142);
                pdf.SetX(x);
                pdf.Cell(4,3,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+145);
                pdf.SetX(x);
                pdf.Cell(4,4,'',1,0,'C',1);
                // right
                pdf.SetY(y+145);
                pdf.SetX(x+4);
                pdf.Cell(3,4,'',1,0,'C',0);
                // button
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+149);
                pdf.SetX(x);
                pdf.Cell(4,3,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            const teeth3 = odonto[2].teeth;
            x = 109;
            teeth3.map( (tee: any) => {
                pdf.SetY(y+137);
                pdf.SetX(x-1);
                pdf.Cell(5,5,`3${tee.id}`,0,0,'C',0);

                // left
                bg = 0;
                if(tee.l.state){
                    switch(tee.l.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+145);
                pdf.SetX(x-3);
                pdf.Cell(3,4,'',1,0,'C',0);
                // top
                if(tee.t.state){
                    switch(tee.t.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+142);
                pdf.SetX(x);
                pdf.Cell(4,3,'',1,0,'C',bg);
                // center
                bg = 0;
                pdf.SetFillColor(244,244,244);
                if(tee.c.state){
                    switch(tee.c.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+145);
                pdf.SetX(x);
                pdf.Cell(4,4,'',1,0,'C',1);
                // right
                pdf.SetY(y+145);
                pdf.SetX(x+4);
                pdf.Cell(3,4,'',1,0,'C',0);
                // button
                if(tee.b.state){
                    switch(tee.b.toothStatus){
                        case 1:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 2:
                            pdf.SetFillColor(0,123,255);// blue
                            bg = 1;
                            break;
                        case 7:
                            pdf.SetFillColor(220,53,69);// red
                            bg = 1;
                            break;
                        case 10:
                            pdf.SetFillColor(255,255,162);// yellow
                            bg = 1;
                            break;
                        case 15:
                            pdf.SetFillColor(82,85,88);// yellow
                            bg = 1;
                            break;
                        default:
                            pdf.SetFillColor(244,244,244);
                            bg = 0;
                    }
                }
                pdf.SetY(y+149);
                pdf.SetX(x);
                pdf.Cell(4,3,'',1,0,'C',bg);

                bg = 0;
                pdf.SetFillColor(244,244,244);
                x+=11;
            });

            pdf.SetFillColor(200,200,200);
        }
        /** Fin odontograma */
        pdf.Line(130,250,180,250);
        pdf.SetFont('Arial','',9);
        pdf.SetY(250);
        pdf.SetX(130);
        pdf.Cell(50,5,`Dr(a). ${data.doctor.nameQuote}`,0,0,'C');
        if(data.doctor.cop > 0){
            pdf.SetY(253);
            pdf.SetX(130);
            pdf.Cell(50,5,`COP: ${data.doctor.cop}`,0,0,'C');
        }
        pdf.SetFont('Arial','',10);
        pdf.SetY(250);
        pdf.SetX(10);
        pdf.Cell(15,5,`VALIDO POR 30 DÍAS`);

        pdf.SetFont('Arial','',7);
        pdf.SetY(260);
        pdf.SetX(10);
        pdf.Cell(15,5,`Fecha de impresión ${moment().tz('America/Lima').format('DD-MM-YYYY HH:mm:ss')}`);

        const nameFile: string = `quotation-oi-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/quotation/${nameFile}`);
        let response = {link: `pdf/quotation/${nameFile}`}
        return response;
    }
}