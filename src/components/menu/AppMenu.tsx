import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import AddFoodLog from "../addEditFoodLog/AddFoodLog";
import AddMeal from "../addEditMeal/AddMeal";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuItem: {
            margin: theme.spacing(0),
            padding: theme.spacing(0),
            minWidth: '200px !important',
            width: '200px !important'
        },
        menuButton: {
            float: 'right'
        }
    }),
);

/**
 * App menu is used to display menu on the header. These menu items will support app level operations.
 */
export default function AppMenu() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    /**
     * On menu click, open the menu item.
     *
     * @param event mouse even on the menu element.
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * On menu close, close the menu drop down.
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton edge="end"
                        color="inherit"
                        aria-haspopup="true"
                        onClick={handleClick}
                        className={classes.menuButton}>
                <MoreIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleClose} className={classes.menuItem}>
                    <AddFoodLog/>
                </MenuItem>
                <MenuItem onClick={handleClose} className={classes.menuItem}>
                    <AddMeal/>
                </MenuItem>
            </Menu>
        </div>
    );
}
