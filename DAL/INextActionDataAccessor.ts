import { NextAction } from "../Models/Sheets/NextAction";

export interface INextActionDataAccessor {
    GetRows() : NextAction[];
    Update(action:NextAction);
    AddRow(name:string, description:string, priority:number, childOf:string, theme:string, points:number) ;
}