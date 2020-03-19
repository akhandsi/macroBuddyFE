import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {Cell, Pie, PieChart, Tooltip, ResponsiveContainer, TooltipPayload, PieLabelRenderProps} from 'recharts';
import {IMeal} from "../../models";
import {ChartColorUtils, IChartStyleConfig, LegendColorUtils} from "../../utils";

interface IMealsCaloriesPieChartProp {
    meals: IMeal[];
}

/**
 * Use existing color coding for legends trends in chart.
 */
const chartColorConfig: IChartStyleConfig = new ChartColorUtils()
    .getConfiguration(new LegendColorUtils());

/**
 * Define colors config for meal breakdown.
 */
const COLORS = [
    chartColorConfig.fields.first,
    chartColorConfig.fields.second,
    chartColorConfig.fields.third,
    chartColorConfig.fields.fourth,
    chartColorConfig.fields.fifth
];

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        graphContainer: {
            ...chartColorConfig.graph,
            height: 160
        },
    }),
);

/**
 * Food Log Meal Pie Chart displays breakdown of all the meals and their calories for a given food log item.
 *
 * @param props foodLog props
 */
export default function MealsCaloriesPieChart(props: IMealsCaloriesPieChartProp) {
    const classes = useStyles();

    /**
     * Pie chart expects data in <name,value> pair so we need to transform given meals.
     */
    const pieChartData = props.meals.map(meal => {
        return {
            name: meal.name,
            value: meal.calories,
        };
    });

    /**
     * Get pie chart tooltip formatter.
     *
     * @param value number
     * @param name name of the data point
     * @param entry tooltip data object
     * @param index index of current data
     */
    const pieChartToolTipFormatter = (value: any, name: string, entry: TooltipPayload, index: number) => {
        return <span>{value} Cals</span>;
    };

    /**
     * Pie chart label renderer to render name of the meal and calorie.
     *
     * @param renderProps
     */
    const pieChartLabelRenderer = (renderProps: PieLabelRenderProps) => {
        const RADIAN = Math.PI / 180;

        // @ts-ignore
        const innerRadius: number = renderProps.innerRadius;
        // @ts-ignore
        const outerRadius: number = renderProps.outerRadius;
        // @ts-ignore
        const cx: number = renderProps.cx;
        // @ts-ignore
        const cy: number = renderProps.cy;
        // @ts-ignore
        const midAngle: number = renderProps.midAngle;
        // @ts-ignore
        const index: number = renderProps.index;

        const radius = 25 + innerRadius + (outerRadius - innerRadius);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // @ts-ignore
        return (
            <text
                x={x}
                y={y}
                fill={COLORS[index].main}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central">
                {renderProps.value} Cals
            </text>
        );
    };

    return (
        <div className={classes.graphContainer}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={pieChartData}
                         outerRadius={36}
                         fill="#8884d8"
                         dataKey="value"
                         nameKey="name"
                         label={pieChartLabelRenderer}>
                        {
                            pieChartData.map((entry: any, index: number) => {
                                return <Cell key={`pie-chart-${index}`} fill={COLORS[index].main}/>
                            })
                        }
                    </Pie>
                    <Tooltip formatter={pieChartToolTipFormatter}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
