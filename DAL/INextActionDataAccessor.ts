import { NextAction } from "../Models/Sheets/NextAction";

export interface INextActionDataAccessor {
    GetRows() : Promise<NextAction[]>;
    Update(action:NextAction);
    AddRow(action:NextAction) ;
    UpdateRows(actions:NextAction[]);
}