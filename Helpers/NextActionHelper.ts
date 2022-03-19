import { DateAccessor } from "../DAL/DateAccessor";
import { NextAction } from "../Models/Sheets/NextAction";

export module NextActionHelper {
    export function CreateActionWithDefaults(name: string, description: string, priority: number, childOf: string, targetTheme: string, points: number, urgency: number, importance:number) : NextAction{

        const effortCount = 0;
        const targetDate = null;
        const display = true;
        const isDone = false;
        const lastUpdated = DateAccessor.Today();
        const displayOrder = 1;
        const link = "";
        const snoozeUntil = null;
        const resolutionDate = null;
        const createdDate = DateAccessor.Today();
        const blockedBy = "";
        const blocks = "";
        const id = "Set later"; // set later
        const rowZeroIndexed = -1; // set later
    
    
        let newRow: NextAction = new NextAction(
          id,
          name,
          description,
          priority,
          childOf,
          isDone,
          lastUpdated,
          targetTheme,
          points,
          effortCount,
          targetDate,
          display,
          priority,
          rowZeroIndexed,
          link,
          displayOrder,
          snoozeUntil,
          resolutionDate,
          createdDate,
          urgency,
          importance,
          blockedBy,
          blocks
        );
    
        return newRow;
      }
}