import { DateAccessor } from "./DAL/DateAccessor";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";
import { IRecurringEventDataAccessor } from "./DAL/IRecurringEventDataAccessor";
import { RecurringActionDAL } from "./DAL/RecurringActionDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";
import { RecurringAction } from "./Models/Sheets/RecurringAction";

export module RecurringActionUpdater {

  export async function AddRecurringActions(naAccessor: INextActionDataAccessor, raAccessor: IRecurringEventDataAccessor, existingNextActions: NextAction[]): Promise<void> {

    let recurringActions: RecurringAction[] = await raAccessor.GetRows();

    await recurringActions.forEach(async (row) => {
      if (row.nextOccurrence < DateAccessor.Today()) {

        let newAction: NextAction = NextActionHelper.CreateActionWithDefaults(row.name, row.description, row.priority, row.childOf, row.targetTheme, row.points, row.priority, row.priority, "Triage", row.wellBeing, "Recurring");
        let exsitingRecurringAction:NextAction = existingNextActions.find(na => na.isDone === false && na.name === newAction.name && na.theme === newAction.theme);

        if (exsitingRecurringAction === undefined) {
          await naAccessor.AddRow(newAction);
          row.countOfMissedOccurrences = 0;
        }
        else {
          exsitingRecurringAction.urgency += 1; // increase urgency since this hasn't been done for multiple cycles in a row 
          exsitingRecurringAction.description += "* urgency raise on " + DateAccessor.Today().toDateString();
          await naAccessor.Update(exsitingRecurringAction);
          row.countOfMissedOccurrences += 1;
        }

        row.nextOccurrence = DateAccessor.GetDateXDaysFromNow(row.frequencyInDays);
        await raAccessor.Update(row);
      }
    }
    )
  }
}