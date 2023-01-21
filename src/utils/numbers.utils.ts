export const numberFormat = (val: number): string => {
    // remove sign if negative
    let sign = 1;
    if (val < 0) {
        sign = -1;
        val = -val;
    }

    // trim the number decimal point if it exists
    let num = val.toString().includes('.') ? val.toString().split('.')[0] : val.toString();

    while (/(\d+)(\d{3})/.test(num.toString())) {
        // insert comma to 4th last position to the match number
        num = num.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }

    // add number after decimal point
    if (val.toString().includes('.')) {
        const decimal = Number(val.toString().split('.')[1]);
        num = num + '.' + (decimal < 10 ? decimal.toString() + 0 : decimal);
    } else {
        num = num + '.00';
    }

    // return result with - sign if negative
    return sign < 0 ? '-' + num : num;
}