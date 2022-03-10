import { NextAction } from "../Models/Sheets/NextAction";
import { DateAccessor } from "./DateAccessor";
import { NextActionColumnIndicesZeroIndex } from "./NextActionColumnIndicesZeroIndexed";
import { INextActionDataAccessor } from "./INextActionDataAccessor"
import { DateHelper } from "../Helpers/DateHelper";

export class NextActionsDAL implements INextActionDataAccessor {
    
    UpdateRows(actions: NextAction[]) {
        throw new Error("Method not implemented.");
    }

    private nextActionTableName:string = 'Next Actions';

    private columnIndices_ZeroIndexed = NextActionColumnIndicesZeroIndex.GetIndices();
    
    public async GetRows() : Promise<NextAction[]> {
        var naRange =  SpreadsheetApp.getActive().getSheetByName(this.nextActionTableName).getDataRange().getValues();

       naRange.shift(); // remove header row

        let colIndices = this.columnIndices_ZeroIndexed;

        var nextActions = naRange.map(
            function (row, rowNumber) {
                let id:string = row[colIndices.id];
                let name:string = row[colIndices.name];
                let description:string = row[colIndices.description];
                let priority:number = row[colIndices.priority];
                let childOf:string = row[colIndices.childOf]; 
                let isDone:boolean = row[colIndices.isDone];
                let lastUpdated:Date = row[colIndices.lastUpdated];
                let theme:string = row[colIndices.theme]; 
                let points:number = row[colIndices.points]; 
                let effortCount:number = row[colIndices.effortCount];
                let targetDate:Date = row[colIndices.targetDate];
                let isDisplayed:boolean = row[colIndices.isDisplayed]; 
                let originalPriority:number = row[colIndices.originalPriority];
                let link:string = row[colIndices.link];
                let displayOrder:number = row[colIndices.displayOrder];
                let snoozeUntil:Date = row[colIndices.snoozeUntil];
                let resolutionDate:Date = row[colIndices.resolutionDate];
                let createdDate:Date = row[colIndices.createdDate];
                let urgency: number = row[colIndices.urgency]; 
                let importance: number = row[colIndices.importance];
                let blockedBy:string = row[colIndices.blockedBy];
                let blocks:string = row[colIndices.blocks];

                return new NextAction(
                    id,
                    name,
                    description,
                    priority,
                    childOf,
                    isDone,
                    lastUpdated,
                    theme,
                    points,
                    effortCount,
                    targetDate,
                    isDisplayed,
                    originalPriority,
                    rowNumber+1, // row 0 is header
                    link,   
                    displayOrder,
                    snoozeUntil,
                    resolutionDate,
                    createdDate,
                    urgency,
                    importance,
                    blockedBy,
                    blocks
                )
            }
        );

        return nextActions;
    }

    private GetNumberOfRows() : number {
        let numberOfHeaderRows:number = 1; 
        var countOfRows =  SpreadsheetApp.getActive().getSheetByName(this.nextActionTableName).getDataRange().getNumRows() - numberOfHeaderRows;

        return countOfRows;
    }

    public Update(action:NextAction)
    {    
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.id+1, action.id);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.name+1, action.name);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.description+1, action.description);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.priority+1, action.priority);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.childOf+1, action.childOf);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.isDone+1, action.isDone);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.lastUpdated+1, action.lastUpdated);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.theme+1, action.theme);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.points+1, action.points);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.effortCount+1, action.effortCount);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.targetDate+1, action.targetDate);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.isDisplayed+1, action.isDiplayed);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.originalPriority+1, action.originalPriority);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.link+1, action.link);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.snoozeUntil+1, action.snoozeUntil);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.displayOrder+1, action.displayOrder);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.resolutionDate+1, action.resolutionDate);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.createdDate+1, action.createdDate);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.urgency+1, action.urgency);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.importance+1, action.importance);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.blockedBy+1, action.blockedBy);
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.blocks+1, action.blocks);
    }

    public AddRow(action:NextAction) {
        let rowZeroIndexed:number = this.GetNumberOfRows()+1; 
        let id:string = "NA-" + rowZeroIndexed;

        action.id = id;
        action.rowZeroIndexed = rowZeroIndexed;

        this.Update(action);
    }

    private UpdateNextActionCell(row:number, column:number, value:any) 
    {
        let targetRange = SpreadsheetApp.getActive().getSheetByName(this.nextActionTableName).getRange(row, column);
        targetRange.setValue(value);
    }
}