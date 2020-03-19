import Paper, {PaperProps} from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import React, {Dispatch} from "react";
import {getRandomIntInclusive, MacroAdviceUtil} from "../../utils";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {TextField} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {IMealAction, MealActionTypes} from "../../actions";
import {IMeal, MealSortField} from "../../models";
import {connect} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

interface IAddEditMealProps {
    meal: IMeal;
    addMeal: (item: IMeal) => void;
    editMeal: (item: IMeal) => void;
}

interface IAddEditMealFormProps extends IAddEditMealProps {
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
    }),
);

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
 * Add or Edit Meal Form, this form would allow to add a new meal or edit an existing meal.
 *
 * @param props add edit meal from props that includes methods to add and edit meal
 */
function AddEditMealForm(props: IAddEditMealFormProps) {
    const classes = useStyles();
    const [meal, setMeal] = React.useState<IMeal>({...props.meal});

    /**
     * React useEffect used to modify state from component properties. Initializing state from props doesnt work all
     * the time, using this hook ensures that state is updated when prop updates.
     */
    React.useEffect(() => {
        setMeal(props.meal);
    }, [props.meal]);

    /**
     * Handle closing of dialog and call parent component method passed down through props.
     */
    const handleClose = () => {
        props.handleClose();
    };

    /**
     * Handle saving of meal. This method either adds a new meal or edit existing meal.
     */
    const handleSave = () => {
        const macros = {
            protein: meal.macros.protein,
            carbohydrates: meal.macros.carbohydrates,
            fats: meal.macros.fats
        };

        // if we have a prop id then this is edit else add.
        if (meal && meal.id && meal.id !== '') {
            props.editMeal({
                id: meal.id,
                name: meal.name,
                macros,
                calories: MacroAdviceUtil.calculateTotalCaloriesForMacros(macros)
            });
        } else {
            props.addMeal({
                id: getRandomIntInclusive(0, 1000).toString(),
                name: meal.name,
                macros,
                calories: MacroAdviceUtil.calculateTotalCaloriesForMacros(macros)
            });
        }

        handleClose();
    };

    /**
     * Handle property changes of meal.
     *
     * @param key field names of meal property
     */
    const handleChange = (key: MealSortField) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;

            if (key === MealSortField.NAME) {
                setMeal({
                    ...meal,
                    name: value
                });
            }

            if (key === MealSortField.PROTEIN ||
                key === MealSortField.CARBOHYDRATES ||
                key === MealSortField.FATS) {
                const newMacros = {
                    [key]: value
                };
                setMeal({
                    ...meal,
                    macros: {
                        ...meal.macros,
                        ...newMacros
                    }
                });
            }
        }
    };

    return (
        <div>
            <Dialog
                open={props.showDialog}
                onClose={handleClose}
                PaperComponent={PaperComponent}>
                <DialogTitle style={{cursor: 'move'}}>
                    {meal.id && meal.id !== '' ? 'Edit Meal' : 'Add Meal'}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <FormGroup className={classes.formGroup}>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="mealName"
                                    label="Meal Name"
                                    type="text"
                                    fullWidth
                                    defaultValue={meal.name}
                                    onChange={handleChange(MealSortField.NAME)}
                                />
                            </FormControl>
                        </FormGroup>

                        <FormGroup className={classes.formGroup}>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="protein"
                                    label="Protein(g)"
                                    type="number"
                                    fullWidth
                                    defaultValue={meal.macros.protein}
                                    onChange={handleChange(MealSortField.PROTEIN)}
                                />
                            </FormControl>
                        </FormGroup>

                        <FormGroup className={classes.formGroup}>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="carbohydrates"
                                    label="Carbohydrates(g)"
                                    type="number"
                                    fullWidth
                                    defaultValue={meal.macros.carbohydrates}
                                    onChange={handleChange(MealSortField.CARBOHYDRATES)}
                                />
                            </FormControl>
                        </FormGroup>

                        <FormGroup className={classes.formGroup}>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="fats"
                                    label="Fats(g)"
                                    type="number"
                                    fullWidth
                                    defaultValue={meal.macros.fats}
                                    onChange={handleChange(MealSortField.FATS)}
                                />
                            </FormControl>
                        </FormGroup>
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
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<IMealAction>) => ({
    addMeal: (item: IMeal) => dispatch({type: MealActionTypes.ADD_MEAL, payload: item}),
    editMeal: (item: IMeal) => dispatch({type: MealActionTypes.EDIT_MEAL, payload: item}),
});

export default connect(null, mapDispatchToProps)(AddEditMealForm);
