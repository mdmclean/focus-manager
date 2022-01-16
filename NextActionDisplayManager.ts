
function DailyUpdater() {
  var nextActions = NextActionsDAL.GetRows();
  AddRecurringActions();
  UpdatePriorities(nextActions, 0.1);
  ShowTopFivePriorities (nextActions);
}

function UpdatePriorities(nextActions:NextAction[], decayRate : number) {
  for (var i = 0; i < nextActions.length; i++) {
    if (nextActions[i].lastUpdated < DateAccessor.Yesterday())
    {
      NextActionsDAL.UpdatePriority(nextActions[i], nextActions[i].priority+decayRate)
    }
    else 
    {
      NextActionsDAL.UpdatePriority(nextActions[i], nextActions[i].originalPriority)

    }
  }
}


function ShowTopFivePriorities (nextActions:NextAction[])
{
  nextActions = nextActions.filter(row => row.isDone === false);
  nextActions = nextActions.sort((x, y) => x.priority - y.priority);

  UpdateTopFive(nextActions.filter(row => row.theme === "Work"));
  UpdateTopFive(nextActions.filter(row => row.theme === "Home"));

}

function UpdateTopFive(nextActions: NextAction[]) {
  for (var i = 0; i < Math.min(4, nextActions.length); i++) {
    NextActionsDAL.UpdateIsDisplayed(nextActions[i], true);
  }

  for (var k = 5; k < nextActions.length; k++) {
    NextActionsDAL.UpdateIsDisplayed(nextActions[i], false);
  }
}

function AddRecurringActions ()
{
  let recurringActions:RecurringAction[] = RecurringActionDAL.GetRows();

  recurringActions.forEach((row) => {
      if (row.nextOccurrence < DateAccessor.Today())
      {
        NextActionsDAL.AddRow(row.name, row.description, row.priority, row.childOf, row.targetTheme, row.points);
        RecurringActionDAL.UpdateNextOccurrence(row, DateAccessor.GetDateXDaysFromNow(row.frequencyInDays));
      }
    }
  )
}



