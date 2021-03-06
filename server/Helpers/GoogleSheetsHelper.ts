import moment = require("moment");

export module GoogleSheetsHelper {
    export   function CreateGoogleSheetsStyleDateString(dateToConvert:Date) : string 
    {
      return (dateToConvert !== null ? moment(dateToConvert).format('M/D/YYYY HH:mm:ss') : "");
    }

    export function ConvertGoogleSheetsDateStringToDate(dateString:string) : Date
    {
      return (dateString !== "" ? new Date(dateString)  : null);
    }
}