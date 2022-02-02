//https://stackoverflow.com/questions/36178369/how-to-include-inline-images-in-email-using-mailapp
// https://stackoverflow.com/questions/9347514/sending-google-visualization-chart-to-email

const QuickChart = require("quickchart-js");
import moment = require("moment");
import { NextAction } from "./Models/Sheets/NextAction";
import { NextActionsDAL } from "./DAL/NextActionsDAL"
import { TotalPointsForAWeek } from "./Models/Visualizations/TotalPointsForAWeek";

export module Graphs {

    var myEmail = "myextraemail030@gmail.com";

    /**
     * Example of sending an HTML email message with inline images.
     * From: http://stackoverflow.com/a/37688529/1677912
     */

    export function GetChartWeeks(): TotalPointsForAWeek[] {
        let allNextActions:NextAction[] = NextActionsDAL.GetRows();

        allNextActions = allNextActions.filter(row => row.isDone === true);

        let storyPointsByWeek = GetTotalPointsByWeek(allNextActions);

        return storyPointsByWeek;
    }

    export function GetTotalPointsByWeek(allNextActions: NextAction[]) : TotalPointsForAWeek[] {
        let totalPointsByWeek = new Array<TotalPointsForAWeek>();

         allNextActions.forEach((action) => {
            const year = moment(action.resolutionDate).year();
            const week = moment(action.resolutionDate).week();

            let weekIndex:number = totalPointsByWeek.findIndex((weeks) => weeks.year === year && weeks.week === week);

            if (weekIndex < 0)
            {
                totalPointsByWeek.push(new TotalPointsForAWeek(year, week, action.points));
            }
            else {
                totalPointsByWeek[weekIndex].totalPoints += action.points;
            }
        });

        return totalPointsByWeek;
    }

    export function GetWeeklyVelocityChart(pointsByWeek:TotalPointsForAWeek[]) {

        pointsByWeek = pointsByWeek.sort((x, y) => (x.year+x.week) - (y.year+y.week));

        let weeklyLabels:string[] = [];
        let weeklyTotals:number[] = [];

        pointsByWeek.forEach((week) => {
            weeklyLabels.push(`${week.year}-${week.week}`);
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

    function sendInlineImages() {
        var mailaddress = myEmail;
        var subject = "test inline images";
        var bodyNL = "This is <B>DUTCH</B> text.";

        // var options = {
        //     'method': 'post',
        //     'contentType': 'application/json',
        //     'payload': JSON.stringify(
        //         {
        //             'chart': {
        //                 'type': 'bar', 'data': {
        //                     'labels': ['Hello', 'World'],
        //                     'datasets': [{ 'label': 'Foo', 'data': [1, 2] }]
        //                 }
        //             }
        //         }
        //     )
        // }

        //"https://quickchart.io/chart", options

        let pointsByWeek = GetChartWeeks();

        var imageTest = UrlFetchApp.fetch(GetWeeklyVelocityChart(pointsByWeek)).getBlob().setName("MyChart");

        // Prepend embeded image tags for email
        bodyNL = "<img src='cid:superduper' style='width:800px; height:400px;'/>" + bodyNL;

        // Send message with inlineImages object, matching embedded tags.
        MailApp.sendEmail(mailaddress, subject, "",
            {
                htmlBody: bodyNL,
                inlineImages:
                {
                    superduper: imageTest,
                }
            });
    }
}

require ('./WeeklySummary.ts')