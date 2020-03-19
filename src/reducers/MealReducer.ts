import {IMeals} from "../models";
import {IMealAction, MealActionTypes} from "../actions";
import {mockMealData} from "../models/MockData";

// TODO:: Remove initial state
const initialState: IMeals = mockMealData;

export const mealReducer = (state: IMeals = initialState, action: IMealAction) => {
    switch (action.type) {
        case MealActionTypes.ADD_MEAL: {
            return {
                list: [...state.list, action.payload]
            };
        }
        case MealActionTypes.EDIT_MEAL: {
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
        case MealActionTypes.REMOVE_MEAL :
            return {
                list: state.list.filter(meal => meal.id !== action.payload.id),
            };
        default: {
            return state;
        }
    }
};
