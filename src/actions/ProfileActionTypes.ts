import {IUserProfile} from "../models";

export enum ProfileActionTypes {
    SET_PROFILE = "SET_PROFILE",
}

export interface IProfileAction {
    type: ProfileActionTypes,
    payload: IUserProfile | null
}
