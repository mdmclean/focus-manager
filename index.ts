import { Updater } from "./DailyUpdater";
import { NextActionsSheetsAPIDAL } from "./DAL/NextActionsSheetsAPIDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";

export async function CloudFunctionTest (req, res) {
    switch (req.method) { 
        case 'GET':
            Updater.DailyUpdater(new NextActionsSheetsAPIDAL());
            break;
        case 'POST':
            let actionAccessor = new NextActionsSheetsAPIDAL();
            let newAction:NextAction = NextActionHelper.CreateActionWithDefaults(req.body.name,
                req.body.description,req.body.priority,req.body.childOf,req.body.theme,req.body.points);
            await actionAccessor.AddRow(newAction);
        default:
            break;
    }
    res.status(200).send("OK");
}