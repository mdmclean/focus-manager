import { NextAction } from "../Models/Sheets/NextAction";
import { DateAccessor } from "./DateAccessor";
import { INextActionDataAccessor } from "./INextActionDataAccessor"
import { google } from 'googleapis';
const sheets = google.sheets('v4');
import privateKey = require('../focus-manager-eeb4fa264f6f.json');
import { NextActionColumnIndicesZeroIndex } from "../DAL/NextActionColumnIndicesZeroIndexed";
import { auth, JWT } from "google-auth-library";
import { v4 as uuidv4 } from 'uuid';
import moment = require("moment");
import { DateHelper } from "../Helpers/DateHelper";

// https://googleapis.dev/nodejs/googleapis/latest/sheets/classes/Sheets.html
//https://codelabs.developers.google.com/codelabs/sheets-api#8
// https://googleapis.dev/nodejs/googleapis/latest/sheets/classes/Resource$Spreadsheets$Values.html#batchUpdate

export class NextActionsSheetsAPIDAL implements INextActionDataAccessor {

  private spreadsheetId = '1GMzzwvc4p3MwOfcF95_KmJSZQUMRfx4sZwJykxU0r04'; // TODO pull into configuration
  private sheetName = 'Next Actions'

  constructor() {
    let googleSheetJwtClient = new google.auth.JWT(
      privateKey.client_email,
      null,
      privateKey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']);

    //authenticate request
    googleSheetJwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("Successfully connected!");
      }
    });

    // Acquire an auth client, and bind it to all future calls
    google.options({ auth: googleSheetJwtClient });
  }

  async GetRows(): Promise<NextAction[]> {

    let naRange: any[][];
    let nextActions: NextAction[];

    let response = await sheets.spreadsheets.values.get({
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
          blocks
        )
      }
    );

    return nextActions;
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

    try {
      await sheets.spreadsheets.values.update(request);
    }
    catch (e) {
      console.error(e);
    }
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
      let result = await sheets.spreadsheets.values.append(request);
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
    nextActionRow.push(this.createGoogleSheetsStyleDateString(nextAction.lastUpdated));
    nextActionRow.push(nextAction.theme);
    nextActionRow.push(nextAction.points);
    nextActionRow.push(nextAction.effortCount);
    nextActionRow.push(this.createGoogleSheetsStyleDateString(nextAction.targetDate));
    nextActionRow.push(nextAction.isDiplayed ? 'TRUE' : 'FALSE');
    nextActionRow.push(nextAction.originalPriority);
    nextActionRow.push(nextAction.link);
    nextActionRow.push(nextAction.displayOrder);
    nextActionRow.push(this.createGoogleSheetsStyleDateString(nextAction.snoozeUntil));
    nextActionRow.push(this.createGoogleSheetsStyleDateString(nextAction.resolutionDate));
    nextActionRow.push(this.createGoogleSheetsStyleDateString(nextAction.createdDate));
    nextActionRow.push(nextAction.urgency);
    nextActionRow.push(nextAction.importance);
    nextActionRow.push(nextAction.blockedBy);
    nextActionRow.push(nextAction.blocks);

    return nextActionRow;
  }

  async UpdateRows(actions: NextAction[]) {
    let callCounter:number = 0;
    
    let startTime:Date = DateHelper.CurrentTime();

    for (var i = 0; i < actions.length; i++) {
        await this.Update(actions[i]);  
        callCounter += 1;

          // 60 calls per minute rate limit 
        if (callCounter === 50) { // TODO - better back off strategy AND/OR use the batch update Google Sheets API 
          let endTime:Date = DateHelper.CurrentTime();
          let executionDuration:number = (endTime.getTime() - startTime.getTime())/1000;
          let sleepTime:number = Math.min(60 - executionDuration, 0);

          console.log('start sleep ' + sleepTime);
          await this.delay(1000 * sleepTime); // sleep for the rest of the minute
          callCounter = 0;
          startTime = DateHelper.CurrentTime();
        }
    }
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createGoogleSheetsStyleDateString(dateToConvert:Date) : string 
  {
    return (dateToConvert !== null ? moment(dateToConvert).format('M/D/YYYY HH:mm:ss') : "");
  }

}