
import { NextAction } from "./Models/Sheets/NextAction";
import { NextActionsDAL } from "./DAL/NextActionsDAL";
import { DateAccessor } from "./DAL/DateAccessor";

function DailyUpdater() {
  AddRecurringActions();

  var nextActions = NextActionsDAL.GetRows();
  UpdateDisplayOrder(nextActions.filter(row => row.theme === "Home"));
  UpdateDisplayOrder(nextActions.filter(row => row.theme === "Work"));
}

function UpdateDisplayOrder(nextActions:NextAction[]) {

  nextActions = nextActions.filter(row => row.isDone === false);
  nextActions = nextActions.sort((x, y) => x.orderingWeightingScore - y.orderingWeightingScore);

  for (var i = 0; i < nextActions.length; i++) {
      nextActions[i].displayOrder = i+1; // 1 index order
      NextActionsDAL.Update(nextActions[i]);
  }
}


function AddRecurringActions ()
{
  let recurringActions:RecurringAction[] = RecurringActionDAL.GetRows();

  recurringActions.forEach((row) => {
      if (row.nextOccurrence < DateAccessor.Today())
      {
        NextActionsDAL.AddRow(row.name, row.description, row.priority, row.childOf, row.targetTheme, row.points);
        row.nextOccurrence = DateAccessor.GetDateXDaysFromNow(row.frequencyInDays);
        RecurringActionDAL.Update(row);
      }
    }
  )
}



