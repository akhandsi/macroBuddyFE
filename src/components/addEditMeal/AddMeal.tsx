import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {IMeal} from "../../models";
import Button from "@material-ui/core/Button";
import AddEditMealForm from "./AddEditMealForm";

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
            '&:hover': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
            }
        },
        iconHover: {
            margin: theme.spacing(2),
            '&:hover': {
                cursor: 'pointer'
            },
        },
    }),
);

/**
 * AddMeal component is a button to launch Add Meal Dialog to log meal.
 */
export default function AddMeal() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
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
     * Handle dialog open on button click.
     */
    const handleClickOpen = () => {
        setOpen(true);
    };

    /**
     * Handle dialog close. This method is passed to the form and would be called when dialog would close.
     */
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                className={classes.button}
                startIcon={<AddCircleOutlineIcon fontSize='small' className={classes.iconHover}/>}
                onClick={handleClickOpen}>
                Meal
            </Button>
            <AddEditMealForm showDialog={open} handleClose={handleClose} meal={meal}/>
        </div>
    );
}
