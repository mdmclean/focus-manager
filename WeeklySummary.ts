//https://stackoverflow.com/questions/36178369/how-to-include-inline-images-in-email-using-mailapp
// https://stackoverflow.com/questions/9347514/sending-google-visualization-chart-to-email

import moment = require("moment");
import { NextAction } from "./Models/Sheets/NextAction";
import { NextActionsDAL } from "./DAL/NextActionsDAL"
import { TotalPointsForAWeek } from "./Models/Visualizations/TotalPointsForAWeek";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";
import { DateHelper } from "./Helpers/DateHelper"
const QuickChart = require("quickchart-js");

export module WeeklySummary {

    var myEmail = "myextraemail030@gmail.com";

    class ActionSummaryViewModel {
        name: string;
        createdDate: string;
        theme: string;
        isDone:string;
        points:string;
        targetDate:string;
        lastUpdated:string;
        deepLink:string;

        constructor(action: NextAction) {
            this.name = action.name;
            this.createdDate = action.createdDate ? action.createdDate.toDateString() : "Not Set";
            this.theme = action.theme;
            this.isDone = action.isDone ? "Done" : "Not Done";
            this.points = action.points.toString();
            this.targetDate = action.targetDate ? action.targetDate.toDateString() : "Not Set";
            this.lastUpdated = action.lastUpdated ? action.lastUpdated.toDateString() : "Not Set";
            this.deepLink = `<a href=\"https://www.appsheet.com/start/7484608b-c4e2-4cd4-a831-fd999d96aa19#appName=FocusManager-5502006&row=${action.id}&table=Next+Actions&view=Next+Actions_Detail\">Link</a>`;
        }
    }

    function HtmlTableWriter(someArrayOfObjects, columnsToInclude:string[]) {
       
        var html = '<table border=\'1\' style=\'border-collapse:collapse\'><tr>' +
        columnsToInclude.map(function (c) { return '<th>' + c + '</th>' }).join('') +
            '</tr>';
        for (var l in someArrayOfObjects) {
            html += '<tr>' +
            columnsToInclude.map(function (c) { return '<td>' + (someArrayOfObjects[l][c] || '') + '</td>' }).join('') +
                '</tr>';
        }
        html += '</table>';

        return html;
    }

    export async function RunWeeklySummary(nextActionsAccessor: INextActionDataAccessor) {
        let nextActions = await nextActionsAccessor.GetRows();

        let createdThisWeek = nextActions.filter((action) => action.createdDate > DateHelper.DaysAgo(7) && action.isDone !== true);
        let createdThisWeekViewModel = [];
        createdThisWeek.forEach((action) =>
        createdThisWeekViewModel.push(new ActionSummaryViewModel(action))
        );

        let completedThisWeek = nextActions.filter((action) => action.resolutionDate > DateHelper.DaysAgo(7) && action.isDone === true);
        let completedThisWeekViewModel = [];
        completedThisWeek.forEach((action) =>
            completedThisWeekViewModel.push(new ActionSummaryViewModel(action))
        );

        let pastDue = nextActions.filter((action) => DateHelper.IsValidDate(action.targetDate) && action.targetDate < DateHelper.CurrentTime() && action.isDone !== true);
        let pastDueViewModel = [];
        pastDue.forEach((action) =>
            pastDueViewModel.push(new ActionSummaryViewModel(action))
        );

        let staleWindow = DateHelper.DaysAgo(30);
        let stale = nextActions.filter((action) => DateHelper.IsValidDate(action.lastUpdated) && action.lastUpdated < staleWindow && action.isDone !== true);
        let staleViewModel = [];
        stale.forEach((action) =>
            staleViewModel.push(new ActionSummaryViewModel(action))
        );

        let pointsByWeek = GetTotalPointsByWeek(nextActions);
        let velocityChartUrl = GetWeeklyVelocityChart(pointsByWeek);

        let velocityChartHtml = "<img src=\"" + velocityChartUrl + "\" />"


        let html = "<html><body><h2>Created this Week</h2>" + HtmlTableWriter(createdThisWeekViewModel, ["name", "createdDate", "theme", "points", "deepLink" ])
            + "<br/><h2>Completed this Week</h2>" + HtmlTableWriter(completedThisWeekViewModel, ["name","points", "theme", "deepLink"  ])  
            + "<br/><h2>Past Due</h2>" + HtmlTableWriter(pastDueViewModel, ["name","points", "theme", "targetDate", "deepLink"  ]) +"<br/>" 
            + "<br/><h2>Stale</h2>" + HtmlTableWriter(staleViewModel, ["name","points", "theme", "lastUpdated", "deepLink" ]) +"<br/>" 
            + velocityChartHtml + "</body></html>";

        return html;
    }

    export async function GetChartWeeks(): Promise<TotalPointsForAWeek[]> {
        let nextActionsAccessor = new NextActionsDAL();
        let allNextActions: NextAction[] = await nextActionsAccessor.GetRows();

        allNextActions = allNextActions.filter(row => row.isDone === true);

        let storyPointsByWeek = GetTotalPointsByWeek(allNextActions);

        return storyPointsByWeek;
    }

    export function GetTotalPointsByWeek(nextActions: NextAction[]): TotalPointsForAWeek[] {
        let totalPointsByWeek = new Array<TotalPointsForAWeek>();

        nextActions = nextActions.filter((action) => action.isDone === true && action.resolutionDate !== undefined && action.resolutionDate !== null)

        nextActions.forEach((action) => {
            const year = moment(action.resolutionDate).year();
            const week = moment(action.resolutionDate).week();

            if (!isNaN(week)) {

                let weekIndex: number = totalPointsByWeek.findIndex((weeks) => weeks.year === year && weeks.week === week);

                if (weekIndex < 0) {
                    totalPointsByWeek.push(new TotalPointsForAWeek(year, week, action.points));
                }
                else {
                    totalPointsByWeek[weekIndex].totalPoints += action.points;
                }
            }
        });

        return totalPointsByWeek;
    }

    export function GetWeeklyVelocityChart(pointsByWeek: TotalPointsForAWeek[]) {

        pointsByWeek = pointsByWeek.sort((x, y) => (x.year + x.week) - (y.year + y.week));

        let weeklyLabels: string[] = [];
        let weeklyTotals: number[] = [];

        pointsByWeek.forEach((week) => {
            weeklyLabels.push(`Week ${week.week}`);
            weeklyTotals.push(week.totalPoints);
        });

        const weeklyVelocityChart = new QuickChart();
        weeklyVelocityChart.setConfig({
            type: 'bar',
            data: { labels: weeklyLabels, datasets: [{ label: 'Point By Week', data: weeklyTotals }] }
        })
            .setWidth(800)
            .setHeight(400)
            .setBackgroundColor('transparent');

        let chartUrl = weeklyVelocityChart.getUrl();

        return chartUrl;
    }
}