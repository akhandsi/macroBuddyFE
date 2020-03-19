import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {IChartStyleConfig, MacroColorUtils, ChartColorUtils} from "../../utils";
import * as MyTypes from "MyTypes";
import {connect} from "react-redux";
import {IComparisonData, IFoodLog} from "../../models";
import ShadowBarShape from "./sharedComponents/ShadowBarShape";
import BarChartTableTooltip from "./sharedComponents/BarChartTableTooltip";

interface IOverTimeMacrosChartProp {
    foodLogs: IFoodLog[];
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
        chartContainer: {
            ...barChartColorConfig.chart
        },
        graphContainer: {
            ...barChartColorConfig.graph
        },
    }),
);

/**
 * Macros Chart displays trend over time for protein, carbohydrates and fats in grams from the logged
 * foodLogs.
 *
 * @param props foodLog props
 */
function OverTimeMacrosChart(props: IOverTimeMacrosChartProp) {
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
                name: 'Protein(g)',
                colorConfig: barChartColorConfig.fields.protein,
                current: payload.breakdownSummary.macroBreakdown.protein,
                suggested: payload.breakdownSummary.macroSuggestedBreakdown.protein,
            },
            {
                name: 'Carbohydrates(g)',
                colorConfig: barChartColorConfig.fields.carbohydrates,
                current: payload.breakdownSummary.macroBreakdown.carbohydrates,
                suggested: payload.breakdownSummary.macroSuggestedBreakdown.carbohydrates,
            },
            {
                name: 'Fats(g)',
                colorConfig: barChartColorConfig.fields.fats,
                current: payload.breakdownSummary.macroBreakdown.fats,
                suggested: payload.breakdownSummary.macroSuggestedBreakdown.fats,
            }
        ]
    };

    return (
        <div className={classes.chartContainer} id="overTimeMacrosChart">
            <div className={classes.graphContainer}>
                <ResponsiveContainer>
                    <BarChart data={props.foodLogs} barGap={8}>

                        <XAxis dataKey="date" xAxisId={0}/>
                        <XAxis dataKey="date" xAxisId={1} hide/>

                        <YAxis/>

                        <Tooltip cursor={{fill: barChartColorConfig.tooltip.shades.lightest}}
                                 content={<BarChartTableTooltip getDataFromPayload={payloadToComparisonData}/>}/>

                        <Legend verticalAlign="top" height={36}/>

                        {/*Suggested Macro bars with custom shape display as shadow*/}
                        <Bar name="Protein Goal(g)"
                             dataKey="breakdownSummary.macroSuggestedBreakdown.protein"
                             fill={barChartColorConfig.fields.protein.main}
                             minPointSize={5}
                             barSize={10}
                             xAxisId={0}
                             shape={<ShadowBarShape/>}>
                            {getBarCellElements()}
                        </Bar>

                        <Bar name="Carbohydrates Goal(g)"
                             dataKey="breakdownSummary.macroSuggestedBreakdown.carbohydrates"
                             fill={barChartColorConfig.fields.carbohydrates.main}
                             minPointSize={5}
                             barSize={10}
                             xAxisId={0}
                             shape={<ShadowBarShape/>}>
                            {getBarCellElements()}
                        </Bar>

                        <Bar name="Fats Goal(g)"
                             dataKey="breakdownSummary.macroSuggestedBreakdown.fats"
                             fill={barChartColorConfig.fields.fats.main}
                             minPointSize={5}
                             barSize={10}
                             xAxisId={0}
                             shape={<ShadowBarShape/>}>
                            {getBarCellElements()}
                        </Bar>

                        {/* Food Log's current Macro bars*/}
                        <Bar name="Protein(g)"
                             dataKey="breakdownSummary.macroBreakdown.protein"
                             fill={barChartColorConfig.fields.protein.main}
                             minPointSize={5}
                             barSize={10}
                             xAxisId={1}>
                            {getBarCellElements()}
                        </Bar>

                        <Bar name="Carbohydrates(g)"
                             dataKey="breakdownSummary.macroBreakdown.carbohydrates"
                             fill={barChartColorConfig.fields.carbohydrates.main}
                             minPointSize={5}
                             barSize={10}
                             xAxisId={1}>
                            {getBarCellElements()}
                        </Bar>

                        <Bar name="Fats(g)"
                             dataKey="breakdownSummary.macroBreakdown.fats"
                             fill={barChartColorConfig.fields.fats.main}
                             minPointSize={5}
                             barSize={10}
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

export default connect(mapStateToProps)(OverTimeMacrosChart);
