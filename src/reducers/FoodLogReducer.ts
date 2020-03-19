import {IFoodLogs} from "../models";
import {FoodLogActionTypes, IFoodLogAction} from "../actions/FoodLogActionTypes";
import {mockFoodLogsData} from "../models/MockData";

// TODO:: Remove initial state
const initialState: IFoodLogs = mockFoodLogsData;

export const foodLogReducer = (state: IFoodLogs = initialState, action: IFoodLogAction) => {
    switch (action.type) {
        case FoodLogActionTypes.ADD_FOOD_LOG: {
            return {
                list: [...state.list, action.payload]
            };
        }
        case FoodLogActionTypes.EDIT_FOOD_LOG: {
            return {
                list: state.list.map(meal => {
                    if (meal.id === action.payload.id) {
                        meal = {
                            ...action.payload
                        };
                    }

                    return meal;
                })
            };
        }
        case FoodLogActionTypes.REMOVE_FOOD_LOG :
            return {
                list: state.list.filter(meal => meal.id !== action.payload.id),
            };
        default: {
            return state;
        }
    }
};
