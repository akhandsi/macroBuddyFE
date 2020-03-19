import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Grid, Paper, Typography} from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import * as MyTypes from "MyTypes";
import {connect} from "react-redux";
import {IMacroAdvice, MacroType} from "../../models";
import {IMacroColorConfig, MacroAdviceUtil, MacroColorUtils} from "../../utils";

/**
 * Use existing color coding for macros trends in chart.
 */
const macroColorConfiguration: IMacroColorConfig = new MacroColorUtils().getConfiguration();

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        typographyHeading: {
            paddingTop: theme.spacing(2),
            borderBottom: '1px solid',
        },
        typographyText: {
            paddingTop: theme.spacing(0.5),
        },
        typographySubText: {
            fontSize: '12px !important',
            textDecoration: 'italic !important',
        },
        gridContainer: {
            marginBottom: theme.spacing(0.4),
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
        slider: {
            color: '#1b79e3 !important',
            paddingTop: theme.spacing(2.35),
            marginTop: theme.spacing(2.35),
            width: '90%',
            marginBottom: '13px'
        },
    }),
);

/**
 * Macro advice component displays current calories, bmr, total calories. As well as daily needed macro breakdown.
 *
 * @param props macro advice model
 */
function MacroAdvice(props: IMacroAdvice) {
    const classes = useStyles();
    const currentRange = {
        min: props.bmrCalories - 600,
        max: props.totalCalories + 600,
    };
    const scaleToRange = {
        min: 0,
        max: 100,
    };

    /**
     * Get converted value from range [bmr - 600, total + 600] to range [0, 100].
     *
     * @param value number
     */
    const getConverted = (value: number) => {
        return ((scaleToRange.max - scaleToRange.min) / (currentRange.max - currentRange.min)) * (value - currentRange.min);
    };

    /**
     * Get markers for displaying calories on the slider.
     */
    const getCaloriesMarks = () => {
        const convertedBmr = getConverted(props.bmrCalories);
        const convertedCurrent = getConverted(props.currentCalories);
        const convertedTotal = getConverted(props.totalCalories);

        return [
            {
                value: convertedBmr,
                label: `${props.bmrCalories} Cals`,
            },
            {
                value: convertedCurrent,
                label: `${props.currentCalories} Cals`,
            },
            {
                value: convertedTotal,
                label: `${props.totalCalories} Cals`,
            },
        ];
    };

    return (
        <div>
            <Grid container className={classes.gridContainer}>

                <Grid item xs={6}>
                    <Paper className={classes.gridItemContent}>
                        <Slider
                            className={classes.slider}
                            value={getConverted(props.currentCalories)}
                            marks={getCaloriesMarks()}
                            min={getConverted(props.bmrCalories)}
                            max={getConverted(props.totalCalories)}
                            valueLabelDisplay="on"
                            valueLabelFormat={value => props.currentCalories}
                            disabled={true}
                        />
                        <Typography component="h6" align="left" style={{float: 'left'}}
                                    className={classes.typographySubText}>
                            Basic Metabolism Rate (BMR)
                        </Typography>
                        <Typography component="h6" align="right" className={classes.typographySubText}>
                            Total Energy Expenditure (TEE)
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={2}>
                    <Paper className={classes.gridItemContent} style={{
                        backgroundColor: macroColorConfiguration.protein.main
                    }}>
                        <Typography component="h5" className={classes.typographyHeading}>
                            Protein
                        </Typography>
                        <Typography component="h5" className={classes.typographyText}>
                            {props.macros.protein} g
                        </Typography>
                        <Typography component="h6" align="right" className={classes.typographySubText}>
                            {MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.PROTEIN, props.macros.protein)} Cal
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={2}>
                    <Paper className={classes.gridItemContent} style={{
                        backgroundColor: macroColorConfiguration.carbohydrates.main
                    }}>
                        <Typography component="h5" className={classes.typographyHeading}>
                            Carbohydrates
                        </Typography>
                        <Typography component="h5" className={classes.typographyText}>
                            {props.macros.carbohydrates} g
                        </Typography>
                        <Typography component="h6" align="right" className={classes.typographySubText}>
                            {MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.CARBOHYDRATES, props.macros.carbohydrates)} Cal
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={2}>
                    <Paper className={classes.gridItemContent} style={{
                        backgroundColor: macroColorConfiguration.fats.main
                    }}>
                        <Typography component="h5" className={classes.typographyHeading}>
                            Fats
                        </Typography>
                        <Typography component="h5" className={classes.typographyText}>
                            {props.macros.fats} g
                        </Typography>
                        <Typography component="h6" align="right" className={classes.typographySubText}>
                            {MacroAdviceUtil.calculateCaloriesForMacroType(MacroType.FATS, props.macros.fats)} Cal
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    bmrCalories: state.macroAdviceReducer.bmrCalories,
    totalCalories: state.macroAdviceReducer.totalCalories,
    currentCalories: state.macroAdviceReducer.currentCalories,
    macros: state.macroAdviceReducer.macros,
});

export default connect(mapStateToProps)(MacroAdvice);
