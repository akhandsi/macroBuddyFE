import {
    IFoodLogCaloriesBreakdown,
    IFoodLogBreakdownSummary,
    IFoodLog,
    IMacroAdvice,
    IMacroBreakdown,
    MacroType,
    IMeal
} from "../models";
import {MacroAdviceUtil} from "./MacroAdviceUtil";

/**
 * Food Log Util class to provide methods to deal with different aspects of foodLog.
 */
export class FoodLogUtil {

    /**
     * Get calories breakdown for all the given food logs. Use recommended macros to calculate deficit.
     *
     * @param foodLogs current foodLogs in the application state
     * @param recommendedMacro macro recommended based on the user profile
     */
    public static getCaloriesBreakdownForFoodLogs(foodLogs: IFoodLog[], recommendedMacro: IMacroAdvice): IFoodLogBreakdownSummary[] {
        return foodLogs.map((foodLog: IFoodLog) => {
            return FoodLogUtil.getCaloriesBreakdownForFoodLog(foodLog, recommendedMacro);
        })
    }

    /**
     * Get calories breakdown for the given food log. Use recommended macros to calculate deficit.
     *
     * @param foodLog one of the foodLog in the application state
     * @param recommendedMacro macro recommended based on the user profile
     */
    public static getCaloriesBreakdownForFoodLog(foodLog: IFoodLog, recommendedMacro: IMacroAdvice): IFoodLogBreakdownSummary {
        const macroBreakdown: IMacroBreakdown = FoodLogUtil.getMacroBreakdown(foodLog);
        const macroDiffBreakdown: IMacroBreakdown =
            FoodLogUtil.getMacroDeficitBreakdown(macroBreakdown, recommendedMacro.macros);
        const caloriesBreakdown: IFoodLogCaloriesBreakdown = FoodLogUtil.getCaloriesBreakdown(macroBreakdown);
        const caloriesDiffBreakdown: IFoodLogCaloriesBreakdown =
            FoodLogUtil.getCaloriesDeficitBreakdown(caloriesBreakdown, recommendedMacro);
        return {
            macroBreakdown,
            macroDeficitBreakdown: macroDiffBreakdown,
            macroSuggestedBreakdown: {...recommendedMacro.macros},
            caloriesBreakdown,
            caloriesDeficitBreakdown: caloriesDiffBreakdown,
            caloriesSuggestedBreakdown: {
                totalCalories: recommendedMacro.totalCalories,
                proteinCalories: MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.PROTEIN, recommendedMacro.macros.protein),
                carbohydratesCalories: MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.CARBOHYDRATES, recommendedMacro.macros.carbohydrates),
                fatsCalories: MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.FATS, recommendedMacro.macros.fats)
            },
        };
    }

    /**
     * Get macro breakdown for the foodLog.
     *
     * @param foodLog foodLog model
     */
    private static getMacroBreakdown(foodLog: IFoodLog): IMacroBreakdown {
        return foodLog.meals.reduce((macroBreakdown: IMacroBreakdown, meal: IMeal) => {
            macroBreakdown.protein += meal.macros.protein;
            macroBreakdown.carbohydrates += meal.macros.carbohydrates;
            macroBreakdown.fats += meal.macros.fats;
            return macroBreakdown;
        }, {
            protein: 0,
            carbohydrates: 0,
            fats: 0,
        })
    }

    /**
     * Get macro deficit breakdown between the given macroBreakdown and recommended macro breakdown.
     *
     * @param macroBreakdown current macro breakdown
     * @param recommendedMacroBreakdown recommended macro breakdown
     */
    private static getMacroDeficitBreakdown(macroBreakdown: IMacroBreakdown, recommendedMacroBreakdown: IMacroBreakdown): IMacroBreakdown {
        return {
            protein: Math.abs(macroBreakdown.protein - recommendedMacroBreakdown.protein),
            carbohydrates: Math.abs(macroBreakdown.carbohydrates - recommendedMacroBreakdown.carbohydrates),
            fats: Math.abs(macroBreakdown.fats - recommendedMacroBreakdown.fats),
        }
    }

    /**
     * Get Calories breakdown from the given macro breakdown.
     *
     * @param macroBreakdown macro breakdown
     */
    private static getCaloriesBreakdown(macroBreakdown: IMacroBreakdown): IFoodLogCaloriesBreakdown {
        return {
            totalCalories: MacroAdviceUtil.calculateTotalCaloriesForMacros(macroBreakdown),
            proteinCalories: MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.PROTEIN, macroBreakdown.protein),
            carbohydratesCalories: MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.CARBOHYDRATES, macroBreakdown.carbohydrates),
            fatsCalories: MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.FATS, macroBreakdown.fats),
        };
    }

    /**
     * Get Calories deficit breakdown from the given current calories breakdown and recommended macro.
     *
     * @param caloriesBreakdown current calories breakdown
     * @param recommendedMacro recommended macro
     */
    private static getCaloriesDeficitBreakdown(caloriesBreakdown: IFoodLogCaloriesBreakdown,
                                               recommendedMacro: IMacroAdvice): IFoodLogCaloriesBreakdown {
        return {
            totalCalories: Math.abs(caloriesBreakdown.totalCalories - recommendedMacro.currentCalories),
            proteinCalories: Math.abs(caloriesBreakdown.proteinCalories
                - MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.PROTEIN, recommendedMacro.macros.protein)),
            carbohydratesCalories: Math.abs(caloriesBreakdown.carbohydratesCalories
                - MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.CARBOHYDRATES, recommendedMacro.macros.carbohydrates)),
            fatsCalories: Math.abs(caloriesBreakdown.fatsCalories
                - MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.FATS, recommendedMacro.macros.fats)),
        };
    }
}
