import {
    NumOfMealsInADay,
    IMeal,
    IMealSuggestions,
    IMealSuggestion,
    MealSortField,
    SortOrder
} from "../models";
import {MealUtil} from "./index";

/**
 * MealSuggestionUtil class provides utility methods to get meal suggestions.
 */
export class MealSuggestionUtil {

    /**
     * Get n meal suggestions based on current calories, total calories allowed to eat, distributed via number of meals
     * that user wants to eat.
     *
     * @param numOfMealsInADay number of meals user wants to eat in a day
     * @param currentCalories total current calories that user is allowed to eat in a day
     * @param meals current uploaded user meals
     * @param numOfSuggestions number of suggestions that need to be generated
     */
    public static getSuggestions(numOfMealsInADay: NumOfMealsInADay, currentCalories: number, meals: IMeal[],
                                 numOfSuggestions: number = numOfMealsInADay): IMealSuggestions {
        const suggestions: IMealSuggestions = {
            list: []
        };
        for (let i = 0; i< numOfSuggestions; i++) {
            const suggestedMeals = MealSuggestionUtil.getMeals(numOfMealsInADay, currentCalories, meals);
            const suggestionItem: IMealSuggestion = {
                meals: suggestedMeals,
                totalCalories: MealSuggestionUtil.calculateCalories(suggestedMeals)
            };
            suggestions.list.push(suggestionItem);
        }
        return suggestions;
    }

    /**
     * Get meals suggestions based on current meals, total calories allowed to eat, distributed via number of meals
     * that user wants to eat.
     *
     * @param numOfMealsInADay number of meals user wants to eat in a day
     * @param currentCalories total current calories that user is allowed to eat in a day
     * @param meals current uploaded user meals
     */
    private static getMeals(numOfMealsInADay: NumOfMealsInADay, currentCalories: number,
                            meals: IMeal[]): IMeal[] {
        const averageCaloriesPerMeal: number = currentCalories / numOfMealsInADay.valueOf();
        const sortedMeals = MealUtil.sortMeals(meals, {
            sortOrder: SortOrder.DESC,
            sortProperty: MealSortField.CALORIES
        });
        const calorieSubsets = MealSuggestionUtil.createMealsSubsets(sortedMeals, averageCaloriesPerMeal);
        return MealSuggestionUtil.createSuggestions(calorieSubsets, numOfMealsInADay);
    }

    /**
     * Create low and more calories subset of meals based on average calorie per meal.
     *
     * @param meals current uploaded user meals
     * @param averageCaloriesPerMeal average calories per meal
     */
    private static createMealsSubsets(meals: IMeal[], averageCaloriesPerMeal: number): any {
        let lowCaloriesList: any = [];
        let moreCaloriesList: any = [];

        meals.forEach(meal => {
            if (meal.calories > averageCaloriesPerMeal) {
                moreCaloriesList.push(meal);
            } else {
                lowCaloriesList.push(meal);
            }
        });

        return {
            lowCaloriesList,
            moreCaloriesList
        }
    }

    /**
     * Create Suggestion from the calorie subset distributed via num of meals in a day.
     *
     * @param calorieSubsets low and more calories subset of meals based on average calorie per meal
     * @param numOfMealsInADay number of meals user wants to eat in a day
     */
    private static createSuggestions(calorieSubsets: any, numOfMealsInADay: number): any {
        const moreCaloriesList = calorieSubsets.moreCaloriesList;
        const lowCaloriesList = calorieSubsets.lowCaloriesList;

        if (numOfMealsInADay === NumOfMealsInADay.FIVE) {
            return MealSuggestionUtil.suggestMoreThanOneMeal(moreCaloriesList, lowCaloriesList, numOfMealsInADay);
        }

        if (numOfMealsInADay === NumOfMealsInADay.THREE) {
            return MealSuggestionUtil.suggestMoreThanOneMeal(moreCaloriesList, lowCaloriesList, numOfMealsInADay);
        }

        return [];
    }

    /**
     * Suggest more than one meal for the day.
     *
     * @param moreCaloriesList meal with more calories than average calories per meal
     * @param lowCaloriesList meal with low calories than average calories per meal
     * @param numOfMealsInADay total number of meals user wants to eat in a day.
     */
    private static suggestMoreThanOneMeal(moreCaloriesList: IMeal[], lowCaloriesList: IMeal[],
                                          numOfMealsInADay: NumOfMealsInADay): any {
        const moreCaloriesLength = moreCaloriesList.length;
        const lowCaloriesLength = lowCaloriesList.length;
        const numOfMeals = moreCaloriesLength + lowCaloriesLength;
        const moreRange = Math.floor(numOfMealsInADay / 2);
        const lowRange = Math.ceil(numOfMealsInADay / 2);

        // if we have exact matching number of meals, return that.
        if (numOfMeals <= numOfMealsInADay) {
            return MealSuggestionUtil.shuffle([...moreCaloriesList, ...lowCaloriesList]);
        } else {

            // if we have less than half of more calories meals or less than half of low calories meals
            if (moreCaloriesLength < moreRange || lowCaloriesLength < lowRange) {
                return MealSuggestionUtil.shuffle([...moreCaloriesList, ...lowCaloriesList])
                    .slice(0, numOfMealsInADay);
            }

            return [
                ...MealSuggestionUtil.shuffle(moreCaloriesList).slice(0, moreRange),
                ...MealSuggestionUtil.shuffle(lowCaloriesList).slice(0, lowRange)
            ];
        }
    }

    /**
     * Shuffle given meals so suggestions are created in a random order.
     *
     * @param meals current uploaded user meals
     */
    private static shuffle(meals: IMeal[]) {
        for (let i = meals.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [meals[i], meals[j]] = [meals[j], meals[i]];
        }
        return meals;
    }

    /**
     * Given set of meals calculate total calories of this set.
     *
     * @param meals current uploaded user meals list
     */
    private static calculateCalories(meals: IMeal[]): number {
        return meals.reduce((sum: number, meal: IMeal) => sum + meal.calories, 0);
    }
}
