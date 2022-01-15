function DailyNextActionDisplayUpdater() {
  var nextActions = NextActionsDAL.GetRows();
  UpdatePriorities(nextActions, 0.1);
  ShowTopFivePriorities (nextActions);
}

function UpdatePriorities(nextActions:NextAction[], decayRate : number) {

  const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);

  for (var i = 0; i < nextActions.length; i++) {
    if (nextActions[i].lastUpdated < yesterday)
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
  let workCount = 0;
  let homeCount = 0;
  
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
