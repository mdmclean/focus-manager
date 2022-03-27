
import { NextAction } from "./Models/Sheets/NextAction";
import { DateAccessor } from "./DAL/DateAccessor";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";
import { DateHelper } from "./Helpers/DateHelper";
import { IRecurringEventDataAccessor } from "./DAL/IRecurringEventDataAccessor";
import { RecurringActionSheetsAPIDAL } from "./DAL/RecurringActionSheetsAPIDAL";
import { RecurringActionUpdater } from "./RecurringActionsUpdater";


export module Updater {
  export async function DailyUpdater(nextActionsAccessor: INextActionDataAccessor, recurringActionAccessor: IRecurringEventDataAccessor) {

    var nextActions = await nextActionsAccessor.GetRows();

    nextActions = CheckBlockingRelationships(nextActions);
    nextActions = AddBlockedByFromBlocks(nextActions);

    nextActions = UpdateDisplayOrder(nextActions, "Home");
    nextActions = UpdateDisplayOrder(nextActions, "Work");

    await CommitChanges(nextActionsAccessor, nextActions);

    // update recurring actions
    await RecurringActionUpdater.AddRecurringActions(nextActionsAccessor, recurringActionAccessor);
  }

  function UpdateDisplayOrder(nextActions: NextAction[], targetTheme: string): NextAction[] {

    let actionsToOrder = nextActions.filter(row => row.isDone === false && row.theme === targetTheme);
    actionsToOrder = actionsToOrder.sort((x, y) => x.orderingWeightingScore - y.orderingWeightingScore);

    for (var i = 0; i < actionsToOrder.length; i++) {
      let actionToUpdate = nextActions.find((row) => row.id === actionsToOrder[i].id)
      actionToUpdate.displayOrder = i + 1; // 1 index display order   
      actionToUpdate.updated = true;
    }

    return nextActions
  }


  export function CheckBlockingRelationships(nextActions: NextAction[]): NextAction[] {
    nextActions.forEach((row) => {
      if (row.blockedBy !== "" && row.blockedBy !== undefined) {
        let blockingAction = nextActions.find(na => na.id === row.blockedBy);

        if (blockingAction !== undefined) {
          if (blockingAction.isDone === true) {
            row.blockedBy = "";
            row.updated = true;
          }
        }
        else {
          row.blockedBy = "";
          row.updated = true;
        }
      }
    })

    return nextActions;
  }

  export function AddBlockedByFromBlocks(nextActions: NextAction[]): NextAction[] {
    nextActions.forEach((row) => {
      if (row.isDone === false && row.blocks !== "" && row.blocks !== undefined) {
        let actionThisBlocks = nextActions.find(na => na.id === row.blocks);

        if (actionThisBlocks !== undefined) {
          actionThisBlocks.blockedBy = row.id;
          actionThisBlocks.updated = true;
        }
      }
    })

    return nextActions;
  }

  async function CommitChanges(nextActionsAccessor: INextActionDataAccessor, nextActions: NextAction[]) {
    await nextActionsAccessor.UpdateRows(nextActions.filter(action => action.updated === true));
  }
}
