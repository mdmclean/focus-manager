
import { NextAction } from "./Models/Sheets/NextAction";
import { NextActionsDAL } from "./DAL/NextActionsDAL";
import { DateAccessor } from "./DAL/DateAccessor";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";

function DailyUpdater() {

  let nextActionsAccessor:INextActionDataAccessor = new NextActionsDAL();

  AddRecurringActions(nextActionsAccessor);


  var nextActions = nextActionsAccessor.GetRows();
  UpdateDisplayOrder(nextActions.filter(row => row.theme === "Home"), nextActionsAccessor);
  UpdateDisplayOrder(nextActions.filter(row => row.theme === "Work"), nextActionsAccessor);
}

function UpdateDisplayOrder(nextActions:NextAction[], naAccessor:INextActionDataAccessor) {

  nextActions = nextActions.filter(row => row.isDone === false);
  nextActions = nextActions.sort((x, y) => x.orderingWeightingScore - y.orderingWeightingScore);

  for (var i = 0; i < nextActions.length; i++) {
      nextActions[i].displayOrder = i+1; // 1 index order
      naAccessor.Update(nextActions[i]);
  }
}


function AddRecurringActions (naAccessor:INextActionDataAccessor)
{
  let recurringActions:RecurringAction[] = RecurringActionDAL.GetRows();

  recurringActions.forEach((row) => {
      if (row.nextOccurrence < DateAccessor.Today())
      {
        naAccessor.AddRow(row.name, row.description, row.priority, row.childOf, row.targetTheme, row.points);
        row.nextOccurrence = DateAccessor.GetDateXDaysFromNow(row.frequencyInDays);
        RecurringActionDAL.Update(row);
      }
    }
  )
}



