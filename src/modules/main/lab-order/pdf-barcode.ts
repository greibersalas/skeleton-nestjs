//FPDF
const FPDF = require('node-fpdf');
import _ = require("lodash");

module.exports = class PDF_Code39 extends FPDF{

    /* constructor(){
        super();
    } */

    Code39(xpos: number, ypos: number, code: string, baseline: number = 0.5, height: number = 5){
        let wide = baseline;
        let narrow = baseline / 3 ;
        let gap = narrow;

        let barChar: any[] = [
            {index: '0', value: 'nnnwwnwnn'},
            {index: '1', value: 'wnnwnnnnw'},
            {index: '2', value: 'nnwwnnnnw'},
            {index: '3', value: 'wnwwnnnnn'},
            {index: '4', value: 'nnnwwnnnw'},
            {index: '5', value: 'wnnwwnnnn'},
            {index: '6', value: 'nnwwwnnnn'},
            {index: '7', value: 'nnnwnnwnw'},
            {index: '8', value: 'wnnwnnwnn'},
            {index: '9', value: 'nnwwnnwnn'},
            {index: 'A', value: 'wnnnnwnnw'},
            {index: 'B', value: 'nnwnnwnnw'},
            {index: 'C', value: 'wnwnnwnnn'},
            {index: 'D', value: 'nnnnwwnnw'},
            {index: 'E', value: 'wnnnwwnnn'},
            {index: 'F', value: 'nnwnwwnnn'},
            {index: 'G', value: 'nnnnnwwnw'},
            {index: 'H', value: 'wnnnnwwnn'},
            {index: 'I', value: 'nnwnnwwnn'},
            {index: 'J', value: 'nnnnwwwnn'},
            {index: 'K', value: 'wnnnnnnww'},
            {index: 'L', value: 'nnwnnnnww'},
            {index: 'M', value: 'wnwnnnnwn'},
            {index: 'N', value: 'nnnnwnnww'},
            {index: 'O', value: 'wnnnwnnwn'},
            {index: 'P', value: 'nnwnwnnwn'},
            {index: 'Q', value: 'nnnnnnwww'},
            {index: 'R', value: 'wnnnnnwwn'},
            {index: 'S', value: 'nnwnnnwwn'},
            {index: 'T', value: 'nnnnwnwwn'},
            {index: 'U', value: 'wwnnnnnnw'},
            {index: 'V', value: 'nwwnnnnnw'},
            {index: 'W', value: 'wwwnnnnnn'},
            {index: 'X', value: 'nwnnwnnnw'},
            {index: 'Y', value: 'wwnnwnnnn'},
            {index: 'Z', value: 'nwwnwnnnn'},
            {index: '-', value: 'nwnnnnwnw'},
            {index: '.', value: 'wwnnnnwnn'},
            {index: ' ', value: 'nwwnnnwnn'},
            {index: '*', value: 'nwnnwnwnn'},
            {index: '$', value: 'nwnwnwnnn'},
            {index: '/', value: 'nwnwnnnwn'},
            {index: '+', value: 'nwnnnwnwn'},
            {index: '%', value: 'nnnwnwnwn'}
        ];

        this.SetFont('Arial','',55);
        this.Text(xpos, ypos + 15 + height + 4, code);
        this.SetFillColor(0);
        code = '*'+code.toUpperCase()+'*';
        for(var i=0; i<code.length; i++){
            let char = code[i];
            //console.log(_.find(barChar,{index: char}));
            if(!_.find(barChar,{index: char})){
                this.Error('Invalid character in barcode: '+char);
            }
            let seq = _.find(barChar,{index: char}).value;
            for(var bar=0; bar<9; bar++){
                let lineWidth;
                if(seq[bar] == 'n'){
                    lineWidth = narrow;
                }else{
                    lineWidth = wide;
                }
                if(bar % 2 == 0){
                    this.Rect(xpos, ypos, lineWidth, height, 'F');
                }
                xpos += lineWidth;
            }
            xpos += gap;
        }
    }
}