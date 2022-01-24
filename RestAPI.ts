function AddNextActionRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) {
    NextActionsDAL.AddRow(name,description,priority,childOf,theme,points);
}