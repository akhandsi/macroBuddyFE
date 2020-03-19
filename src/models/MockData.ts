import {MealSuggestionUtil, getRandomIntInclusive, MacroAdviceUtil} from "../utils";
import {Gender, Goal, NumOfExerciseDays, NumOfMealsInADay} from "./Profile";
import {IMeal} from "./Meal";
import {IFoodLog, IFoodLogCaloriesBreakdown} from "./FoodLog";
import moment from "moment";
import {FoodLogUtil} from "../utils/FoodLogUtil";
import {IMacroBreakdown} from "./MacroBreakdown";

/////////////////////////////////// PROFILE ///////////////////////////////////////////////
// TODO:: Remove initial state
export const mockProfileData = {
    age: 31,
    gender: Gender.MALE,
    numOfExerciseDays: NumOfExerciseDays.THREE,
    numOfMealsInADay: NumOfMealsInADay.FIVE,
    bodyWeightInKGS: 78,
    bodyHeightInCMS: 180.34,
    bodyFatInPercentage: 12.9,
    goal: Goal.WEIGHT_LOSS
};

/////////////////////////////////// MACRO ADVICE ///////////////////////////////////////////////
export const mockMacroAdviceData = MacroAdviceUtil.generateMacros(mockProfileData) || {
    bmrCalories: 1825,
    totalCalories: 2510,
    currentCalories: 2010,
    macros: {
        protein: 150.75,
        carbohydrates: 201,
        fats: 67,
    }
};

/////////////////////////////////// Meal ///////////////////////////////////////////////
// TODO:: Remove initial state
const createMeal = (id: number, mealName: string): IMeal => {
    const protein = getRandomIntInclusive(25, 50);
    const carbohydrates = getRandomIntInclusive(30, 56);
    const fats = getRandomIntInclusive(8, 24);
    const macros = {
        protein,
        carbohydrates,
        fats
    };
    return  {
        id: id.toString(),
        macros,
        name: mealName,
        calories: MacroAdviceUtil.calculateTotalCaloriesForMacros(macros)
    };
};

export const mockMealData = {
    list: [
        createMeal(1, 'Egg white omelet'),
        createMeal(2, 'Grilled chicken salad'),
        createMeal(3, 'Whey protein banana smoothie'),
        createMeal(4, 'Grilled tilapia'),
        createMeal(5, 'Chickpea curry with rice'),
        createMeal(6, 'Black beans with rice'),
        createMeal(7, 'Kidney beans with rice'),
        createMeal(8, 'Protein pancakes'),
        createMeal(9, 'Ezekiel bread french toast'),
    ]
};

/////////////////////////////////// Food Log ///////////////////////////////////////////////
const mockMacroBreakdown: IMacroBreakdown = {
    protein: 0,
    carbohydrates: 0,
    fats: 0
};

const mockCaloriesBreakdown: IFoodLogCaloriesBreakdown = {
    totalCalories: 0,
    carbohydratesCalories: 0,
    fatsCalories: 0,
    proteinCalories: 0
};

const todayDate = new Date();

const createFoodLog = (id: number, date: string): IFoodLog => {
    const meals: IMeal[] = MealSuggestionUtil.getSuggestions(mockProfileData.numOfMealsInADay, mockMacroAdviceData.currentCalories,
        mockMealData.list, mockProfileData.numOfMealsInADay).list[0].meals;
    const foodLog: IFoodLog = {
        id: id.toString(),
        date,
        meals,
        breakdownSummary: {...mockFoodLogBreakdownSummary}
    };

    foodLog.breakdownSummary = FoodLogUtil.getCaloriesBreakdownForFoodLog(foodLog, mockMacroAdviceData);
    return foodLog;
};

export const mockFoodLogBreakdownSummary = {
    macroBreakdown: {...mockMacroBreakdown},
    macroDeficitBreakdown: {...mockMacroBreakdown},
    macroSuggestedBreakdown: {...mockMacroBreakdown},
    caloriesBreakdown: {...mockCaloriesBreakdown},
    caloriesDeficitBreakdown: {...mockCaloriesBreakdown},
    caloriesSuggestedBreakdown: {...mockCaloriesBreakdown},
};

export const mockFoodLogsData = {
    list: [
        createFoodLog(1, moment(todayDate).subtract(6, 'days').format("MM/DD/YYYY")),
        createFoodLog(2, moment(todayDate).subtract(5, 'days').format("MM/DD/YYYY")),
        createFoodLog(3, moment(todayDate).subtract(4, 'days').format("MM/DD/YYYY")),
        createFoodLog(4, moment(todayDate).subtract(3, 'days').format("MM/DD/YYYY")),
        createFoodLog(5, moment(todayDate).subtract(2, 'days').format("MM/DD/YYYY")),
        createFoodLog(6, moment(todayDate).subtract(1, 'days').format("MM/DD/YYYY")),
        createFoodLog(7, moment(todayDate).format("MM/DD/YYYY"))
    ]
};
