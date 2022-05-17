import { google } from 'googleapis';
const sheets = google.sheets('v4');
import privateKey = require('../focus-manager-eeb4fa264f6f.json');

export class GoogleSheetsClient {
    constructor() {
      let googleSheetJwtClient = new google.auth.JWT(
        privateKey.client_email,
        null,
        privateKey.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']);
  
      //authenticate request
      googleSheetJwtClient.authorize(function (err) {
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

    GetAuthenticatedAPIObject (){
        return sheets;
    }
}