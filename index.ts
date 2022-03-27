import { Updater } from "./DailyUpdater";
import { GoogleSheetsClient } from "./DAL/GoogleSheetsClient";
import { NextActionsSheetsAPIDAL } from "./DAL/NextActionsSheetsAPIDAL";
import { RecurringActionSheetsAPIDAL } from "./DAL/RecurringActionSheetsAPIDAL";
import { SendGridDAL } from "./DAL/SendGridDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";
import { WeeklySummary } from "./WeeklySummary";

export async function CloudFunctionTest(req, res) {

    let sheetsClientBuilder = new GoogleSheetsClient();
    let authenticatedSheetsClient = sheetsClientBuilder.GetAuthenticatedAPIObject();
    let nextActionsAccessor = new NextActionsSheetsAPIDAL(authenticatedSheetsClient);
    let recurringActionsAccessor = new RecurringActionSheetsAPIDAL(authenticatedSheetsClient);

    switch (req.method) {
        case 'POST':
            if (req.body.function === "DailyUpdater") {
                Updater.DailyUpdater(nextActionsAccessor, recurringActionsAccessor);
            }
            else if (req.body.function === "WeeklySummary") {
                let summaryHtml = await WeeklySummary.RunWeeklySummary(nextActionsAccessor);
                let sendGridDAL = new SendGridDAL();
                await sendGridDAL.SendEmail("Weekly Summary", summaryHtml);
            }
            else if (req.body.function === "AddAction") {
                let newAction: NextAction = NextActionHelper.CreateActionWithDefaults(req.body.name,
                    req.body.description, req.body.priority, req.body.childOf, req.body.theme, req.body.points, req.body.urgency, req.body.importance);
                await nextActionsAccessor.AddRow(newAction);
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