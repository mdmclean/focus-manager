import { sheets_v4 } from 'googleapis';
import { GoogleSheetsHelper } from '../Helpers/GoogleSheetsHelper';
import { RecurringAction } from "../Models/Sheets/RecurringAction";
import { IRecurringEventDataAccessor } from "./IRecurringEventDataAccessor";
import { RecurringActionColumnIndicesZeroIndex } from './RecurringActionColumnIndicesZeroIndexed';

export class RecurringActionSheetsAPIDAL implements IRecurringEventDataAccessor {

    private spreadsheetId = '1GMzzwvc4p3MwOfcF95_KmJSZQUMRfx4sZwJykxU0r04'; // TODO pull into configuration
    private sheetName = 'Recurring Actions'
    private sheetsAccessor:sheets_v4.Sheets;
  
    constructor(authenticatedSheetsClient:sheets_v4.Sheets) {
      this.sheetsAccessor = authenticatedSheetsClient;
    }  

    async GetRows() : Promise<RecurringAction[]> {
        let recurringActionRange: any[][];
        let recurringActions: RecurringAction[];
    
        let response = await this.sheetsAccessor.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: this.sheetName
        });
    
        recurringActionRange = response.data.values;
        recurringActionRange.shift(); // remove header row

        let columnIndices_ZeroIndexed = RecurringActionColumnIndicesZeroIndex.GetIndices()


        recurringActions = recurringActionRange.map(
            (row, rowNumber) => 
            {
                let id: string = row[columnIndices_ZeroIndexed.id];
                let targetTheme: string = row[columnIndices_ZeroIndexed.targetTheme];
                let frequencyInDays: number = row[columnIndices_ZeroIndexed.frequencyInDays];
                let nextOccurrence: Date = row[columnIndices_ZeroIndexed.nextOccurrence];
                let name: string = row[columnIndices_ZeroIndexed.name];
                let description: string = row[columnIndices_ZeroIndexed.description];
                let priority: number = row[columnIndices_ZeroIndexed.priority];
                let childOf: string = row[columnIndices_ZeroIndexed.childOf];
                let points: number = row[columnIndices_ZeroIndexed.points];    

                return new RecurringAction(id, targetTheme, frequencyInDays, nextOccurrence, name, description, priority, childOf, 
                    rowNumber + 1, // row 0 is header
                    points);
            }
        )

        return recurringActions;
    }

    async Update(updatedRecurringAction: RecurringAction) {
        let recurringActionRow = this.buildRowForRecurringActions(updatedRecurringAction);
        let valuesForInput = [];
        valuesForInput.push(recurringActionRow);
    
        const resource = {
          values: valuesForInput,
        };
    
        let request = {
          spreadsheetId: this.spreadsheetId,
          range: `${this.sheetName}!A${updatedRecurringAction.rowZeroIndexed+1}:Z${updatedRecurringAction.rowZeroIndexed+1}`,
          valueInputOption: 'USER_ENTERED', 
          resource: resource
        }
    
        try {
          await this.sheetsAccessor.spreadsheets.values.update(request);
        }
        catch (e) {
          console.error(e);
        }    
    }

    private buildRowForRecurringActions(recurringAction: RecurringAction) {
        let recurringActionRow = [];
    
        recurringActionRow.push(recurringAction.id);
        recurringActionRow.push(recurringAction.targetTheme);
        recurringActionRow.push(recurringAction.frequencyInDays);
        recurringActionRow.push(GoogleSheetsHelper.CreateGoogleSheetsStyleDateString(recurringAction.nextOccurrence));
        recurringActionRow.push(recurringAction.name);
        recurringActionRow.push(recurringAction.description);
        recurringActionRow.push(recurringAction.priority);
        recurringActionRow.push(recurringAction.childOf);
        recurringActionRow.push(recurringAction.points);        
    
        return recurringActionRow;
    }
}