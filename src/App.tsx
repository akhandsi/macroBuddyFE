import React from 'react';
import {makeStyles, ThemeProvider, createStyles, Theme} from '@material-ui/core/styles';
import DashboardContainer from "./components/dashboards/DashboardContainer";
import store from "./store/Store";
import {Provider} from "react-redux";
import {ThemeUtil} from "./utils";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import ProfileForm from "./components/profileForm/ProfileForm";
import Drawer from "@material-ui/core/Drawer";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Grid} from "@material-ui/core";
import AppMenu from "./components/menu/AppMenu";

const drawerWidth = 288;

/**
 * Styling for this component.
 */
const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        appContainer: {
            height: '100vh',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        toolBar: {
            height: '52px !important',
            minHeight: '52px !important',
            maxHeight: '52px !important',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
);

/**
 * Main application component.
 */
export function App() {
    const classes = useStyles();
    const theme: Theme = ThemeUtil.getTheme();
    const [open, setOpen] = React.useState(true);
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

    /**
     * On Drawer open update the state and set to true.
     */
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    /**
     * On Drawer close update the state and set to false.
     */
    const handleDrawerClose = () => {
        setOpen(false);
    };

    /**
     * On tab change update the selected tab index so the views can be displayed correctly.
     */
    const onTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTabIndex(newValue);
    };

    return (
        <div className={classes.appContainer}>
            <ThemeProvider theme={theme}>
                <Provider store={store}>

                    <div className={classes.root}>
                        <CssBaseline/>

                        <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: open})}>
                            <Toolbar className={classes.toolBar}>

                                <IconButton
                                    color="inherit"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    className={clsx(classes.menuButton, open && classes.hide)}>
                                    <MenuIcon/>
                                </IconButton>

                                <Grid container>
                                    <Grid item xs={11}>
                                        <Tabs value={selectedTabIndex} onChange={onTabChange}>
                                            <Tab label="Home"/>
                                            <Tab label="Meals"/>
                                            <Tab label="Food Logs"/>
                                        </Tabs>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <AppMenu/>
                                    </Grid>
                                </Grid>

                            </Toolbar>
                        </AppBar>

                        <Drawer className={classes.drawer}
                                variant="persistent"
                                anchor="left"
                                open={open}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}>
                            <div className={clsx(classes.drawerHeader, classes.toolBar)}>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                                </IconButton>
                            </div>
                            <Divider/>
                            <ProfileForm/>
                        </Drawer>

                        <main className={clsx(classes.content, { [classes.contentShift]: open })}>

                            <div className={clsx(classes.drawerHeader, classes.toolBar)}/>

                            <DashboardContainer currentTabIndex={selectedTabIndex}/>
                        </main>
                    </div>

                </Provider>
            </ThemeProvider>
        </div>
    );
};
