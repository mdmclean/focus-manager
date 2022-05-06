import { Updater } from "./DailyUpdater";
import { FocusSheetsAPIDAL } from "./DAL/FocusSheetsAPIDAL";
import { GoogleSheetsClient } from "./DAL/GoogleSheetsClient";
import { NextActionsSheetsAPIDAL } from "./DAL/NextActionsSheetsAPIDAL";
import { RecurringActionSheetsAPIDAL } from "./DAL/RecurringActionSheetsAPIDAL";
import { SendGridDAL } from "./DAL/SendGridDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";
import { WeeklySummary } from "./WeeklySummary";
import jwtDecode from "jwt-decode";

export async function CloudFunctionTest(req, res) {

    let sheetsClientBuilder = new GoogleSheetsClient();
    let authenticatedSheetsClient = sheetsClientBuilder.GetAuthenticatedAPIObject();
    let nextActionsAccessor = new NextActionsSheetsAPIDAL(authenticatedSheetsClient);
    let recurringActionsAccessor = new RecurringActionSheetsAPIDAL(authenticatedSheetsClient);
    let focusAccessor = new FocusSheetsAPIDAL(authenticatedSheetsClient);

    const callerDetails:any = jwtDecode(req.headers.authorization);
    console.log(`Called by ${callerDetails.email}`)
    switch (req.method) {
        case 'POST':
            if (req.body.function === "DailyUpdater") {
                Updater.DailyUpdater(nextActionsAccessor, recurringActionsAccessor);
            }
            else if (req.body.function === "WeeklySummary") {
                let summaryHtml = await WeeklySummary.RunWeeklySummary(nextActionsAccessor, focusAccessor);
                let sendGridDAL = new SendGridDAL();
                await sendGridDAL.SendEmail("Weekly Summary", summaryHtml);
            }
            else if (req.body.function === "AddAction") {
                let newAction: NextAction = NextActionHelper.CreateActionWithDefaults(req.body.name,
                    req.body.description, req.body.priority, req.body.childOf, req.body.theme, req.body.points, req.body.urgency, req.body.importance, req.body.state);
                await nextActionsAccessor.AddRow(newAction);
            }
            else
            {
                console.log(`incorrect procedure call - ${req.body.function}`);
            }
            break; 
        default:
            console.log(`incorrect method call - ${req.method}`);
            break;
    }
    res.status(200).send("OK");
}