import React from "react";
import clsx from 'clsx';
import {Grid, Paper, Typography} from "@material-ui/core";
import MacroAdvice from "../macroAdvice/MacroAdvice";
import FoodSuggestions from "../charts/MealSuggestionsChart";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import FoodLogTree from "../foodLogTree/FoodLogTree";
import {FoodLogTreeMode} from "../../models";
import OverTimeMacrosChart from "../charts/OverTimeMacrosChart";
import OverTimeCaloriesChart from "../charts/OverTimeCaloriesChart";

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        contentGridHeading: {
            marginBottom: theme.spacing(1),
            borderBottom: '1px solid',
        },
        gridContainer: {
            marginBottom: theme.spacing(3),
            backgroundColor: 'transparent'
        },
        gridItemContent: {
            border: '1px solid',
            borderRadius: '20px 20px 20px 20px',
            marginRight: theme.spacing(1.5),
            padding: theme.spacing(2),
            textAlign: 'center',
            height: '100%',
        },
        foodLogTreeHeading: {
            marginLeft: theme.spacing(1.6),
        },
    }),
);

/**
 * Home dashboard shows the current suggestions, macros and historical trend of calories and macros.
 */
export default function HomeDashboard(){
    const classes = useStyles();

    return (
        <div>
            <Grid container className={classes.gridContainer}>
                <Grid item xs={10}>
                    <div>
                        <Typography component="h3" className={classes.contentGridHeading}>
                            Recommended Calories and Macros
                        </Typography>
                        <Grid container className={classes.gridContainer}>
                            <Grid item xs={12}>
                                <MacroAdvice/>
                            </Grid>
                        </Grid>
                    </div>

                    <div>
                        <Typography component="h3" className={classes.contentGridHeading}>
                            Today's Meal Suggestions
                        </Typography>
                        <Grid container className={classes.gridContainer}>
                            <Grid item xs={12}>
                                <Paper className={classes.gridItemContent}>
                                    <FoodSuggestions/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>

                    <div>
                        <Typography component="h3" className={classes.contentGridHeading}>
                            Historical Food Log Trends
                        </Typography>
                        <Grid container className={classes.gridContainer}>
                            <Grid item xs={6}>
                                <Paper className={classes.gridItemContent}>
                                    <OverTimeCaloriesChart/>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper className={classes.gridItemContent}>
                                    <OverTimeMacrosChart/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>

                <Grid item xs={2}>
                    <Typography component="h3" className={clsx(classes.contentGridHeading, classes.foodLogTreeHeading)}>
                        Weekly Food Log Tree
                    </Typography>
                    <FoodLogTree mode={FoodLogTreeMode.READ_ONLY}/>
                </Grid>
            </Grid>
        </div>
    );
}
