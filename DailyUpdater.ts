
function DailyUpdater() {
  AddRecurringActions();

  var nextActions = NextActionsDAL.GetRows();
  UpdateDisplayOrder(nextActions.filter(row => row.theme === "Home"));
  UpdateDisplayOrder(nextActions.filter(row => row.theme === "Work"));
}

function UpdateDisplayOrder(nextActions:NextAction[]) {

  nextActions = nextActions.filter(row => row.isDone === false);
  nextActions = nextActions.sort((x, y) => PrioritizationWeighting(x) - PrioritizationWeighting(y));

  for (var i = 0; i < nextActions.length; i++) {
      nextActions[i].displayOrder = i+1; // 1 index order
      NextActionsDAL.Update(nextActions[i]);
  }
}

function PrioritizationWeighting(action:NextAction) : number
{
  let daysSinceUpdated = DateHelper.DaysBetween(DateAccessor.Today(), action.lastUpdated);

  return daysSinceUpdated + action.displayOrder + 10 * action.priority;
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



