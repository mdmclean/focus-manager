function AddNextActionRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) {
    NextActionsDAL.AddRow(name,description,priority,childOf,theme,points);
}

function GetAllNextActions() {
    let rows = NextActionsDAL.GetRows();

    let rowsAsArrays = [];

    rows.forEach((row) => {
        rowsAsArrays.push( (Object.keys(row).map((key) => row[key])).join("||"));
    })

    return rowsAsArrays;
}

