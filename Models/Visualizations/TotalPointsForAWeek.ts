import { Focus } from "../Sheets/Focus";

export class TotalPointsForAWeek {
    year:number;
    week:number;
    pointsByFocus:PointsByFocus[];

    constructor(year:number, week:number) {
        this.year = year;
        this.week = week;
        this.pointsByFocus = new Array<PointsByFocus>();
    }
}

export class PointsByFocus {
    focus:Focus;
    points:number;

    constructor(focus:Focus, points:number) {
        this.focus = focus;
        this.points = points;
    }
}