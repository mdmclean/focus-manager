import { RecurringAction } from "../Models/Sheets/RecurringAction";

export interface IRecurringEventDataAccessor {
    GetRows();
    Update(updatedRecurringAction:RecurringAction);
}