import { NextAction } from "../Models/Sheets/NextAction";
import { DateAccessor } from "./DateAccessor";
import { NextActionColumnIndicesZeroIndex } from "./NextActionColumnIndicesZeroIndexed";
import { INextActionDataAccessor } from "./INextActionDataAccessor"


export class NextActionsDAL implements INextActionDataAccessor {

    private nextActionTableName:string = 'Next Actions';

    private columnIndices_ZeroIndexed = NextActionColumnIndicesZeroIndex.GetIndices();
    
    public GetRows() : NextAction[] {
        var naRange =  SpreadsheetApp.getActive().getSheetByName(this.nextActionTableName).getDataRange().getValues();

       naRange.shift(); // remove header row

        var nextActions = naRange.map(
            function (row, rowNumber) {
                let id:string = row[this.columnIndices_ZeroIndexed.id];
                let name:string = row[this.columnIndices_ZeroIndexed.name];
                let description:string = row[this.columnIndices_ZeroIndexed.description];
                let priority:number = row[this.columnIndices_ZeroIndexed.priority];
                let childOf:string = row[this.columnIndices_ZeroIndexed.childOf]; 
                let isDone:boolean = row[this.columnIndices_ZeroIndexed.isDone];
                let lastUpdated:Date = row[this.columnIndices_ZeroIndexed.lastUpdated];
                let theme:string = row[this.columnIndices_ZeroIndexed.theme]; 
                let points:number = row[this.columnIndices_ZeroIndexed.points]; 
                let effortCount:number = row[this.columnIndices_ZeroIndexed.effortCount];
                let targetDate:Date = row[this.columnIndices_ZeroIndexed.targetDate];
                let isDisplayed:boolean = row[this.columnIndices_ZeroIndexed.isDisplayed]; 
                let originalPriority:number = row[this.columnIndices_ZeroIndexed.originalPriority];
                let link:string = row[this.columnIndices_ZeroIndexed.link];
                let displayOrder:number = row[this.columnIndices_ZeroIndexed.displayOrder];
                let snoozeUntil:Date = row[this.columnIndices_ZeroIndexed.snoozeUntil];
                let resolutionDate:Date = row[this.columnIndices_ZeroIndexed.resolutionDate];

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
                    resolutionDate
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
        this.UpdateNextActionCell(action.rowZeroIndexed+1, this.columnIndices_ZeroIndexed.resolutionDate, action.resolutionDate);
    }

    public AddRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) {
        let rowZeroIndexed:number = this.GetNumberOfRows()+1; 
        let id:string = "NA-" + rowZeroIndexed;

        const effortCount = 0; 
        const targetDate = null; 
        const display = true;
        const isDone = false;
        const lastUpdated = DateAccessor.Today();
        const displayOrder = 1;
        const link = "";
        const snoozeUntil = null;
        const resolutionDate = null;


        let newRow:NextAction = new NextAction(
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
            display,
            priority,
            rowZeroIndexed,
            link,
            displayOrder,
            snoozeUntil,
            resolutionDate
        );

        this.Update(newRow);
    }

    private UpdateNextActionCell(row:number, column:number, value:any) 
    {
        let targetRange = SpreadsheetApp.getActive().getSheetByName(this.nextActionTableName).getRange(row, column);
        targetRange.setValue(value);
    }
}