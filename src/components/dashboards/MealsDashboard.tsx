import React from "react";
import {Grid, Paper, Typography} from "@material-ui/core";
import MealsTable from "../mealsTable/MealsTable";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

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
            marginBottom: theme.spacing(1.4),
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
    }),
);

/**
 * Meals Dashboard shows meal table and most used meals.
 */
export default function MealsDashboard() {
    const classes = useStyles();

    return (
        <div>
            <div>
                <Typography component="h3" className={classes.contentGridHeading}>
                    Meals
                </Typography>
                <Grid container className={classes.gridContainer}>
                    <Grid item xs={12}>
                        <Paper className={classes.gridItemContent}>
                            <MealsTable/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
