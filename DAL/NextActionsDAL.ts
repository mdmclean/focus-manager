module NextActionsDAL {
    
    let columnIndices_ZeroIndexed = {
        id: 0,
        name: 1, 
        description: 2,
        priority: 3,
        childOf: 4,
        isDone: 5,
        lastUpdated: 6,
        theme: 7,
        points: 8,
        effortCount: 9,
        targetDate: 10,
        isDisplayed: 11,
        originalPriority: 12,
        link: 13,
        displayOrder: 14,
        snoozeUntil: 15
    };

    const nextActionTableName = 'Next Actions';
    
    export function GetRows() : NextAction[] {
        var naRange =  SpreadsheetApp.getActive().getSheetByName(nextActionTableName).getDataRange().getValues();

       naRange.shift(); // remove header row

        var nextActions = naRange.map(
            function (row, rowNumber) {
                let id:string = row[columnIndices_ZeroIndexed.id];
                let name:string = row[columnIndices_ZeroIndexed.name];
                let description:string = row[columnIndices_ZeroIndexed.description];
                let priority:number = row[columnIndices_ZeroIndexed.priority];
                let childOf:string = row[columnIndices_ZeroIndexed.childOf]; 
                let isDone:boolean = row[columnIndices_ZeroIndexed.isDone];
                let lastUpdated:Date = row[columnIndices_ZeroIndexed.lastUpdated];
                let theme:string = row[columnIndices_ZeroIndexed.theme]; 
                let points:number = row[columnIndices_ZeroIndexed.points]; 
                let effortCount:number = row[columnIndices_ZeroIndexed.effortCount];
                let targetDate:Date = row[columnIndices_ZeroIndexed.targetDate];
                let isDisplayed:boolean = row[columnIndices_ZeroIndexed.isDisplayed]; 
                let originalPriority:number = row[columnIndices_ZeroIndexed.originalPriority];
                let link:string = row[columnIndices_ZeroIndexed.link];
                let displayOrder:number = row[columnIndices_ZeroIndexed.displayOrder];
                let snoozeUntil:Date = row[columnIndices_ZeroIndexed.snoozeUntil];

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
                    snoozeUntil    
                )
            }
        );

        return nextActions;
    }

    function GetNumberOfRows() : number {
        let numberOfHeaderRows:number = 1; 
        var countOfRows =  SpreadsheetApp.getActive().getSheetByName(nextActionTableName).getDataRange().getNumRows() - numberOfHeaderRows;

        return countOfRows;
    }

    export function Update(action:NextAction)
    {    
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.id+1, action.id);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.name+1, action.name);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.description+1, action.description);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.priority+1, action.priority);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.childOf+1, action.childOf);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.isDone+1, action.isDone);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.lastUpdated+1, action.lastUpdated);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.theme+1, action.theme);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.points+1, action.points);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.effortCount+1, action.effortCount);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.targetDate+1, action.targetDate);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.isDisplayed+1, action.isDiplayed);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.originalPriority+1, action.originalPriority);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.link+1, action.link);
        UpdateNextActionCell(action.rowZeroIndexed+1, columnIndices_ZeroIndexed.snoozeUntil+1, action.snoozeUntil);
    }

    export function AddRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) {
        let rowZeroIndexed:number = GetNumberOfRows()+1; 
        let id:string = "NA-" + rowZeroIndexed;

        const effortCount = 0; 
        const targetDate = null; 
        const display = true;
        const isDone = false;
        const lastUpdated = DateAccessor.Today();
        const displayOrder = 1;
        const link = "";
        const snoozeUntil = null;


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
            snoozeUntil
        );

        Update(newRow);
    }

    function UpdateNextActionCell(row:number, column:number, value:any) 
    {
        let targetRange = SpreadsheetApp.getActive().getSheetByName(nextActionTableName).getRange(row, column);
        targetRange.setValue(value);
    }
}