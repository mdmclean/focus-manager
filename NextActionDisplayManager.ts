
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
      nextActions[i].priority = nextActions[i].priority+decayRate;
      NextActionsDAL.Update(nextActions[i]);
    }
    else 
    {
      nextActions[i].priority =  nextActions[i].originalPriority;
      NextActionsDAL.Update(nextActions[i]);
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
    nextActions[i].isDiplayed = true;
    NextActionsDAL.Update(nextActions[i]);
  }

  for (var k = 5; k < nextActions.length; k++) {
    nextActions[k].isDiplayed = false;
    NextActionsDAL.Update(nextActions[k]);
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



