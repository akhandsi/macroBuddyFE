import React, {Dispatch} from "react";
import 'date-fns';
import Paper, {PaperProps} from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {IFoodLog, NumOfMealsInADay, IMeal, IFoodLogBreakdownSummary, IMacroAdvice} from "../../models";
import {connect} from "react-redux";
import {FoodLogActionTypes, IFoodLogAction} from "../../actions/FoodLogActionTypes";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import * as MyTypes from "MyTypes";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import {FoodLogUtil} from "../../utils/FoodLogUtil";
import moment from "moment";

interface IAddEditFoodLogProps {
    foodLog: IFoodLog;
    meals: IMeal[];
    numOfMealsInADay: NumOfMealsInADay;
    macroAdvice: IMacroAdvice;
    addFoodLog: (item: IFoodLog) => void;
    editFoodLog: (item: IFoodLog) => void;
}

interface IAddEditFoodLogFormProps extends IAddEditFoodLogProps {
    showDialog: boolean;
    handleClose: () => void;
}

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formGroup: {
            margin: theme.spacing(1),
        },
        menu: {
            width: 250,
        },
    }),
);

/**
 * Mock meal model to be used to create meal dropdowns.
 */
const meal: IMeal = {
    macros: {
        protein: 0,
        carbohydrates: 0,
        fats: 0,
    },
    name: '',
    calories: 0,
    id: ''
};

/**
 * Paper component is used to make dialog draggable.
 *
 * @param props properties for this component
 */
function PaperComponent(props: PaperProps) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

/**
 * Add or Edit Food Log Form, this form would allow to add a new foodLog or edit an existing foodLog.
 *
 * @param props add edit foodLog from props that includes methods to add and edit foodLog
 */
function AddEditFoodLogForm(props: IAddEditFoodLogFormProps) {
    const classes = useStyles();
    const [foodLog, setFoodLog] = React.useState<IFoodLog>({...props.foodLog});

    /**
     * React useEffect used to modify state from component properties. Initializing state from props doesnt work all
     * the time, using this hook ensures that state is updated when prop updates. Since in add mode this react component
     * does not have any meals, we are creating empty objects starting from id = 1000 - 1002/1004,
     * these are fake objects only used to create dropdown selects.
     */
    React.useEffect(() => {
        const hasMeals = props.foodLog.meals.length > 0;
        // if we have meals then do not add empty state
        if (hasMeals) {
            setFoodLog(props.foodLog);
        } else {
            // add n empty state to match num of meals in a day
            const emptyMeals = [];
            for (let i=0; i<props.numOfMealsInADay; i++) {
                emptyMeals.push({...meal, id: `100${i}`});
            }
            setFoodLog({
                ...props.foodLog,
                meals: [...emptyMeals]
            });
        }
    }, [props.foodLog, props.numOfMealsInADay]);

    /**
     * Handle closing of dialog and call parent component method passed down through props.
     */
    const handleClose = () => {
        props.handleClose();
    };

    /**
     * Handle saving of foodLog. This method either adds a new foodLog or edit existing foodLog.
     */
    const handleSave = () => {
        const hasEmptyMeals = foodLog.meals.find(meal => meal.name === '');
        if (hasEmptyMeals) {
            return;
        }

        // create the breakdown summary
        const breakdownSummary: IFoodLogBreakdownSummary = FoodLogUtil.getCaloriesBreakdownForFoodLog(foodLog, props.macroAdvice);
        foodLog.breakdownSummary = {...breakdownSummary};

        // set the date in correct format
        foodLog.date = moment(new Date(foodLog.date)).format("MM/DD/YYYY");

        if (foodLog.id && foodLog.id !== '') {
            props.editFoodLog(foodLog);
        } else {
            props.addFoodLog(foodLog);
        }

        handleClose();
    };

    /**
     * Handle date change for the foodLog.
     *
     * @param date date set by user on the date picker
     */
    const handleDateChange = (date: Date | null) => {
        if (date !== null) {
            setFoodLog({
                ...foodLog,
                date: date.toDateString(),
            })
        }
    };

    /**
     * Handle dropdown selection change.
     *
     * @param index number that is required to replace fake meal object with the new selection.
     */
    const handleSelectionChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const matchingMenuItem = props.meals.filter(meal => meal.id === value)[0];
        if (matchingMenuItem) {
            const newMeals = [...foodLog.meals];

            newMeals[index] = {
                ...matchingMenuItem
            };

            setFoodLog({
                ...foodLog,
                meals: [...newMeals]
            });
        }
    };

    return (
        <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Dialog
                    open={props.showDialog}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}>
                    <DialogTitle style={{cursor: 'move'}}>
                        {foodLog.id && foodLog.id !== '' ? 'Edit Food Log' : 'Add Food Log'}
                    </DialogTitle>
                    <DialogContent>

                        <form>
                            <FormGroup className={classes.formGroup}>
                                <FormControl>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        label="Food Log Date"
                                        value={new Date(props.foodLog.date)}
                                        onChange={handleDateChange}/>
                                </FormControl>
                            </FormGroup>

                            {
                                foodLog.meals.map((iMeal: IMeal, index: number) => {
                                    return <FormGroup key={`meal-dropdown-${index}`} className={classes.formGroup}>
                                        <FormControl>
                                            <TextField label={`Meal ${index + 1}`}
                                                       margin="dense"
                                                       select
                                                       value={iMeal.id}
                                                       fullWidth
                                                       SelectProps={{
                                                           MenuProps: {
                                                               className: classes.menu,
                                                           },
                                                       }}
                                                       onChange={handleSelectionChange(index)}
                                            >
                                                {
                                                    props.meals.map(option => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </FormControl>
                                    </FormGroup>
                                })
                            }
                        </form>

                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </MuiPickersUtilsProvider>
        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    numOfMealsInADay: state.profileReducer.numOfMealsInADay || NumOfMealsInADay.THREE,
    meals: state.mealReducer.list,
    macroAdvice: state.macroAdviceReducer
});

const mapDispatchToProps = (dispatch: Dispatch<IFoodLogAction>) => ({
    addFoodLog: (item: IFoodLog) => dispatch({type: FoodLogActionTypes.ADD_FOOD_LOG, payload: item}),
    editFoodLog: (item: IFoodLog) => dispatch({type: FoodLogActionTypes.EDIT_FOOD_LOG, payload: item}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditFoodLogForm);
