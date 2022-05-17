import { sheets_v4 } from "googleapis";
import { Focus } from "../Models/Sheets/Focus";
import { FocusColumnIndicesZeroIndexed } from "./FocusColumnIndicesZeroIndexed";
import { IFocusDataAccessor } from "./IFocusDataAccessor";

export class FocusSheetsAPIDAL implements IFocusDataAccessor {
    private spreadsheetId = '1GMzzwvc4p3MwOfcF95_KmJSZQUMRfx4sZwJykxU0r04'; // TODO pull into configuration
    private sheetName = 'Focuses'
    private sheetsAccessor: sheets_v4.Sheets;

    constructor(authenticatedSheetsClient:sheets_v4.Sheets) {
        this.sheetsAccessor = authenticatedSheetsClient;
      }

    async GetRows(): Promise<Focus[]> {
        let focusRange: any[][];
        let focuses: Focus[];

        let response = await this.sheetsAccessor.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: this.sheetName
        });

        focusRange = response.data.values;
        focusRange.shift(); // remove header row

        let colIndices = FocusColumnIndicesZeroIndexed.GetIndices();

        focuses = focusRange.map(
            function (row, rowNumber) {
                let id: string = row[colIndices.id];
                let name: string = row[colIndices.name];
                let description: string = row[colIndices.description];
                let childOf = row[colIndices.childOf];
                let completedPoints = row[colIndices.completedPoints];
                let targetDate = row[colIndices.targetDate];
                let theme = row[colIndices.theme];
                let state = row[colIndices.state];
                let resolutionDate = row[colIndices.resolutionDate];
                let resolutionReason = row[colIndices.resolutionReason];

                return new Focus(id, name, description, childOf, completedPoints, targetDate, theme, state, resolutionDate, resolutionReason);
            }
        );

        return focuses;
    }
}