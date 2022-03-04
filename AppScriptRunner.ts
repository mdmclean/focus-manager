import { Updater } from "./DailyUpdater"
import { NextActionsDAL } from "./DAL/NextActionsDAL";
import { RecurringActionUpdater } from "./RecurringActionsUpdater";

// entry point for Google App Script

function RunDailyUpdater(){
    Updater.DailyUpdater(new NextActionsDAL());
    RecurringActionUpdater.AddRecurringActions(new NextActionsDAL());
}