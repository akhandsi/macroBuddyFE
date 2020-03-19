import React from 'react';
import {createStyles, lighten, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
import * as MyTypes from "MyTypes";
import {connect} from "react-redux";
import {MacroType, NumOfMealsInADay, IMeal, IMealSuggestions, IMealSuggestion} from "../../models";
import {Grid, LinearProgress, Paper, Typography} from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {IMacroColorConfig, MacroAdviceUtil, MacroColorUtils} from "../../utils";
import {LinearProgressProps} from "@material-ui/core/LinearProgress";
import Tooltip from '@material-ui/core/Tooltip';
import {MealSuggestionUtil} from "../../utils";

interface IMealBoxProp {
    numOfMealsInADay: NumOfMealsInADay;
    currentCalories: number;
    meals: IMeal[];
}

interface IMealSuggestionsProp extends IMealBoxProp {
    suggestionList: IMealSuggestions;
}

interface IMacroProgressBarProps extends LinearProgressProps {
    macroColor: string;
    macroValue: number;
    macroClassName: string;
    macroType: MacroType;
    mealCalories: number;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

/**
 * Use existing color coding for macros in chart.
 */
const macroColorConfig: IMacroColorConfig = new MacroColorUtils().getConfiguration();

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            backgroundColor: '#333431',
            color: '#fff'
        },
        tabPanelBox: {
          padding: theme.spacing(1.5),
          paddingBottom: '0px !important',
        },
        gridContainer: {
            backgroundColor: 'transparent'
        },
        gridItemContent: {
            border: '1px solid',
            borderRadius: '20px 20px 20px 20px',
            marginRight: theme.spacing(1.5),
            marginBottom: theme.spacing(1.5),
            padding: theme.spacing(1.8),
            textAlign: 'center',
        },
        typographyText: {
            fontSize: '12px !important',
            textDecoration: 'italic !important',
        },
        macroBars: {
            margin: theme.spacing(1),
        },
        typographySubText: {
            fontSize: '12px !important',
            textDecoration: 'italic !important',
        },
        mealBox: {
            padding: theme.spacing(1),
        }
    }),
);

/**
 * Get meal suggestions to reach daily calorie requirements.
 *
 * @param request meal box prop that contains numOfMealInADay, currentCalories and all uploaded meals.
 */
const getSuggestedMeals = (request: IMealBoxProp) => {
    return MealSuggestionUtil.getSuggestions(request.numOfMealsInADay, request.currentCalories, request.meals);
};

/**
 * Tab panel component to display each suggestion content in a box.
 *
 * @param props tab panel props
 */
function TabPanel(props: TabPanelProps) {
    const classes = useStyles();
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            {...other}>
            <Box p={3} className={classes.tabPanelBox}>{children}</Box>
        </Typography>
    );
}

/**
 * Customized macro progress bar that shows how much macro would be served from given meal towards the daily goal.
 *
 * @param props macro progress bar props
 */
function MacroProgressBar(props: IMacroProgressBarProps) {
    const ProgressBar = withStyles({
        root: {
            height: 12,
            backgroundColor: lighten(props.macroColor, 0.7),
        },
        bar: {
            borderRadius: 20,
            backgroundColor: props.macroColor,
        },
    })(LinearProgress);

    const macroCalories = MacroAdviceUtil.calculateCaloriesForMacroType(props.macroType, props.macroValue);
    return (
        <div>
            <Typography component="h6" align="left" style={{
                float: 'left',
                fontSize: '10px',
                textDecoration: 'italic',
                marginRight: '4px',
                minWidth: 40
            }}>
                {macroCalories} Cals
            </Typography>
            <ProgressBar
                variant="determinate"
                value={(macroCalories / props.mealCalories) * 100}
                className={props.macroClassName}
            />
        </div>
    )
}

/**
 * Meal boxes are displayed for each meal that was suggested.
 *
 * @param props meal box prop
 */
function MealsBoxes(props: IMealBoxProp) {
    const classes = useStyles();

    return (
        <div>
            <Grid container className={classes.gridContainer}>
                {
                    props.meals.length > 0
                        ? props.meals.map(meal => {
                        return <Grid item xs={2} key={`suggested-meal-${meal.id}`}>
                            <Paper className={classes.gridItemContent}>
                                <div className={classes.mealBox}>
                                    <Tooltip title={meal.name}>
                                        <Typography component="h5" noWrap={true} className={classes.typographyText}>
                                            {meal.name}
                                        </Typography>
                                    </Tooltip>
                                    <MacroProgressBar
                                        macroClassName={classes.macroBars}
                                        macroValue={meal.macros.protein}
                                        macroColor={macroColorConfig.protein.main}
                                        macroType={MacroType.PROTEIN}
                                        mealCalories={meal.calories}>
                                    </MacroProgressBar>
                                    <MacroProgressBar
                                        macroClassName={classes.macroBars}
                                        macroValue={meal.macros.carbohydrates}
                                        macroColor={macroColorConfig.carbohydrates.main}
                                        macroType={MacroType.CARBOHYDRATES}
                                        mealCalories={meal.calories}>
                                    </MacroProgressBar>
                                    <MacroProgressBar
                                        macroClassName={classes.macroBars}
                                        macroValue={meal.macros.fats}
                                        macroColor={macroColorConfig.fats.main}
                                        macroType={MacroType.FATS}
                                        mealCalories={meal.calories}>
                                    </MacroProgressBar>
                                    <Typography component="h6" align="left" style={{
                                        float: 'left',
                                        fontSize: '10px',
                                        textDecoration: 'italic',
                                        marginRight: '4px',
                                        minWidth: 40
                                    }}>
                                        Total {meal.calories} Cals
                                    </Typography>
                                </div>
                            </Paper>
                        </Grid>
                    })
                        : <Typography component="h5">
                            Please add meals to see meal suggestions.
                        </Typography>
                }
            </Grid>
        </div>
    );
}

/**
 * Food suggestion chart shows multiple tabs and multiple meal boxes.
 *
 * @param props meal props
 */
function MealSuggestionsChart(props: IMealSuggestionsProp) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static" className={classes.appBar}>
                <Tabs value={value} onChange={handleChange}>
                    {
                        props.suggestionList.list.map((suggestion: IMealSuggestion, index: number) => {
                            return <Tab key={`suggestion-${index + 1}`} label={`Suggestion ${index + 1} (${suggestion.totalCalories} Cals)`}/>
                        })
                    }
                </Tabs>
            </AppBar>

            {
                props.suggestionList.list.map((suggestion: IMealSuggestion, index: number) => {
                    return <TabPanel value={value} index={index} key={`mealBox-${index + 1}`}>
                        <MealsBoxes
                            numOfMealsInADay={props.numOfMealsInADay}
                            currentCalories={props.currentCalories}
                            meals={suggestion.meals}/>
                    </TabPanel>
                })
            }

        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    numOfMealsInADay: state.profileReducer.numOfMealsInADay || NumOfMealsInADay.THREE,
    currentCalories: state.macroAdviceReducer.currentCalories,
    meals: state.mealReducer.list,
    suggestionList: getSuggestedMeals({
        numOfMealsInADay: state.profileReducer.numOfMealsInADay || NumOfMealsInADay.THREE,
        currentCalories: state.macroAdviceReducer.currentCalories,
        meals: state.mealReducer.list
    })
});

export default connect(mapStateToProps)(MealSuggestionsChart);
