import {IMeal, IMealSortModel, MealSortField, SortOrder} from "../models";

/**
 * MealUtil class provides utility methods to deal with meal and their calorie calculations.
 */
export class MealUtil {

    /**
     * Create meal id to prop map that can be used for sorting.
     *
     * @param meals list of meals
     * @param sortField meal sort field
     */
    public static createMealIdToPropMap(meals: IMeal[], sortField: MealSortField) {
        const mealIdToPropMap = {};
        meals.forEach(meal => {

            let value;
            if (sortField === MealSortField.PROTEIN ||
                sortField === MealSortField.CARBOHYDRATES ||
                sortField === MealSortField.FATS
            ) {
                value = meal.macros[sortField.valueOf()];
            } else {
                value =  meal[sortField.valueOf()];
            }

            mealIdToPropMap[meal.id] = value;
        });
        return mealIdToPropMap;
    }

    /**
     * Sort Meals based on sort model.
     *
     * @param meals list of meals
     * @param sortModel sort model containing sort property and sort order
     */
    public static sortMeals(meals: IMeal[], sortModel: IMealSortModel): IMeal[] {
        const mealIdToPropMap = MealUtil.createMealIdToPropMap(meals, sortModel.sortProperty);

        const numericComparator = (a: number, b: number) => a - b;

        const stringComparator = (a: string, b: string) => a > b ? -1 : 1;

        if (sortModel.sortOrder === SortOrder.ASC) {
            return meals.sort((a, b) => {
                if (sortModel.sortProperty === MealSortField.NAME) {
                    return stringComparator(mealIdToPropMap[a.id], mealIdToPropMap[b.id]);
                }
                return numericComparator(mealIdToPropMap[a.id], mealIdToPropMap[b.id]);
            });
        }

        return meals.sort((a, b) => {
            if (sortModel.sortProperty === MealSortField.NAME) {
                return stringComparator(mealIdToPropMap[b.id], mealIdToPropMap[a.id]);
            }
            return numericComparator(mealIdToPropMap[b.id], mealIdToPropMap[a.id]);
        });
    }
}
