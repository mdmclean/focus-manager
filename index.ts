import { Updater } from "./DailyUpdater";
import { NextActionsSheetsAPIDAL } from "./DAL/NextActionsSheetsAPIDAL";

export async function CloudFunctionTest (req, res) {
    Updater.DailyUpdater(new NextActionsSheetsAPIDAL());
    res.status(200).send("OK");
}