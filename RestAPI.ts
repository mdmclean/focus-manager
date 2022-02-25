
import { NextActionsDAL } from "./DAL/NextActionsDAL";


function AddNextActionRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) {
    let actionAccessor = new NextActionsDAL();
    actionAccessor.AddRow(name,description,priority,childOf,theme,points);
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

