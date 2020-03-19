import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {Bar, BarChart, ResponsiveContainer} from 'recharts';
import {IChartStyleConfig, MacroColorUtils, ChartColorUtils} from "../../utils";
import * as MyTypes from "MyTypes";
import {connect} from "react-redux";
import {IFoodLog} from "../../models";

interface IFoodLogMacrosChartProp {
    foodLog: IFoodLog;
}

/**
 * Use existing color coding for macros trends in chart.
 */
const barChartColorConfig: IChartStyleConfig = new ChartColorUtils()
    .getConfiguration(new MacroColorUtils());

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        graphContainer: {
            marginTop: '4px !important',
            width: 46,
            height: 40,
        },
    }),
);

/**
 * Food log Macros Chart displays breakdown of protein, carbohydrates and fats in grams for the given foodLog.
 *
 * @param props foodLog props
 */
function FoodLogMacrosChart(props: IFoodLogMacrosChartProp) {
    const classes = useStyles();

    return (
        <div className={classes.graphContainer}>
            <ResponsiveContainer>
                <BarChart data={[props.foodLog]}>
                    <Bar name="Protein(g)"
                         dataKey="breakdownSummary.macroBreakdown.protein"
                         fill={barChartColorConfig.fields.protein.main}
                         minPointSize={5}>
                    </Bar>

                    <Bar name="Carbohydrates(g)"
                         dataKey="breakdownSummary.macroBreakdown.carbohydrates"
                         fill={barChartColorConfig.fields.carbohydrates.main}
                         minPointSize={5}>
                    </Bar>

                    <Bar name="Fats(g)"
                         dataKey="breakdownSummary.macroBreakdown.fats"
                         fill={barChartColorConfig.fields.fats.main}
                         minPointSize={5}>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    macroAdvice: state.macroAdviceReducer
});

export default connect(mapStateToProps)(FoodLogMacrosChart);
