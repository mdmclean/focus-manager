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

    function GetNumberOfRows() : number {
        let numberOfHeaderRows:number = 1; 
        var countOfRows =  SpreadsheetApp.getActive().getSheetByName('Next Actions').getDataRange().getNumRows() - numberOfHeaderRows;

        return countOfRows;
    }

    export function UpdatePriority(nextAction:NextAction, newValue:number)
    {    
        SpreadsheetApp.getActive().getSheetByName('Next Actions').getRange(nextAction.rowZeroIndexed+1, columnIndices_ZeroIndexed.priority+1).setValue(newValue);;
    }

    export function UpdateIsDisplayed(nextAction:NextAction, newValue:boolean)
    {    
        SpreadsheetApp.getActive().getSheetByName('Next Actions').getRange(nextAction.rowZeroIndexed+1, columnIndices_ZeroIndexed.isDisplayed+1).setValue(newValue);;
    }

    export function AddRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) {
        let rowZeroIndexed:number = GetNumberOfRows()+1; 
        let id:string = "NA-" + rowZeroIndexed;

        const effortCount = 0; 
        const targetDate = null; 
        const display = true;
        const parentFocus = "";
        const isDone = false;
        const lastUpdated = DateAccessor.Today();


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
            parentFocus,
            priority,
            rowZeroIndexed
        );

        let valuesToInsert = [
            newRow.id,
            newRow.name,
            newRow.description,
            newRow.priority,
            newRow.childOf,
            newRow.isDone,
            newRow.lastUpdated,
            newRow.theme,
            newRow.points,
            newRow.effortCount,
            newRow.targetDate,
            newRow.isDiplayed,
            newRow.parentFocus,
            newRow.priority
        ];
        let numberOfColumns:number = valuesToInsert.length; // don't include the row count
        let targetRange = SpreadsheetApp.getActive().getSheetByName('Next Actions').getRange(newRow.rowZeroIndexed+1, 1, 1, numberOfColumns); 
        targetRange.setValues([valuesToInsert]);
    }
}