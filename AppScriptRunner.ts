import { Updater } from "./DailyUpdater"
import { NextActionsDAL } from "./DAL/NextActionsDAL";

// entry point for Google App Script

function RunDailyUpdater(){
    Updater.DailyUpdater(new NextActionsDAL());
}