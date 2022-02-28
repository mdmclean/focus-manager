import moment = require("moment");

export module DateHelper {
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
    export function DaysBetween (dateOne:Date, dateTwo:Date) : number
    {

        return Math.abs(Math.round(dateOne.getTime() - dateTwo.getTime()) / (oneDayInMilliseconds));
    }

    export function IsDateValid(dateToTest:Date) : boolean
    {
        return dateToTest !== null && dateToTest !== undefined && dateToTest instanceof Date && !isNaN(dateToTest.getTime());
    }

    export function DaysAgo(daysAgo:number) : Date
    {
        return moment().subtract(7, 'd').toDate();
    }
}