import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {red} from "@material-ui/core/colors";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {IFoodLog} from "../../models";
import {IconButton} from "@material-ui/core";
import AddEditFoodLogForm from "./AddEditFoodLogForm";

interface IEditFoodLogProps {
    foodLog: IFoodLog;
    onFoodLogEditDone: () => void;
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
 * EditFoodLog component is a button to launch Edit Food Log Dialog.
 *
 * @param props edit foodLog props with method to handle editing
 */
export default function EditFoodLog(props: IEditFoodLogProps) {
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
        props.onFoodLogEditDone();
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <EditOutlinedIcon
                    fontSize='small'
                    className={classes.iconHover}
                    color="action"/>
            </IconButton>
            <AddEditFoodLogForm showDialog={open}
                               handleClose={handleClose}
                               foodLog={props.foodLog}/>
        </div>
    );
}
