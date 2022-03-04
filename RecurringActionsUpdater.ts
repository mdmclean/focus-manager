import { DateAccessor } from "./DAL/DateAccessor";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";
import { RecurringActionDAL } from "./DAL/RecurringEventDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";
import { RecurringAction } from "./Models/Sheets/RecurringAction";

export module RecurringActionUpdater {

  export function AddRecurringActions(naAccessor: INextActionDataAccessor) {
    let recurringActions: RecurringAction[] = RecurringActionDAL.GetRows();

    recurringActions.forEach((row) => {
      if (row.nextOccurrence < DateAccessor.Today()) {

        let newAction: NextAction = NextActionHelper.CreateActionWithDefaults(row.name, row.description, row.priority, row.childOf, row.targetTheme, row.points);
        naAccessor.AddRow(newAction);
        row.nextOccurrence = DateAccessor.GetDateXDaysFromNow(row.frequencyInDays);
        RecurringActionDAL.Update(row);
      }
    }
    )
  }
}