import {IMacroBreakdown} from "./MacroBreakdown";

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum MealSortField {
    NAME = 'name',
    CALORIES = 'calories',
    PROTEIN = 'protein',
    CARBOHYDRATES = 'carbohydrates',
    FATS = 'fats'
}

export interface IMealSortModel {
    sortProperty: MealSortField;
    sortOrder: SortOrder;
}

export interface IMeal {
    id: string;
    name: string;
    macros: IMacroBreakdown;
    calories: number;
}

export interface IMeals {
    list: IMeal[];
}

export interface IMealSuggestion {
    meals: IMeal[];
    totalCalories: number;
}

export interface IMealSuggestions {
    list: IMealSuggestion[];
}
