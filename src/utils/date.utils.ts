var moment = require('moment-timezone');
export const getMonthName = (month: number): string => {
    let nameMonth = '';
    switch (month) {
        case 1:
            nameMonth = 'Enero';
            break;
        case 2:
            nameMonth = 'Febrero';
            break;
        case 3:
            nameMonth = 'Marzo';
            break;
        case 4:
            nameMonth = 'Abril';
            break;
        case 5:
            nameMonth = 'Mayo';
            break;
        case 6:
            nameMonth = 'Junio';
            break;
        case 7:
            nameMonth = 'Julio';
            break;
        case 8:
            nameMonth = 'Agosto';
            break;
        case 9:
            nameMonth = 'Septiembre';
            break;
        case 10:
            nameMonth = 'Octubre';
            break;
        case 11:
            nameMonth = 'Noviembre';
            break;
        case 12:
            nameMonth = 'Diciembre';
            break;

        default:
            nameMonth = 'Error en mes';
            break;
    }
    return nameMonth;
}

// Retorna la fecha larga ej. jueves, 19 de enero de 2023
export const getDateFormatLong = (date: string): string => {
    let dateFormat = '';
    const dayOfWeek = getDayString(moment(date).day());
    const month = getMonthName(moment(date).month() + 1);
    dateFormat = `${dayOfWeek}, ${moment(date).format('DD')} de ${month} de ${moment(date).format('YYYY')}`;
    return dateFormat;
}

export const getDayString = (day: number): string => {
    let dayStg = '';
    switch (day) {
        case 0:
            dayStg = 'domingo';
            break;
        case 1:
            dayStg = 'lunes';
            break;
        case 2:
            dayStg = 'martes';
            break;
        case 3:
            dayStg = 'miércoles';
            break;
        case 4:
            dayStg = 'jueves';
            break;
        case 5:
            dayStg = 'viernes';
            break;
        case 6:
            dayStg = 'sábado';
            break;

        default:
            break;
    }
    return dayStg;
}