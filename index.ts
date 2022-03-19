import { Updater } from "./DailyUpdater";
import { NextActionsSheetsAPIDAL } from "./DAL/NextActionsSheetsAPIDAL";
import { SendGridDAL } from "./DAL/SendGridDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";
import { WeeklySummary } from "./WeeklySummary";

export async function CloudFunctionTest(req, res) {
    switch (req.method) {
        case 'POST':
            if (req.body.function === "DailyUpdater") {
                Updater.DailyUpdater(new NextActionsSheetsAPIDAL());
            }
            else if (req.body.function === "WeeklySummary") {
                let summaryHtml = await WeeklySummary.RunWeeklySummary(new NextActionsSheetsAPIDAL());
                let sendGridDAL = new SendGridDAL();
                await sendGridDAL.SendEmail("Weekly Summary", summaryHtml);
            }
            else if (req.body.function === "AddAction") {
                let actionAccessor = new NextActionsSheetsAPIDAL();
                let newAction: NextAction = NextActionHelper.CreateActionWithDefaults(req.body.name,
                    req.body.description, req.body.priority, req.body.childOf, req.body.theme, req.body.points, req.body.urgency, req.body.importance);
                await actionAccessor.AddRow(newAction);
            }
            else
            {
                console.log(`incorrect procedure call - ${req.body.function}`);
            }
        default:
            break;
    }
    res.status(200).send("OK");
}