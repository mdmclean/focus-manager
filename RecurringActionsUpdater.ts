import { DateAccessor } from "./DAL/DateAccessor";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";
import { IRecurringEventDataAccessor } from "./DAL/IRecurringEventDataAccessor";
import { RecurringActionDAL } from "./DAL/RecurringActionDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";
import { RecurringAction } from "./Models/Sheets/RecurringAction";

export module RecurringActionUpdater {

  export async function AddRecurringActions(naAccessor: INextActionDataAccessor, raAccessor: IRecurringEventDataAccessor) {

    let recurringActions: RecurringAction[] = raAccessor.GetRows();

    await recurringActions.forEach(async (row) => {
      if (row.nextOccurrence < DateAccessor.Today()) {

        let newAction: NextAction = NextActionHelper.CreateActionWithDefaults(row.name, row.description, row.priority, row.childOf, row.targetTheme, row.points, 5, 3);
        await naAccessor.AddRow(newAction);
        row.nextOccurrence = DateAccessor.GetDateXDaysFromNow(row.frequencyInDays);
        await raAccessor.Update(row);
      }
    }
    )
  }
}