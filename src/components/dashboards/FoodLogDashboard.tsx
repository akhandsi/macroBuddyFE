import React from "react";
import {Grid, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import FoodLogTree from "../foodLogTree/FoodLogTree";
import {FoodLogTreeMode} from "../../models";

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
        }
    }),
);

/**
 * Food Log Dashboard shows foodLog log tree.
 */
export default function FoodLogDashboard() {
    const classes = useStyles();

    return (
        <div>
            <div>
                <Typography component="h3" className={classes.contentGridHeading}>
                    Food Logs
                </Typography>
                <Grid container className={classes.gridContainer}>
                    <Grid item xs={12}>
                        <FoodLogTree mode={FoodLogTreeMode.EDIT}/>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
