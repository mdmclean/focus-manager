export class TotalPointsForAWeek {
    year:number;
    week:number;
    totalPoints:number;

    constructor(year:number, week:number, totalPoints:number) {
        this.year = year;
        this.week = week;
        this.totalPoints = totalPoints;
    }
}