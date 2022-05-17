//https://stackoverflow.com/questions/36178369/how-to-include-inline-images-in-email-using-mailapp
// https://stackoverflow.com/questions/9347514/sending-google-visualization-chart-to-email

import moment = require("moment");
import { NextAction } from "./Models/Sheets/NextAction";
import { NextActionsDAL } from "./DAL/NextActionsDAL"
import { PointsByFocus, TotalPointsForAWeek } from "./Models/Visualizations/TotalPointsForAWeek";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";
import { DateHelper } from "./Helpers/DateHelper"
import { DateAccessor } from "./DAL/DateAccessor";
import { Focus } from "./Models/Sheets/Focus";
import { IFocusDataAccessor } from "./DAL/IFocusDataAccessor";
const QuickChart = require("quickchart-js");

export module WeeklySummary {

    var myEmail = "myextraemail030@gmail.com";

    class ActionSummaryViewModel {
        name: string;
        createdDate: string;
        theme: string;
        isDone: string;
        points: string;
        targetDate: string;
        lastUpdated: string;
        deepLink: string;
        resolutionDate: string;

        constructor(action: NextAction) {
            this.name = action.name;
            this.createdDate = DateHelper.IsDateValid(action.createdDate) ? action.createdDate.toDateString() : "Not Set";
            this.theme = action.theme;
            this.isDone = action.isDone ? "Done" : "Not Done";
            this.points = action.points.toString();
            this.targetDate = DateHelper.IsDateValid(action.targetDate) ? action.targetDate.toDateString() : "Not Set";
            this.lastUpdated = DateHelper.IsDateValid(action.lastUpdated) ? action.lastUpdated.toDateString() : "Not Set";
            this.resolutionDate = DateHelper.IsDateValid(action.resolutionDate) ? action.resolutionDate.toDateString() : "Not Set";
            this.deepLink = `<a href=\"https://www.appsheet.com/start/7484608b-c4e2-4cd4-a831-fd999d96aa19#appName=FocusManager-5502006&row=${action.id}&table=Next+Actions&view=Next+Actions_Detail\">Link</a>`;
        }
    }

    function HtmlTableWriter(someArrayOfObjects, columnsToInclude: string[]) {

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

    export async function RunWeeklySummary(nextActionsAccessor: INextActionDataAccessor, focusAccessor: IFocusDataAccessor) {
        let nextActions = await nextActionsAccessor.GetRows();
        let focuses = await focusAccessor.GetRows();

        let createdThisWeek = nextActions.filter((action) => action.createdDate > DateAccessor.GetDateXDaysFromNow(-7) && action.isDone !== true);
        let createdThisWeekViewModel = [];
        createdThisWeek.forEach((action) =>
            createdThisWeekViewModel.push(new ActionSummaryViewModel(action))
        );

        let completedThisWeek = nextActions.filter((action) => action.resolutionDate > DateAccessor.GetDateXDaysFromNow(-7) && action.isDone === true);
        let completedThisWeekViewModel = [];
        completedThisWeek.forEach((action) =>
            completedThisWeekViewModel.push(new ActionSummaryViewModel(action))
        );

        let pastDue = nextActions.filter((action) => DateHelper.IsValidDate(action.targetDate) && action.targetDate < DateAccessor.Today() && action.isDone !== true);
        let pastDueViewModel = [];
        pastDue.forEach((action) =>
            pastDueViewModel.push(new ActionSummaryViewModel(action))
        );

        let staleWindow = DateAccessor.GetDateXDaysFromNow(-30);
        let stale = nextActions.filter((action) => DateHelper.IsValidDate(action.lastUpdated) && action.lastUpdated < staleWindow && action.isDone !== true);
        let staleViewModel = [];
        stale.forEach((action) =>
            staleViewModel.push(new ActionSummaryViewModel(action))
        );

        let pointsByWeek = GetTotalPointsByWeek(nextActions.filter((action) => action.resolutionDate > DateAccessor.GetDateXDaysFromNow(-56) && action.isDone === true), focuses);
        let velocityChartUrl = GetWeeklyVelocityChart(pointsByWeek);

        let velocityChartHtml = "<img src=\"" + velocityChartUrl + "\" />"


        let html = "<html><body><h2>Created (and not finished) this Week</h2>" + HtmlTableWriter(createdThisWeekViewModel, ["name", "createdDate", "theme", "points", "deepLink"])
            + "<br/><h2>Completed this Week</h2>" + HtmlTableWriter(completedThisWeekViewModel, ["name", "points", "resolutionDate", "theme", "deepLink"])
            + "<br/><h2>Weekly Velocity Chart</h2>" + velocityChartHtml + "<br/>"
            + "<br/><h2>Past Due</h2>" + HtmlTableWriter(pastDueViewModel, ["name", "points", "theme", "targetDate", "deepLink"]) + "<br/>"
            + "<br/><h2>Stale</h2>" + HtmlTableWriter(staleViewModel, ["name", "points", "theme", "lastUpdated", "deepLink"]) + "<br/>"
            + "</body></html>";

        return html;
    }

    export function GetTotalPointsByWeek(nextActions: NextAction[], focuses: Focus[]): TotalPointsForAWeek[] {
        let totalPointsByWeek = new Array<TotalPointsForAWeek>();

        nextActions = nextActions.filter((action) => action.isDone === true && action.resolutionDate !== undefined && action.resolutionDate !== null)

        nextActions.forEach((action) => {
            const year = moment(action.resolutionDate).year();
            const week = moment(action.resolutionDate).week();

            if (!isNaN(week)) {
                totalPointsByWeek = AddCompletedActionToTotalPointsByWeek(totalPointsByWeek, year, week, action, focuses);
            }

        });

        return totalPointsByWeek;
    }

    function AddCompletedActionToTotalPointsByWeek(totalPointsByWeek: TotalPointsForAWeek[], year: number, week: number, action: NextAction, focuses: Focus[]): TotalPointsForAWeek[] {
        let weekIndex: number = totalPointsByWeek.findIndex((weeks) => weeks.year === year && weeks.week === week);

        let focusToAdd = focuses.find((focus) => focus.id === action.childOf);

        if (focusToAdd === undefined) {
            focusToAdd = new Focus(`${action.theme}-blank`, `${action.theme}-blank`, "none", "n/a", 0, null, action.theme, "none", null, "none");
        }

        if (weekIndex === -1) {
            let newWeek = new TotalPointsForAWeek(year, week);
            newWeek.pointsByFocus = new Array<PointsByFocus>();

            newWeek.pointsByFocus.push(new PointsByFocus(focusToAdd, action.points));

            totalPointsByWeek.push(newWeek);
        }
        else {
            let matchingFocusIndex: number = -1;

            if (totalPointsByWeek[weekIndex].pointsByFocus) {
                matchingFocusIndex = totalPointsByWeek[weekIndex].pointsByFocus.findIndex((pointByFocusItem) => focusToAdd.id === pointByFocusItem.focus.id);
            }

            if (matchingFocusIndex === -1) {
                totalPointsByWeek[weekIndex].pointsByFocus.push(new PointsByFocus(focusToAdd, action.points));
            }
            else {
                totalPointsByWeek[weekIndex].pointsByFocus[matchingFocusIndex].points += action.points;
            }
        }

        return totalPointsByWeek;
    }

    export function GetWeeklyVelocityChart(pointsByWeek: TotalPointsForAWeek[]) {

        pointsByWeek = pointsByWeek.sort((x, y) => (x.year + x.week) - (y.year + y.week));

        let pointsByFocus = {};
        let weeklyLabels: string[] = [];


        pointsByWeek.forEach((week) => {
            weeklyLabels.push(`Week ${week.week}`);

            week.pointsByFocus.forEach((focus) => {
                if (focus.focus && focus.focus.name) {
                    if (!pointsByFocus[focus.focus.name]) {
                        pointsByFocus[focus.focus.name] = [];
                    }
                }
                else {
                    console.log(focus);
                }
            });
        });

        pointsByWeek.forEach((week) => {
            for (let focusName in pointsByFocus) {
                let focusIndex = week.pointsByFocus.findIndex((focus) => focus.focus && focus.focus.name === focusName);

                if (focusIndex === -1) {
                    pointsByFocus[focusName].push(0);
                }
                else {
                    pointsByFocus[focusName].push(week.pointsByFocus[focusIndex].points);
                }
            }
        });

        let datasets = [];


        for (let key in pointsByFocus) {
            datasets.push({
                label: key,
                data: pointsByFocus[key]
            });
        }

        let smallDataSetsToCombine: any[] = [];

        datasets.forEach((dataset) => {
            if (dataset.data.reduce((a, b) => a + b, 0) < 5) {
                smallDataSetsToCombine.push(dataset);
            }
        });

        let aggregateDataset = {
            label: "Other Focuses",
            data: []
        }

        for (let i = 0; i < weeklyLabels.length; i++) {

            let totalForWeek = 0
            for (let j = 0; j < smallDataSetsToCombine.length; j++) {
                totalForWeek += smallDataSetsToCombine[j].data[i];
            }
            aggregateDataset.data.push(totalForWeek);

            datasets.splice(datasets.indexOf(smallDataSetsToCombine[i]), 1);
        }

        datasets.push(aggregateDataset);

        datasets = datasets.sort((x, y) => y.data.reduce((a, b) => a + b, 0) - x.data.reduce((a, b) => a + b, 0));

        datasets = ColourDatasets(datasets);

        const weeklyVelocityChart = new QuickChart();
        weeklyVelocityChart.setConfig({
            type: 'bar',
            data: { labels: weeklyLabels, datasets: datasets },
            options: {
                scales: {
                    yAxes: [{ stacked: true }],
                    xAxes: [{ stacked: true }]
                },
                legend: {
                    display: true,
                    position: 'left',
                    align: 'start'
                }
            }
        })
            .setWidth(800)
            .setHeight(400)
            .setBackgroundColor('transparent');

        let chartUrl = weeklyVelocityChart.getUrl();

        return chartUrl;
    }    


    function ColourDatasets(datasets: any[]) {
        const maroonHex = "#800000";
        const brownHex = "#9A6324";
        const tealHex = "#469990";
        const navyHex = "#000075";
        const redHex = "#e6194B";
        const orangeHex = "#f58231";
        const yellowHex = "#ffe119";
        const greenHex = "#3cb44b";
        const cyanHex = "#42d4f4";
        const blueHex = "#4363d8";
        const magentaHex = "#f032e6";
        const pinkHex = "#fabed4";
        const purpleHex = "#911eb4";
        const beigeHex = "#fffac8";
        const mintHex = "#aaffc3";
        const lavendarHex = "#dcbeff";
        const oliveHex = "#808000";
        const appricotHex = "#FF69B4";
        const salmonHex = "#ffd8b1";
        const limeHex = "#bfef45";

        let colors = [maroonHex, tealHex, purpleHex, limeHex, orangeHex, navyHex, yellowHex, brownHex, redHex, greenHex, salmonHex, magentaHex, cyanHex, pinkHex, blueHex, beigeHex, lavendarHex, mintHex, appricotHex, oliveHex];

        for (let i = 0; i < datasets.length; i++) {
            datasets[i].backgroundColor = colors[i % colors.length];
        }

        return datasets;
    }
}


