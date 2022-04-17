import { RecurringAction } from "../Models/Sheets/RecurringAction";
import { IRecurringEventDataAccessor } from "./IRecurringEventDataAccessor";
import { RecurringActionColumnIndicesZeroIndex } from "./RecurringActionColumnIndicesZeroIndexed";

export class RecurringActionDAL implements IRecurringEventDataAccessor {

    GetRows(): RecurringAction[] {
        var raRange = SpreadsheetApp.getActive().getSheetByName('Recurring Actions').getDataRange().getValues();

        raRange.shift(); // remove header row

        let columnIndices_ZeroIndexed = RecurringActionColumnIndicesZeroIndex.GetIndices()

        var recurringActions = raRange.map(
            function (row, rowNumber) {
                let id: string = row[columnIndices_ZeroIndexed.id];
                let targetTheme: string = row[columnIndices_ZeroIndexed.targetTheme];
                let frequencyInDays: number = row[columnIndices_ZeroIndexed.frequencyInDays];
                let nextOccurrence: Date = row[columnIndices_ZeroIndexed.nextOccurrence];
                let name: string = row[columnIndices_ZeroIndexed.name];
                let description: string = row[columnIndices_ZeroIndexed.description];
                let priority: number = row[columnIndices_ZeroIndexed.priority];
                let childOf: string = row[columnIndices_ZeroIndexed.childOf];
                let points: number = row[columnIndices_ZeroIndexed.points];
                let countOfMissedOccurrences: number = row[columnIndices_ZeroIndexed.countOfMissedOccurrences];

                return new RecurringAction(
                    id,
                    targetTheme,
                    frequencyInDays,
                    nextOccurrence,
                    name,
                    description,
                    priority,
                    childOf,
                    rowNumber + 1, // row 0 is header
                    points,
                    countOfMissedOccurrences
                )
            }
        );

        return recurringActions;
    }

    Update(updatedRecurringAction: RecurringAction) {
    let newValue = [[
        updatedRecurringAction.id,
        updatedRecurringAction.targetTheme,
        updatedRecurringAction.frequencyInDays,
        updatedRecurringAction.nextOccurrence,
        updatedRecurringAction.name,
        updatedRecurringAction.description,
        updatedRecurringAction.priority,
        updatedRecurringAction.childOf,
        updatedRecurringAction.points,
        updatedRecurringAction.countOfMissedOccurrences
    ]];

    let numberOfColumns = newValue[0].length;

    SpreadsheetApp.getActive().getSheetByName('Recurring Actions').getRange(updatedRecurringAction.rowZeroIndexed + 1, 1, 1, numberOfColumns).setValues(newValue);;
}

}