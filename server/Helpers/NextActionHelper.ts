import { DateAccessor } from "../DAL/DateAccessor";
import { NextAction } from "../Models/Sheets/NextAction";

export module NextActionHelper {
    export function CreateActionWithDefaults(name: string, description: string, priority: number, 
      childOf: string, targetTheme: string, points: number, urgency: number, importance:number, state:string, wellBeing:string, source) : NextAction{

        const effortCount = 0;
        const targetDate = null;
        const display = true;
        let isDone:boolean = false;
        const lastUpdated = DateAccessor.Today();
        const displayOrder = 1;
        const link = "";
        const snoozeUntil = null;
        let resolutionDate:Date = null;
        const createdDate = DateAccessor.Today();
        const blockedBy = "";
        const blocks = "";
        const id = "Set later"; // set later
        const rowZeroIndexed = -1; // set later
        const isDeepWork = false;

        if (state == "Done")
        {
          resolutionDate = DateAccessor.Today();
          isDone = true;
        }
    
    
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
          blocks,
          state,
          wellBeing,
          isDeepWork,
          source
        );
    
        return newRow;
      }
}