import {combineReducers} from "redux";
import {profileReducer} from "./ProfileReducer";
import {macroAdviceReducer} from "./MacroAdviceReducer";
import {mealReducer} from "./MealReducer";
import {foodLogReducer} from "./FoodLogReducer";

const rootReducer = combineReducers({
    profileReducer: profileReducer,
    macroAdviceReducer: macroAdviceReducer,
    mealReducer: mealReducer,
    foodLogReducer: foodLogReducer
});

export default rootReducer;
