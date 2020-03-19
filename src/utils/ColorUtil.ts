import {ThemeUtil} from "./ThemeUtil";
import {Theme} from "@material-ui/core";

export interface IColorOptions {
    lightest: string;
}

export interface IColorConfig {
    main: string,
    shades: IColorOptions,
}

export interface IFieldColorConfig {
    [key: string]: IColorConfig
}

export interface IChartStyle {
    margin: number;
}

export interface IGraphStyle {
    width: number | string;
    height: number | string;
}

export interface ILegendColorConfig extends IFieldColorConfig {
    first: IColorConfig,
    second: IColorConfig,
    third: IColorConfig,
    fourth: IColorConfig,
    fifth: IColorConfig
}

export interface IMacroColorConfig extends IFieldColorConfig {
    protein: IColorConfig,
    carbohydrates: IColorConfig,
    fats: IColorConfig
}

export interface ICaloriesColorConfig extends IFieldColorConfig {
    current: IColorConfig,
    tee: IColorConfig,
    bmr: IColorConfig,
    protein: IColorConfig,
    carbohydrates: IColorConfig,
    fats: IColorConfig,
}

export interface IChartStyleConfig {
    tooltip: IColorConfig;
    fields: IFieldColorConfig;
    chart: IChartStyle;
    graph: IGraphStyle;
}

export interface IFieldColorUtil<T> {
    getConfiguration(): T;
}

export interface IColorUtils<T, U> {
    getConfiguration(fieldColorUtil: T): U;
}

/**
 * Abstract color utils class
 */
export abstract class AbstractColorUtils {
    public abstract getConfiguration(): IFieldColorConfig;
}

/**
 * Legend Color Utils class defines mechanisms to retrieve color configuration for any random legend set.
 */
export class LegendColorUtils extends AbstractColorUtils implements IFieldColorUtil<ILegendColorConfig> {

    /**
     * Get Configuration method returns a legend color config that contains color schemes for random legends.
     */
    public getConfiguration(): ILegendColorConfig {
        return {
            first: {
                main: '#bb6e25',
                shades: {
                    lightest: 'none'
                }
            },
            second: {
                main: '#c27b2a',
                shades: {
                    lightest: 'none'
                }
            },
            third: {
                main: '#c9882f',
                shades: {
                    lightest: 'none'
                }
            },
            fourth: {
                main: '#cd9234',
                shades: {
                    lightest: 'none'
                }
            },
            fifth: {
                main: '#d3a043',
                shades: {
                    lightest: 'none'
                }
            },
        }
    }
}

/**
 * Macro Color Utils class defines mechanisms to retrieve color configuration for macros, i.e. Protein, Carbohydrates &
 * Fats.
 */
export class MacroColorUtils extends AbstractColorUtils implements IFieldColorUtil<IMacroColorConfig> {

    /**
     * Get Configuration method returns a macro color config that contains color schemes for all the three macros
     * i.e. Protein, Carbohydrates and Fats.
     */
    public getConfiguration(): IMacroColorConfig {
        return {
            protein: {
                main: '#15a80e',
                shades: {
                    lightest: '#cfedc2'
                }
            },
            carbohydrates: {
                main: '#d56e02',
                shades: {
                    lightest: '#ee8e6f'
                }
            },
            fats: {
                main: '#009999',
                shades: {
                    lightest: '#92c6f1'
                }
            }
        }
    }
}

/**
 * Calories Color Utils class defines mechanisms to retrieve color configuration for calories.
 */
export class CaloriesColorUtils extends AbstractColorUtils implements IFieldColorUtil<ICaloriesColorConfig> {

    /**
     * Get Configuration method returns a calorie color config that contains color schemes for all the three calories
     * i.e. BMR, TEE and Current.
     */
    public getConfiguration(): ICaloriesColorConfig {
        return {
            current: {
                main: '#1b79e3',
                shades: {
                    lightest: '#e4f2fd'
                }
            },
            tee: {
                main: '#1b79e3',
                shades: {
                    lightest: '#e4f2fd'
                }
            },
            bmr: {
                main: '#1b79e3',
                shades: {
                    lightest: '#e4f2fd'
                }
            },
            ...new MacroColorUtils().getConfiguration()
        }
    }
}

/**
 * Chart Color Utils define mechanism to retrieve color configuration for charts.
 */
export class ChartColorUtils implements IColorUtils<AbstractColorUtils, IChartStyleConfig> {

    /**
     * Get chart color config. This method would work for any given util instance of type AbstractColorUtils and returns
     * a IChartStyleConfig.
     *
     * @param fieldColorUtil type of AbstractColorUtils.
     */
    public getConfiguration(fieldColorUtil: AbstractColorUtils): IChartStyleConfig {
        const theme: Theme = ThemeUtil.getTheme();
        return {
            chart: {
                margin: theme.spacing(1.4)
            },
            graph: {
                width: '100%',
                height: 200
            },
            tooltip: {
                main: 'none',
                shades: {
                    lightest: 'none'
                }
            },
            fields: fieldColorUtil.getConfiguration()
        };
    }
}
