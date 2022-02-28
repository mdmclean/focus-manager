
import { NextActionsDAL } from "./DAL/NextActionsDAL";
import { NextActionHelper } from "./Helpers/NextActionHelper";
import { NextAction } from "./Models/Sheets/NextAction";


function AddNextActionRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) {
    let actionAccessor = new NextActionsDAL();
    let newAction:NextAction = NextActionHelper.CreateActionWithDefaults(name,description,priority,childOf,theme,points);
    actionAccessor.AddRow(newAction);
}

async function GetAllNextActions() {
    let actionAccessor = new NextActionsDAL();
    let rows = await actionAccessor.GetRows();

    let rowsAsArrays = [];

    rows.forEach((row) => {
        rowsAsArrays.push( (Object.keys(row).map((key) => row[key])).join("||"));
    })

    return rowsAsArrays;
}

