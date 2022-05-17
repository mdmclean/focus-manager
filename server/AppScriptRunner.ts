import { Updater } from "./DailyUpdater"
import { NextActionsDAL } from "./DAL/NextActionsDAL";
import { RecurringActionDAL } from "./DAL/RecurringActionDAL";

// entry point for Google App Script

function RunDailyUpdater(){
    Updater.DailyUpdater(new NextActionsDAL(), new RecurringActionDAL());
}