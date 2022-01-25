module DateHelper {
    export function DaysBetween (dateOne:Date, dateTwo:Date) : number
    {
        const oneDay = 1000 * 60 * 60 * 24;

        return Math.abs(Math.round(dateOne.getTime() - dateTwo.getTime()) / (oneDay));
    }
}