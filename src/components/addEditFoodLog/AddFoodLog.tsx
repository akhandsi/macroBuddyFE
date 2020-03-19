import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {IFoodLog} from "../../models";
import AddEditFoodLogForm from "./AddEditFoodLogForm";
import {mockFoodLogBreakdownSummary} from "../../models/MockData";

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
 * AddFoodLog component is a button to launch Add Food Log Dialog to log foodLog for a selected date.
 */
export default function AddFoodLog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const foodLog: IFoodLog = {
        breakdownSummary: {...mockFoodLogBreakdownSummary},
        meals: [],
        date: new Date().toDateString(),
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
                style={{float: 'left'}}
                className={classes.button}
                startIcon={<AddCircleOutlineIcon fontSize='small' className={classes.iconHover}/>}
                onClick={handleClickOpen}>
                Food Log
            </Button>
            <AddEditFoodLogForm showDialog={open} handleClose={handleClose} foodLog={foodLog}/>
        </div>
    );
}
