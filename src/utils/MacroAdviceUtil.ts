import {
    CaloriePerGram,
    Gender,
    Goal, IMacroAdvice,
    IMacroBreakdown,
    MacroType,
    NumOfExerciseDays,
    IUserProfile
} from "../models";

/**
 * MacroAdviceUtil class provides utility methods to deal with macro and calorie calculations.
 */
export class MacroAdviceUtil {

    /**
     * Calculate BMR for the given arguments.
     *
     * @param gender Gender type that is either Male or Female.
     * @param bodyWeight body weight in kilograms
     * @param bodyHeight body height in centimeters
     * @param age age of the user
     */
    private static calculateBMR(gender: Gender, bodyWeight: number, bodyHeight: number, age: number): number {
        let bmr = 0;

        if (gender === Gender.MALE) {
            bmr = 66 + (13.7 * bodyWeight) + (5 * bodyHeight) - (6.8 * age);
        }

        if (gender === Gender.FEMALE) {
            bmr = 655 + (9.6 * bodyWeight) + (1.8 * bodyHeight) - (4.7 * age);
        }

        return parseFloat(bmr.toFixed(0));
    }

    /**
     * Calculate total daily energy expenditure based on BMR and number of exercise days per week.
     *
     * @param bmrCalories basic metabolism rate calories
     * @param numOfExerciseDays number of exercise days per week
     */
    private static calculateTEE(bmrCalories: number, numOfExerciseDays: NumOfExerciseDays): number {
        let totalCalories = 0;

        // For sedentary (little or no exercise)
        if (numOfExerciseDays === NumOfExerciseDays.ZERO) {
            totalCalories = bmrCalories * 1.2;
        }

        // For lightly active (light exercise/sports 1-3 days/ week)
        if (numOfExerciseDays >= NumOfExerciseDays.ONE &&
            numOfExerciseDays <= NumOfExerciseDays.THREE) {
            totalCalories = bmrCalories * 1.375;
        }

        // For moderately active (moderate exercise/sports 3-5days/week)
        if (numOfExerciseDays >= NumOfExerciseDays.THREE &&
            numOfExerciseDays <= NumOfExerciseDays.FIVE) {
            totalCalories = bmrCalories * 1.55;
        }

        // For very active (hard exercise/sports 6-7 days a week)
        if (numOfExerciseDays >= NumOfExerciseDays.SIX &&
            numOfExerciseDays <= NumOfExerciseDays.SEVEN) {
            totalCalories = bmrCalories * 1.725;
        }

        return parseFloat(totalCalories.toFixed(0));
    }

    /**
     * Calculate Macro based on TEE, body weight and goal. Weight loss or gain is controlled by calorie deficit or
     * abundance.
     *
     * @param totalCalories total daily energy expenditure
     * @param bodyWeight body weight in kilograms
     * @param goal Goal including weight loss, weight gain and weigh loss with muscle gain.
     */
    private static calculateMacro(totalCalories: number, bodyWeight: number, goal: Goal): IMacroBreakdown {
        let totalCaloriesToEat = 0;

        if (goal === Goal.WEIGHT_LOSS) {
            totalCaloriesToEat = totalCalories - 500;
            const proteinInGrams = (2 * bodyWeight);
            const proteinCalories = MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.PROTEIN, proteinInGrams);
            const remainingCalories = totalCaloriesToEat - proteinCalories;
            const carbohydratesCalories = remainingCalories * 0.60;
            const carbohydratesInGrams = carbohydratesCalories / CaloriePerGram.CARBOHYDRATES;
            const fatsCalories = remainingCalories * 0.40;
            const fatsInGrams = fatsCalories / CaloriePerGram.FATS;
            return {
                carbohydrates: parseFloat(carbohydratesInGrams.toFixed(0)),
                protein: parseFloat(proteinInGrams.toFixed(0)),
                fats: parseFloat(fatsInGrams.toFixed(0)),
            }
        }

        if (goal === Goal.WEIGHT_GAIN) {
            totalCaloriesToEat = totalCalories + 500;
        }

        return {
            carbohydrates: parseFloat(((totalCaloriesToEat * 0.40) / CaloriePerGram.CARBOHYDRATES).toFixed(0)),
            protein: parseFloat(((totalCaloriesToEat * 0.30) / CaloriePerGram.PROTEIN).toFixed(0)),
            fats: parseFloat(((totalCaloriesToEat * 0.30) / CaloriePerGram.FATS).toFixed(0)),
        }
    }

    /**
     * Calculate Total calories for a given macros breakdown.
     *
     * @param macros macro breakdown containing amount in gram for protein, carbohydrates and fats.
     */
    public static calculateTotalCaloriesForMacros(macros: IMacroBreakdown): number {
        return MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.PROTEIN, macros.protein) +
            MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.CARBOHYDRATES, macros.carbohydrates) +
            MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.FATS, macros.fats);
    }

    /**
     * Generate Macros for given user profile.
     *
     * @param profileModel user profile containing basic information about user.
     */
    public static generateMacros(profileModel: IUserProfile): IMacroAdvice | null {
        const bodyWeight = profileModel.bodyWeightInKGS;
        const bodyHeight = profileModel.bodyHeightInCMS;
        const age = profileModel.age;
        const gender = profileModel.gender;
        const numOfExerciseDays = profileModel.numOfExerciseDays;
        const goal = profileModel.goal;

        if (bodyWeight === undefined ||
            bodyHeight === undefined ||
            age === undefined ||
            gender === undefined ||
            numOfExerciseDays === undefined ||
            goal === undefined) {
            return null;
        }

        let bmrCalories = MacroAdviceUtil.calculateBMR(gender, bodyWeight, bodyHeight, age);
        let totalCalories = MacroAdviceUtil.calculateTEE(bmrCalories, numOfExerciseDays);
        let macros = MacroAdviceUtil.calculateMacro(totalCalories, bodyWeight, goal);
        let currentCalories = MacroAdviceUtil.calculateTotalCaloriesForMacros(macros);

        return {
            bmrCalories,
            totalCalories,
            currentCalories,
            macros
        };
    }

    /**
     * Calculate calories for a given macro type, eg: Protein and Carbohydrates are 4 cal per gram, where as Fats are
     * 9 cal per gram.
     *
     * @param type MacroType including protein, carbohydrates or fats
     * @param value value in grams for the macro type
     */
    public static calculateCaloriesForMacroType(type: MacroType, value: number): number {
        if (type === MacroType.PROTEIN) {
            return value * CaloriePerGram.PROTEIN;
        }

        if (type === MacroType.CARBOHYDRATES) {
            return value * CaloriePerGram.CARBOHYDRATES;
        }

        if (type === MacroType.FATS) {
            return value * CaloriePerGram.FATS;
        }

        return 0;
    }
}
