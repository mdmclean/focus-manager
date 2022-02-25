
import { NextAction } from "./Models/Sheets/NextAction";
import { NextActionsDAL } from "./DAL/NextActionsDAL";
import { DateAccessor } from "./DAL/DateAccessor";
import { INextActionDataAccessor } from "./DAL/INextActionDataAccessor";
import { RecurringAction } from "./Models/Sheets/RecurringAction";
import { RecurringActionDAL } from "./DAL/RecurringEventDAL";


export module Updater {
  export async function DailyUpdater() {

    let nextActionsAccessor: INextActionDataAccessor = new NextActionsDAL();

    AddRecurringActions(nextActionsAccessor);


    var nextActions = await nextActionsAccessor.GetRows();

    nextActions = CheckBlockingRelationships(nextActions);
    nextActions = AddBlockedByFromBlocks(nextActions);

    nextActions = UpdateDisplayOrder(nextActions, "Home");
    nextActions = UpdateDisplayOrder(nextActions, "Work");

    CommitChanges(nextActionsAccessor, nextActions);
  }

  function UpdateDisplayOrder(nextActions: NextAction[], targetTheme: string): NextAction[] {

    let actionsToOrder = nextActions.filter(row => row.isDone === false && row.theme === targetTheme);
    actionsToOrder = actionsToOrder.sort((x, y) => x.orderingWeightingScore - y.orderingWeightingScore);

    for (var i = 0; i < actionsToOrder.length; i++) {
      nextActions.find((row) => row.id === actionsToOrder[i].id).displayOrder = i + 1; // 1 index display order   
    }

    return nextActions
  }


  function AddRecurringActions(naAccessor: INextActionDataAccessor) {
    let recurringActions: RecurringAction[] = RecurringActionDAL.GetRows();

    recurringActions.forEach((row) => {
      if (row.nextOccurrence < DateAccessor.Today()) {
        naAccessor.AddRow(row.name, row.description, row.priority, row.childOf, row.targetTheme, row.points);
        row.nextOccurrence = DateAccessor.GetDateXDaysFromNow(row.frequencyInDays);
        RecurringActionDAL.Update(row);
      }
    }
    )
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


  function CommitChanges(nextActionsAccessor: INextActionDataAccessor, nextActions: NextAction[]) {
    for (var i = 0; i < nextActions.length; i++) {
      nextActionsAccessor.Update(nextActions[i]);
    }

  }

}

