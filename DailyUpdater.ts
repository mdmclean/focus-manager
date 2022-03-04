
import { NextAction } from "./Models/Sheets/NextAction";
import { DateAccessor } from "./DAL/DateAccessor";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";


export module Updater {
  export async function DailyUpdater(nextActionsAccessor:INextActionDataAccessor) {

    var nextActions = await nextActionsAccessor.GetRows();


    nextActions = CheckBlockingRelationships(nextActions);
    nextActions = AddBlockedByFromBlocks(nextActions);

    nextActions = UpdateDisplayOrder(nextActions, "Home");
    nextActions = UpdateDisplayOrder(nextActions, "Work");

    await CommitChanges(nextActionsAccessor, nextActions);
  }

  function UpdateDisplayOrder(nextActions: NextAction[], targetTheme: string): NextAction[] {

    let actionsToOrder = nextActions.filter(row => row.isDone === false && row.theme === targetTheme);
    actionsToOrder = actionsToOrder.sort((x, y) => x.orderingWeightingScore - y.orderingWeightingScore);

    for (var i = 0; i < actionsToOrder.length; i++) {
      nextActions.find((row) => row.id === actionsToOrder[i].id).displayOrder = i + 1; // 1 index display order   
    }

    return nextActions
  }


  export function CheckBlockingRelationships(nextActions: NextAction[]): NextAction[] {
    nextActions.forEach((row) => {
      if (row.blockedBy !== "") {
        let blockingAction = nextActions.find(na => na.id === row.blockedBy);

        if (blockingAction !== undefined) {
          if (blockingAction.isDone === true) {
            row.blockedBy = "";
          }
        }
        else {
          row.blockedBy = "";
        }
      }
    })

    return nextActions;
  }

  export function AddBlockedByFromBlocks(nextActions: NextAction[]): NextAction[] {
    nextActions.forEach((row) => {
      if (row.isDone === false && row.blocks !== "") {
        let actionThisBlocks = nextActions.find(na => na.id === row.blocks);

        if (actionThisBlocks !== undefined) {
          actionThisBlocks.blockedBy = row.id;
        }
      }
    })

    return nextActions;
  }

  async function CommitChanges(nextActionsAccessor: INextActionDataAccessor, nextActions: NextAction[]) {
    for (var i = 0; i < nextActions.length; i++) {
      await nextActionsAccessor.Update(nextActions[i]);
    }

  }
}
