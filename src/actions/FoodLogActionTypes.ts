import {IFoodLog} from "../models";

export enum FoodLogActionTypes {
    REMOVE_FOOD_LOG = "REMOVE_FOOD_LOG",
    ADD_FOOD_LOG = "ADD_FOOD_LOG",
    EDIT_FOOD_LOG = "EDIT_FOOD_LOG",
}

export interface IFoodLogAction {
    type: FoodLogActionTypes,
    payload: IFoodLog
}
