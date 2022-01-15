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
        parentFocus: 12,
        originalPriority: 13,
    };
    
    export function GetRows() : NextAction[] {
        var naRange =  SpreadsheetApp.getActive().getSheetByName('Next Actions').getDataRange().getValues();

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
                let parentFocus:string = row[columnIndices_ZeroIndexed.parentFocus]; 
                let originalPriority:number = row[columnIndices_ZeroIndexed.originalPriority];

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
                    parentFocus,
                    originalPriority,
                    rowNumber+1 // row 0 is header                      
                )
            }
        );

        return nextActions;
    }

    export function UpdatePriority(nextAction:NextAction, newValue:number)
    {    
        SpreadsheetApp.getActive().getSheetByName('Next Actions').getRange(nextAction.rowZeroIndexed+1, columnIndices_ZeroIndexed.priority+1).setValue(newValue);;
    }

    export function UpdateIsDisplayed(nextAction:NextAction, newValue:boolean)
    {    
        SpreadsheetApp.getActive().getSheetByName('Next Actions').getRange(nextAction.rowZeroIndexed+1, columnIndices_ZeroIndexed.isDisplayed+1).setValue(newValue);;
    }
}