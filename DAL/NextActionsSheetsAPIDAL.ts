import { NextAction } from "../Models/Sheets/NextAction";
import { INextActionDataAccessor } from "./INextActionDataAccessor"
import { sheets_v4 } from 'googleapis';
import { NextActionColumnIndicesZeroIndex } from "../DAL/NextActionColumnIndicesZeroIndexed";
import { v4 as uuidv4 } from 'uuid';
import moment = require("moment");
import { DateAccessor } from "./DateAccessor";
import { GoogleSheetsHelper } from "../Helpers/GoogleSheetsHelper";

// https://googleapis.dev/nodejs/googleapis/latest/sheets/classes/Sheets.html
//https://codelabs.developers.google.com/codelabs/sheets-api#8
// https://googleapis.dev/nodejs/googleapis/latest/sheets/classes/Resource$Spreadsheets$Values.html#batchUpdate

export class NextActionsSheetsAPIDAL implements INextActionDataAccessor {

  private spreadsheetId = '1GMzzwvc4p3MwOfcF95_KmJSZQUMRfx4sZwJykxU0r04'; // TODO pull into configuration
  private sheetName = 'Next Actions'
  private sheetsAccessor:sheets_v4.Sheets;

  constructor(authenticatedSheetsClient:sheets_v4.Sheets) {
    this.sheetsAccessor = authenticatedSheetsClient;
  }

  async GetRows(): Promise<NextAction[]> {

    let naRange: any[][];
    let nextActions: NextAction[];

    let response = await this.sheetsAccessor.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName
    });

    naRange = response.data.values;
    naRange.shift(); // remove header row

    let colIndices = NextActionColumnIndicesZeroIndex.GetIndices();

    nextActions = naRange.map(
      function (row, rowNumber) {
        let id: string = row[colIndices.id];
        let name: string = row[colIndices.name];
        let description: string = row[colIndices.description];
        let priority: number = parseInt(row[colIndices.priority]);
        let childOf: string = row[colIndices.childOf];
        let isDone: boolean = row[colIndices.isDone] === 'TRUE' ? true : false;
        let lastUpdated: Date = row[colIndices.lastUpdated] !== '' ? new Date(row[colIndices.lastUpdated]) : null;
        let theme: string = row[colIndices.theme];
        let points: number = parseInt(row[colIndices.points]);
        let effortCount: number = parseInt(row[colIndices.effortCount]);
        let targetDate: Date = row[colIndices.targetDate] !== '' ? new Date(row[colIndices.targetDate]) : null;
        let isDisplayed: boolean = row[colIndices.isDisplayed] === 'TRUE' ? true : false;
        let originalPriority: number = parseInt(row[colIndices.originalPriority]);
        let link: string = row[colIndices.link];
        let displayOrder: number = parseInt(row[colIndices.displayOrder]);
        let snoozeUntil: Date = row[colIndices.snoozeUntil] !== '' ? new Date(row[colIndices.snoozeUntil]) : null;
        let resolutionDate: Date = row[colIndices.resolutionDate] !== '' ? new Date(row[colIndices.resolutionDate]) : null;
        let createdDate: Date = row[colIndices.createdDate] !== '' ? new Date(row[colIndices.createdDate]) : null;
        let urgency: number = parseInt(row[colIndices.urgency]);
        let importance: number = parseInt(row[colIndices.importance]);
        let blockedBy: string = row[colIndices.blockedBy];
        let blocks: string = row[colIndices.blocks];
        let state:string = row[colIndices.state];


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
          rowNumber + 1, // row 0 is header
          link,
          displayOrder,
          snoozeUntil,
          resolutionDate,
          createdDate,
          urgency,
          importance,
          blockedBy,
          blocks,
          state
        )
      }
    );

    return nextActions;
  }

  private async SendUpdateRequest (request:sheets_v4.Params$Resource$Spreadsheets$Values$Update) {
    try {
      await this.sheetsAccessor.spreadsheets.values.update(request);
    }
    catch (e) {
      console.error(e);
    }
  }

  async UpdateComputedFields(nextAction: NextAction) {
    let displayOrderInput = { 
      values: [[nextAction.displayOrder]]
    };
    let displayOrderRequest = {
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!O${nextAction.rowZeroIndexed+1}:O${nextAction.rowZeroIndexed+1}`,
      valueInputOption: 'USER_ENTERED',
      resource: displayOrderInput
    }
    await this.SendUpdateRequest(displayOrderRequest);

    let blockingRelationshipInput = { 
      values: [[nextAction.blockedBy, nextAction.blocks]]
    };

    let blockingRelationshipRequest = {
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!U${nextAction.rowZeroIndexed+1}:V${nextAction.rowZeroIndexed+1}`,
      valueInputOption: 'USER_ENTERED',
      resource: blockingRelationshipInput
    }
    await this.SendUpdateRequest(blockingRelationshipRequest);
  }

  async Update(action: NextAction) {
    let nextActionRow = this.buildRowForNextActions(action);
    let valuesForInput = [];
    valuesForInput.push(nextActionRow);

    const resource = {
      values: valuesForInput,
    };

    let request = {
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!A${action.rowZeroIndexed+1}:Z${action.rowZeroIndexed+1}`,
      valueInputOption: 'USER_ENTERED', 
      resource: resource
    }

    await this.SendUpdateRequest(request);
  }

  async AddRow(action:NextAction, targetTable:string=this.sheetName) {
    action.id = "NA-" + uuidv4(); 
    let nextActionRow = this.buildRowForNextActions(action);

    let valuesForInput = [];
    valuesForInput.push(nextActionRow);

    const resource = {
      values: valuesForInput,
    };

    let request = {
      spreadsheetId: this.spreadsheetId,
      range: targetTable,
      valueInputOption: 'USER_ENTERED', 
      resource: resource
    }

    try {
      let result = await this.sheetsAccessor.spreadsheets.values.append(request);
    }
    catch (e) {
      console.error(e);
    }
  }

  private buildRowForNextActions(nextAction: NextAction) {
    let nextActionRow = [];

    nextActionRow.push(nextAction.id);
    nextActionRow.push(nextAction.name);
    nextActionRow.push(nextAction.description);
    nextActionRow.push(nextAction.priority);
    nextActionRow.push(nextAction.childOf);
    nextActionRow.push(nextAction.isDone === true ? 'TRUE' : 'FALSE');
    nextActionRow.push(GoogleSheetsHelper.CreateGoogleSheetsStyleDateString(nextAction.lastUpdated));
    nextActionRow.push(nextAction.theme);
    nextActionRow.push(nextAction.points);
    nextActionRow.push(nextAction.effortCount);
    nextActionRow.push(GoogleSheetsHelper.CreateGoogleSheetsStyleDateString(nextAction.targetDate));
    nextActionRow.push(nextAction.isDiplayed ? 'TRUE' : 'FALSE');
    nextActionRow.push(nextAction.originalPriority);
    nextActionRow.push(nextAction.link);
    nextActionRow.push(nextAction.displayOrder);
    nextActionRow.push(GoogleSheetsHelper.CreateGoogleSheetsStyleDateString(nextAction.snoozeUntil));
    nextActionRow.push(GoogleSheetsHelper.CreateGoogleSheetsStyleDateString(nextAction.resolutionDate));
    nextActionRow.push(GoogleSheetsHelper.CreateGoogleSheetsStyleDateString(nextAction.createdDate));
    nextActionRow.push(nextAction.urgency);
    nextActionRow.push(nextAction.importance);
    nextActionRow.push(nextAction.blockedBy);
    nextActionRow.push(nextAction.blocks);
    nextActionRow.push(nextAction.state);

    return nextActionRow;
  }

  async UpdateRows(actions: NextAction[]) {
    let callCounter:number = 0;
    
    let startTime:Date = DateAccessor.Today();

    for (var i = 0; i < actions.length; i++) {
        await this.UpdateComputedFields(actions[i]);  
        callCounter += 2; // two ranges updated as part of only targetting computed fields

          // 60 calls per minute rate limit 
        if (callCounter === 50) { // TODO - better back off strategy AND/OR use the batch update Google Sheets API 
          let endTime:Date = DateAccessor.Today();
          let executionDuration:number = (endTime.getTime() - startTime.getTime())/1000;
          let sleepTime:number = Math.max(60 - executionDuration, 0);

          console.log('start sleep ' + sleepTime);
          await this.delay(1000 * sleepTime); // sleep for the rest of the minute
          callCounter = 0;
          startTime = DateAccessor.Today();
        }
    }
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}