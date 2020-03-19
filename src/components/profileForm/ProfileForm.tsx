import React, {Dispatch, FormEvent} from 'react';
import * as MyTypes from "MyTypes";
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from '@material-ui/core/FormLabel';
import {Gender, Goal, IMacroAdvice, NumOfExerciseDays, IUserProfile} from "../../models";
import {connect} from "react-redux";
import {IMacroAdviceAction, IProfileAction, MacroAdviceActionTypes, ProfileActionTypes} from "../../actions";
import {MacroAdviceUtil} from "../../utils";

interface IProfileFormProp extends IUserProfile {
    setProfile: (item: IUserProfile) => void;
    setMacroAdvice: (item: IMacroAdvice) => void;
}

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(0.6),
        },
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(1.2),
        },
        withoutLabel: {
            marginTop: theme.spacing(0.8),
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 250,
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        menu: {
            width: 250,
        },
        input: {
            width: 250,
        },
        profileControl: {
            marginBottom: theme.spacing(1.5),
        },
        button: {
            margin: theme.spacing(1),
        },
        radioButton: {
            marginLeft: theme.spacing(0.8),
        }
    }),
);

const numOfExerciseDays = [
    {
        value: NumOfExerciseDays.ZERO,
        label: '0',
    },
    {
        value: NumOfExerciseDays.ONE,
        label: '1',
    },
    {
        value: NumOfExerciseDays.TWO,
        label: '2',
    },
    {
        value: NumOfExerciseDays.THREE,
        label: '3',
    },
    {
        value: NumOfExerciseDays.FOUR,
        label: '4',
    },
    {
        value: NumOfExerciseDays.FIVE,
        label: '5',
    },
    {
        value: NumOfExerciseDays.SIX,
        label: '6',
    },
    {
        value: NumOfExerciseDays.SEVEN,
        label: '7',
    },
];

const numOfMealsInADay = [
    {
        value: NumOfExerciseDays.THREE,
        label: '3',
    },
    {
        value: NumOfExerciseDays.FIVE,
        label: '5',
    }
];

const goals = [
    {
        value: Goal.WEIGHT_LOSS,
        label: 'Weight loss',
    },
    {
        value: Goal.WEIGHT_GAIN,
        label: 'Weight gain',
    }
];

/**
 * Validation map for validating the various fields of profile form.
 */
const validationMap = {
    /**
     * Age is valid if its between 1 - 99.
     *
     * @param value number
     */
    age: (value: number) => {
        return !(value < 0 || value > 99);
    },
    /**
     * Body weight is valid between 1 - 999 kgs.
     *
     * @param value number
     */
    bodyWeightInKGS: (value: number) => {
        return !(value < 0 || value > 999);
    },
    /**
     * Body height is valid between 1 - 999 cms.
     *
     * @param value number
     */
    bodyHeightInCMS: (value: number) => {
        return !(value < 0 || value > 999);
    },
    /**
     * Body fat percentage is valid between 1 - 99.
     *
     * @param value number
     */
    bodyFatInPercentage: (value: number) => {
        return !(value < 0 || value > 99);
    }
};

/**
 * Profile form component for user to enter the profile information.
 * All calories and macro calculations are based on the user profile.
 *
 * @param props profile form props.
 */
function ProfileForm(props: IProfileFormProp) {
    const classes = useStyles();

    /**
     * On form submit prevent the default behavior.
     *
     * @param event form event
     */
    const onFormSubmit = (event: FormEvent) =>{
        event.preventDefault();
    };

    /**
     * On property change, update the state and calculate new macro advice.
     *
     * @param prop property of profile model
     */
    const handleChange = (prop: keyof IUserProfile) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;

            // if we have validation defined run it
            if (validationMap[prop]) {
                // only set state and store the value if the validation succeeds
                if (!validationMap[prop](value)) {
                    return;
                }
            }

            const newProp = {
                [prop]: value,
            };

            const profileModel = {
                ...props,
                ...newProp
            };

            const macroAdviceModel = MacroAdviceUtil.generateMacros(profileModel);

            props.setProfile(profileModel);

            if (macroAdviceModel) {
                props.setMacroAdvice(macroAdviceModel);
            }
        };
    };

    return (
        <div className={classes.margin}>
            <form onSubmit={onFormSubmit}>
                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_age_container" className={classes.profileControl}>
                            <FormLabel component="legend">Age</FormLabel>
                            <TextField id="profile_control_age"
                                       className={classes.textField}
                                       value={props.age}
                                       onChange={handleChange('age')}
                                       type="number"
                            />
                        </div>
                    </FormControl>
                </FormGroup>

                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_gender_container" className={classes.profileControl}>
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup
                                id="profile_control_gender"
                                aria-label="gender"
                                name="gender"
                                value={props.gender}
                                onChange={handleChange('gender')}
                                className={classes.radioButton}>
                                <FormControlLabel value={Gender.MALE} control={<Radio/>} label="Male"/>
                                <FormControlLabel value={Gender.FEMALE} control={<Radio/>} label="Female"/>
                            </RadioGroup>
                        </div>
                    </FormControl>
                </FormGroup>

                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_goal_container" className={classes.profileControl}>
                            <FormLabel component="legend">Goal</FormLabel>
                            <TextField
                                id="profile_control_goal"
                                select
                                className={classes.textField}
                                value={props.goal}
                                onChange={handleChange('goal')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"
                            >
                                {goals.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </FormControl>
                </FormGroup>

                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_numOfExerciseDays_container" className={classes.profileControl}>
                            <FormLabel component="legend">Number of Exercise Days</FormLabel>
                            <TextField
                                id="profile_control_numOfExerciseDays"
                                select
                                className={classes.textField}
                                value={props.numOfExerciseDays}
                                onChange={handleChange('numOfExerciseDays')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"
                            >
                                {numOfExerciseDays.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </FormControl>
                </FormGroup>

                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_numOfMealsInADay_container" className={classes.profileControl}>
                            <FormLabel component="legend">Number of Meals in a Day</FormLabel>
                            <TextField
                                id="profile_control_numOfMealsInADay"
                                select
                                className={classes.textField}
                                value={props.numOfMealsInADay}
                                onChange={handleChange('numOfMealsInADay')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="normal"
                            >
                                {numOfMealsInADay.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </FormControl>
                </FormGroup>

                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_bodyWeightInKGS_container" className={classes.profileControl}>
                            <FormLabel component="legend">Body Weight</FormLabel>
                            <Input
                                id="profile_control_bodyWeightInKGS"
                                className={classes.input}
                                value={props.bodyWeightInKGS}
                                onChange={handleChange('bodyWeightInKGS')}
                                endAdornment={<InputAdornment position="end">kgs</InputAdornment>}
                                inputProps={{
                                    'aria-label': 'bodyWeightInKGS',
                                }}
                                type="number"
                            />
                        </div>
                    </FormControl>
                </FormGroup>

                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_bodyHeightInCMS_container" className={classes.profileControl}>
                            <FormLabel component="legend">Height</FormLabel>
                            <Input
                                id="profile_control_bodyHeightInCMS"
                                className={classes.input}
                                value={props.bodyHeightInCMS}
                                onChange={handleChange('bodyHeightInCMS')}
                                endAdornment={<InputAdornment position="end">cms</InputAdornment>}
                                inputProps={{
                                    'aria-label': 'bodyHeightInCMS',
                                }}
                                type="number"
                            />
                        </div>
                    </FormControl>
                </FormGroup>

                <FormGroup>
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                        <div id="profile_control_bodyFatInPercentage_container" className={classes.profileControl}>
                            <FormLabel component="legend">Body Fat</FormLabel>
                            <Input
                                id="profile_control_bodyFatInPercentage"
                                className={classes.input}
                                value={props.bodyFatInPercentage}
                                onChange={handleChange('bodyFatInPercentage')}
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                inputProps={{
                                    'aria-label': 'bodyFatInPercentage',
                                }}
                                type="number"
                            />
                        </div>
                    </FormControl>
                </FormGroup>
            </form>
        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    age: state.profileReducer.age,
    gender: state.profileReducer.gender,
    numOfExerciseDays: state.profileReducer.numOfExerciseDays,
    numOfMealsInADay: state.profileReducer.numOfMealsInADay,
    bodyWeightInKGS: state.profileReducer.bodyWeightInKGS,
    bodyHeightInCMS: state.profileReducer.bodyHeightInCMS,
    bodyFatInPercentage: state.profileReducer.bodyFatInPercentage,
    goal: state.profileReducer.goal
});

const mapDispatchToProps = (dispatch: Dispatch<IProfileAction | IMacroAdviceAction>) => ({
    setProfile: (item: IUserProfile) => dispatch({ type: ProfileActionTypes.SET_PROFILE, payload: item }),
    setMacroAdvice: (item: IMacroAdvice) => dispatch({ type: MacroAdviceActionTypes.SET_MACRO_ADVICE, payload: item }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);
