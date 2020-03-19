import 'react-vertical-timeline-component/style.min.css';
import React, {Dispatch} from 'react';
import {connect} from "react-redux";
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import * as MyTypes from "MyTypes";
import {FoodLogTreeMode, IFoodLog, IMacroAdvice, IMeal} from "../../models";
import {FoodLogActionTypes, IFoodLogAction} from "../../actions/FoodLogActionTypes";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Grid, IconButton, Typography} from "@material-ui/core";
import FastfoodRoundedIcon from '@material-ui/icons/FastfoodRounded';
import EditFoodLog from "../addEditFoodLog/EditFoodLog";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {red} from "@material-ui/core/colors";
import MealsChart from "../charts/MealsCaloriesPieChart";
import FastfoodIcon from '@material-ui/icons/Fastfood';
import {ChartColorUtils, IChartStyleConfig, LegendColorUtils} from "../../utils";
import FoodLogMacrosChart from "../charts/FoodLogMacrosChart";
import {mockFoodLogBreakdownSummary} from "../../models/MockData";

interface IFoodLogTreeProps {
    foodLogs: IFoodLog[];
    macroAdvice: IMacroAdvice;
    mode: FoodLogTreeMode,
    editFoodLog: (foodLog: IFoodLog) => void;
    removeFoodLog: (foodLog: IFoodLog) => void;
}

/**
 * Use existing color coding for macros trends in chart.
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
 * Initial foodLog state.
 */
const foodLog: IFoodLog = {
    breakdownSummary: {...mockFoodLogBreakdownSummary},
    meals: [],
    date: new Date().toDateString(),
    id: ''
};

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        foodLogTreeItemContent: {
            padding: theme.spacing(1),
            paddingTop: '0px !important',
            paddingBottom: '0px !important',
            margin: theme.spacing(1)
        },
        foodLogTreeItemContentCalorieText: {
            marginTop: '4px !important',
        },
        iconButton: {
            width: '0.8em',
            height: '0.8em',
            '&:hover': {
                color: red[800],
                cursor: 'pointer'
            },
        },
        foodLogOperationContent: {
            float: 'right'
        },
        expansionPanel: {
            marginTop: theme.spacing(1),
        },
        expansionPanelSummary: {
            minHeight: '32px !important',
            height: 32,
            background: 'transparent !important',
            paddingLeft: theme.spacing(1),
        },
        listIcon: {
            fontSize: '1rem !important',
            marginRight: '4px !important'
        },
        mealsList: {
            listStyleType: 'none',
            paddingLeft: theme.spacing(1)
        }
    }),
);

/**
 * Food Log tree to display foodLog in a timeline.
 *
 * @param props foodLog log tree props
 */
function FoodLogTree(props: IFoodLogTreeProps) {
    const classes = useStyles();

    const [foodLogToBeEdited, setFoodLogToBeEdited] = React.useState<{ foodLog: IFoodLog }>({foodLog: foodLog});

    /**
     * Check if this component is in edit mode.
     */
    const isInEditMode = () => {
        return props.mode === FoodLogTreeMode.EDIT;
    };

    /**
     * Handle removing of foodLog.
     *
     * @param event unknown
     * @param log current foodLog to be removed
     */
    const handleFoodLogRemove = (event: unknown, log: IFoodLog) => {
        props.removeFoodLog(log);
    };

    /**
     * Handle editing of foodLog.
     *
     * @param event unknown
     * @param log current foodLog to be edited
     */
    const handleFoodLogEdit = (event: unknown, log: IFoodLog) => {
        setFoodLogToBeEdited({foodLog: log});
    };

    /**
     * On foodLog editing done update the state of the component.
     */
    const onFoodLogEditDone = () => {
        setFoodLogToBeEdited({foodLog: foodLog});
    };

    /**
     * Get Vertical time line layout based on the mode of foodLog log tree
     */
    const getVerticalTimeLineLayout = () => {
        return isInEditMode() ? '2-columns' : '1-column';
    };

    /**
     * Get operation elements for foodLog log tree content item.
     *
     * @param log current foodLog model
     */
    const getOperationElements = (log: IFoodLog) => {
        if (isInEditMode()) {
            return <Grid container>
                <Grid item>
                       <span onClick={event => handleFoodLogEdit(event, log)}>
                           <EditFoodLog foodLog={foodLogToBeEdited.foodLog}
                                        onFoodLogEditDone={onFoodLogEditDone}/>
                       </span>
                </Grid>
                <Grid item>
                       <span>
                           <IconButton onClick={event => handleFoodLogRemove(event, log)}>
                                <DeleteIcon className={classes.iconButton}/>
                           </IconButton>
                       </span>
                </Grid>
            </Grid>;
        }
        return null;
    };

    /**
     * Get meal elements for the foodLog.
     *
     * @param log current foodLog model
     */
    const getMealElements = (log: IFoodLog) => {
        if (isInEditMode()) {
            return <ExpansionPanel className={classes.expansionPanel} expanded={true}>
                <ExpansionPanelSummary className={classes.expansionPanelSummary} expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant='subtitle1' align='left' color='inherit'>Meals</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        <Grid item xs={6}>
                            <ul className={classes.mealsList}>
                                {
                                    log.meals.map((meal: IMeal, index: number) => {
                                        return <li key={`meal-${meal.id}-${index}`}>
                                            <Typography variant='subtitle2' align='left' color='inherit'>
                                                <FastfoodIcon className={classes.listIcon}
                                                              fontSize='small'
                                                              style={{color: COLORS[index].main}}/>
                                                {meal.name}
                                            </Typography>
                                        </li>
                                    })
                                }
                            </ul>
                        </Grid>
                        <Grid item xs={6}>
                            <MealsChart meals={log.meals}/>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        }
        return null;
    };

    return (
        <div>
            <VerticalTimeline layout={getVerticalTimeLineLayout()}>
                {
                    props.foodLogs.map(foodLog => {
                        return <VerticalTimelineElement
                            key={`food-log-tree-${foodLog.id}`}
                            date={foodLog.date}
                            icon={<FastfoodRoundedIcon fontSize={'small'}/>}>
                            <div className={classes.foodLogTreeItemContent}>
                                <Grid container direction="row" alignItems="center" justify="space-between">
                                    <Grid item>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <h4 className="vertical-timeline-element-subtitle">
                                                    {foodLog.date}
                                                </h4>
                                                <p className={classes.foodLogTreeItemContentCalorieText}>
                                                    {foodLog.breakdownSummary.caloriesBreakdown.totalCalories} Cals
                                                </p>
                                            </Grid>
                                            <Grid item>
                                                <FoodLogMacrosChart foodLog={foodLog}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item className={classes.foodLogOperationContent}>
                                        {getOperationElements(foodLog)}
                                    </Grid>
                                </Grid>
                                {getMealElements(foodLog)}
                            </div>
                        </VerticalTimelineElement>
                    })
                }
            </VerticalTimeline>
        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    foodLogs: state.foodLogReducer.list,
    macroAdvice: state.macroAdviceReducer,
});

const mapDispatchToProps = (dispatch: Dispatch<IFoodLogAction>) => ({
    editFoodLog: (item: IFoodLog) => dispatch({type: FoodLogActionTypes.EDIT_FOOD_LOG, payload: item}),
    removeFoodLog: (item: IFoodLog) => dispatch({type: FoodLogActionTypes.REMOVE_FOOD_LOG, payload: item}),
});

export default connect(mapStateToProps, mapDispatchToProps)(FoodLogTree);
