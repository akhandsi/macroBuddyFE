import {IMeal} from "./Meal";
import {IMacroBreakdown} from "./MacroBreakdown";

export enum FoodLogTreeMode {
    EDIT= "EDIT",
    READ_ONLY= "READ_ONLY"
}

export interface IFoodLogCaloriesBreakdown {
    totalCalories: number;
    proteinCalories: number;
    carbohydratesCalories: number;
    fatsCalories: number;
}

export interface IFoodLogBreakdownSummary {
    macroBreakdown: IMacroBreakdown;
    macroDeficitBreakdown: IMacroBreakdown;
    macroSuggestedBreakdown: IMacroBreakdown;
    caloriesBreakdown: IFoodLogCaloriesBreakdown;
    caloriesDeficitBreakdown: IFoodLogCaloriesBreakdown;
    caloriesSuggestedBreakdown: IFoodLogCaloriesBreakdown;
}

export interface IFoodLog {
    id: string;
    date: string;
    meals: IMeal[];
    breakdownSummary: IFoodLogBreakdownSummary;
}

export interface IFoodLogs {
    list: IFoodLog[];
}



