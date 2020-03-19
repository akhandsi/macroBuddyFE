import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {CaloriesColorUtils, ChartColorUtils, IChartStyleConfig} from "../../utils";
import * as MyTypes from "MyTypes";
import {IComparisonData, IFoodLog} from "../../models";
import {connect} from "react-redux";
import BarChartTableTooltip from "./sharedComponents/BarChartTableTooltip";
import ShadowBarShape from "./sharedComponents/ShadowBarShape";

interface IOverTimeCaloriesChartProp {
    foodLogs: IFoodLog[];
}

/**
 * Use existing color coding for calorie trends in chart.
 */
const lineChartColorConfig: IChartStyleConfig = new ChartColorUtils()
    .getConfiguration(new CaloriesColorUtils());

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chartContainer: {
            ...lineChartColorConfig.chart
        },
        graphContainer: {
            ...lineChartColorConfig.graph
        },
    }),
);

/**
 * Calories Chart displays trend over time for total calories, protein, carbohydrates and fats calories from the logged
 * foodLogs.
 *
 * @param props foodLog props
 */
function OverTimeCaloriesChart(props: IOverTimeCaloriesChartProp) {
    const classes = useStyles();

    /**
     * Get Bar cell elements.
     */
    const getBarCellElements = () => {
        return props.foodLogs.map((entry, index) => (
            <Cell cursor="pointer" key={`cell-${index}`}/>
        ))
    };

    /**
     * Convert payload to comparison data.
     *
     * @param payload IFoodLogBreakdownSummary
     */
    const payloadToComparisonData = (payload: IFoodLog): IComparisonData[] => {
        return [
            {
                name: 'Total Calories',
                colorConfig: lineChartColorConfig.fields.current,
                current: payload.breakdownSummary.caloriesBreakdown.totalCalories,
                suggested: payload.breakdownSummary.caloriesSuggestedBreakdown.totalCalories,
            }
        ]
    };

    return (
        <div className={classes.chartContainer} id="overTimeCaloriesChart">
            <div className={classes.graphContainer}>
                <ResponsiveContainer>
                    <BarChart data={props.foodLogs} barGap={8}>

                        <XAxis dataKey="date" xAxisId={0}/>
                        <XAxis dataKey="date" xAxisId={1} hide/>

                        <YAxis/>

                        <Tooltip cursor={{fill: lineChartColorConfig.tooltip.shades.lightest}}
                                 content={<BarChartTableTooltip getDataFromPayload={payloadToComparisonData}/>}/>

                        <Legend verticalAlign="top" height={36}/>

                        <Bar name="Calories Goal"
                             dataKey="breakdownSummary.caloriesSuggestedBreakdown.totalCalories"
                             fill="rgb(255, 255, 255, 0.1)"
                             minPointSize={5}
                             barSize={15}
                             xAxisId={0}
                             shape={<ShadowBarShape/>}>
                            {getBarCellElements()}
                        </Bar>

                        <Bar name="Calories Consumed"
                             dataKey="breakdownSummary.caloriesBreakdown.totalCalories"
                             fill={lineChartColorConfig.fields.current.main}
                             minPointSize={5}
                             barSize={15}
                             xAxisId={1}>
                            {getBarCellElements()}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    foodLogs: state.foodLogReducer.list,
});

export default connect(mapStateToProps)(OverTimeCaloriesChart);
