import {IMeal} from "../models";

export enum MealActionTypes {
    ADD_MEAL = "ADD_MEAL",
    EDIT_MEAL = "EDIT_MEAL",
    REMOVE_MEAL = "REMOVE_MEAL",
}

export interface IMealAction {
    type: MealActionTypes,
    payload: IMeal
}
