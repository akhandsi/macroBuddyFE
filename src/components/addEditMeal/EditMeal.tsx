import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {red} from "@material-ui/core/colors";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {IMeal} from "../../models";
import AddEditMealForm from "./AddEditMealForm";

interface IEditMealProps {
    meal: IMeal;
    onMealEditDone: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > .fa': {
                margin: theme.spacing(2),
            },
        },
        iconHover: {
            margin: theme.spacing(2),
            '&:hover': {
                color: red[800],
                cursor: 'pointer'
            },
        },
    }),
);

/**
 * EditMeal component is a button to launch Edit Meal Dialog.
 *
 * @param props edit meal props with method to handle editing
 */
export default function EditMeal(props: IEditMealProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

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
        props.onMealEditDone();
    };

    return (
        <div>
            <EditOutlinedIcon
                fontSize='small'
                className={classes.iconHover}
                color="action"
                onClick={handleClickOpen}/>
            <AddEditMealForm showDialog={open}
                               handleClose={handleClose}
                               meal={props.meal}/>
        </div>
    );
}
