export module DateHelper {
    export function DaysBetween (dateOne:Date, dateTwo:Date) : number
    {
        const oneDay = 1000 * 60 * 60 * 24;

        return Math.abs(Math.round(dateOne.getTime() - dateTwo.getTime()) / (oneDay));
    }

    export function IsDateValid(dateToTest:Date) : boolean
    {
        return dateToTest !== null && dateToTest !== undefined && dateToTest instanceof Date && !isNaN(dateToTest.getTime());
    }
}