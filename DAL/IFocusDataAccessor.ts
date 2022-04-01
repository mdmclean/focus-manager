import { Focus } from "../Models/Sheets/Focus";

export interface IFocusDataAccessor {
    GetRows(): Promise<Focus[]>;
}
