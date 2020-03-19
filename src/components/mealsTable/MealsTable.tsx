import React, {Dispatch} from 'react';
import clsx from 'clsx';
import {createStyles, fade, lighten, makeStyles, Theme} from '@material-ui/core/styles';
import * as MyTypes from "MyTypes";
import {connect} from "react-redux";
import {IMeal, MealSortField, SortOrder} from "../../models";
import {MealUtil} from "../../utils";
import {
    Checkbox,
    IconButton,
    InputBase,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography
} from "@material-ui/core";
import TablePagination from '@material-ui/core/TablePagination';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import {IMealAction, MealActionTypes} from "../../actions";
import EditMeal from "../addEditMeal/EditMeal";

interface IMealsTableProp {
    meals: IMeal[];
    removeMeal: (item: IMeal) => void;
}

interface HeadCell {
    id: MealSortField;
    label: string;
    numeric: boolean;
}

interface MealsTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: MealSortField) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    order: SortOrder;
    orderBy: string;
    rowCount: number;
}

interface MealsTableToolbarProps {
    selected: string[];
    searchText: string;
    onDeleteSelected: (selected: string[]) => void;
    onSearch: (searchText: string) => void;
}

/**
 * Styling for toolbar component.
 */
const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minHeight: '20px !important',
            maxHeight: '26px !important',
            paddingLeft: 8,
            paddingRight: 8,
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
        iconButton: {
            width: '0.8em',
            height: '0.8em',
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '70%',
            minHeight: '20px !important',
            maxHeight: '26px !important',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
        },
        searchIcon: {
            paddingTop: theme.spacing(0.5),
            width: theme.spacing(5),
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(0.8, 1, 1, 5),
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: 100,
            },
            fontSize: '12px'
        },
    }),
);

/**
 * Styling for meals list component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        tableWrapper: {
            overflowX: 'auto',
        },
        tableCellCheckbox: {
          paddingLeft: '6px !important',
        },
        tableCellName: {
            paddingLeft: '16px !important',
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

const headCells: HeadCell[] = [
    {id: MealSortField.NAME, numeric: false, label: 'Meal'},
    {id: MealSortField.CALORIES, numeric: true, label: 'Calories'},
    {id: MealSortField.PROTEIN, numeric: true, label: 'Protein(g)'},
    {id: MealSortField.CARBOHYDRATES, numeric: true, label: 'Carbs(g)'},
    {id: MealSortField.FATS, numeric: true, label: 'Fat(g)'},
];

/**
 * Meals Table Head component.
 *
 * @param props meals table props
 */
function MealsTableHead(props: MealsTableProps) {

    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;

    /**
     * Create table sort handler for given sort field.
     * @param property sort field
     */
    const createSortHandler = (property: MealSortField) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    /**
     * Header checkbox is in indeterminate state if there are no records or number of selected are less than total records.
     */
    const isIndeterminate = () => {
        if (rowCount === 0) {
            return true;
        }

        return numSelected > 0 && numSelected < rowCount;
    };

    /**
     * Header checkbox is in checked state if number of selected are equals to total records.
     */
    const isChecked = () => {
        if (rowCount === 0) {
            return false;
        }

        return numSelected === rowCount;
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" className={classes.tableCellCheckbox}>
                    <Checkbox
                        indeterminate={isIndeterminate()}
                        checked={isChecked()}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {
                    headCells.map(headCell => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            sortDirection={orderBy === headCell.id ? order : false}
                            className={headCell.id === MealSortField.NAME ? classes.tableCellName : ''}>

                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={order}
                                onClick={createSortHandler(headCell.id)}>

                                {headCell.label}
                                {
                                    orderBy === headCell.id
                                        ?
                                            (
                                                <span className={classes.visuallyHidden}>
                                                  {
                                                      order === 'desc'
                                                          ? 'sorted descending'
                                                          : 'sorted ascending'
                                                  }
                                                </span>
                                            )
                                        : null
                                }
                            </TableSortLabel>
                        </TableCell>
                    ))
                }
                <TableCell padding="none"/>
            </TableRow>
        </TableHead>
    );
}

/**
 * Meals table toolbar component.
 *
 * @param props meal table tool bar props
 */
function MealsTableToolbar(props: MealsTableToolbarProps) {
    const classes = useToolbarStyles();
    const {selected, searchText} = props;

    /**
     * On delete selected update the application state.
     *
     * @param event mouse event
     */
    const onDeleteSelected = (event: React.MouseEvent<unknown>) => {
        props.onDeleteSelected(selected);
    };

    /**
     * On input change, apply the search on meals list.
     * @param event
     */
    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>)=> {
        props.onSearch(event.target.value);
    };

    return (
        <Toolbar className={clsx(classes.root, {[classes.highlight]: selected.length > 0})}>
            {
                selected.length > 0
                    ? (
                        <Typography className={classes.title} variant='subtitle1' align='left' color='inherit'>
                            {selected.length} selected
                        </Typography>
                    )
                    : (
                        <Typography className={classes.title} variant='subtitle1' align='left'>
                            Nutrition
                        </Typography>
                    )
            }
            {
                selected.length > 0
                    ? (
                        <IconButton onClick={onDeleteSelected}>
                            <DeleteIcon className={classes.iconButton}/>
                        </IconButton>
                    )
                    :
                    (
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon className={classes.iconButton}/>
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{root: classes.inputRoot, input: classes.inputInput}}
                                value={searchText}
                                onChange={onInputChange}
                            />
                        </div>
                    )
            }
        </Toolbar>
    );
}

/**
 * Meals Table that displays all available meals in tabular format.
 *
 * @param props meals props
 */
function MealsTable(props: IMealsTableProp) {
    const classes = useStyles();
    const initialMealState: IMeal = {
        macros: {
            protein: 0,
            carbohydrates: 0,
            fats: 0,
        },
        name: '',
        calories: 0,
        id: ''
    };
    const [mealToBeEdited, setMealToBeEdited] = React.useState<{meal: IMeal}>({meal: initialMealState});
    const [searchText, setSearchText] = React.useState<string>('');
    const [order, setOrder] = React.useState<SortOrder>(SortOrder.ASC);
    const [orderBy, setOrderBy] = React.useState<MealSortField>(MealSortField.CALORIES);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.meals.length - page * rowsPerPage);

    /**
     * A row is selected if its found in the current selected state.
     *
     * @param name name of the meal
     */
    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    /**
     * Get sorted meals on sort.
     *
     * @param meals current meals in the application state
     * @param order order field for the meals
     * @param orderBy order by either asc or desc
     */
    const getSortedMeals = (meals: IMeal[], order: SortOrder, orderBy: MealSortField) => {
        return MealUtil.sortMeals(meals, { sortProperty: orderBy, sortOrder: order });
    };

    /**
     * Get filtered meals on search. At present search is only by meal name.
     *
     * @param meals current meals in the application state
     * @param searchText string to search meals by
     */
    const getFilteredMeals = (meals: IMeal[], searchText: string) => {
        return meals.filter(meal => meal.name.toLowerCase().includes(searchText.toLowerCase()));
    };

    /**
     * Handle sort request from the table head component.
     *
     * @param event mouse event on the header
     * @param mealSortField sort field mealSortField.
     */
    const handleRequestSort = (event: React.MouseEvent<unknown>, mealSortField: MealSortField) => {
        const isDesc = orderBy === mealSortField && order === SortOrder.DESC;
        setOrder(isDesc ? SortOrder.ASC : SortOrder.DESC);
        setOrderBy(mealSortField);
    };

    /**
     * Handle select all click. On select all set the selected state of this component.
     *
     * @param event checkbox change event
     */
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelectedIds = props.meals.map(n => n.id);
            setSelected(newSelectedIds);
            return;
        }
        setSelected([]);
    };

    /**
     * Handle row checkbox click and update the current selected state.
     *
     * @param event mouse event
     * @param name name of the current meal
     */
    const handleRowCheckboxClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    /**
     * Handle page change and set page state of this component.
     *
     * @param event unknown
     * @param newPage new page number
     */
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    /**
     * Handle change in number of rows per page.
     *
     * @param event change event.
     */
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    /**
     * Handle deletion of selected meals.
     *
     * @param selected string list of selected meal names
     */
    const handleDeleteSelected = (selected: string[]) => {
        // create a map of meal Id to map
        const mealIdToModelMap = props.meals.reduce((mealIdToModelMap, meal) => {
            if (!mealIdToModelMap[meal.id]) {
                mealIdToModelMap[meal.id] = meal;
            }
            return mealIdToModelMap;
        }, {});

        // remove each meal from the store
        selected.forEach(selectedId => {
            props.removeMeal(mealIdToModelMap[selectedId]);
        });

        setSelected([]);
    };

    /**
     * Handle search and update search state of this component.
     *
     * @param searchText string to search meals by.
     */
    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
    };

    /**
     * Handle editing of meal.
     *
     * @param event unknown
     * @param meal current meal to be edited
     */
    const handleMealEdit = (event: unknown, meal: IMeal) => {
        setMealToBeEdited({meal: meal});
    };

    /**
     * On meal editing done update the state of the component.
     */
    const onMealEditDone = () => {
      setMealToBeEdited({meal: initialMealState});
    };

    return (
        <div className={classes.root}>
            <MealsTableToolbar
                selected={selected}
                searchText={searchText}
                onDeleteSelected={handleDeleteSelected}
                onSearch={handleSearch}
            />
            <div className={classes.tableWrapper}>
                <Table style={{tableLayout: 'fixed'}} size='small'>
                    <MealsTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={props.meals.length}/>
                    <TableBody>
                        {
                            getSortedMeals(getFilteredMeals(props.meals, searchText), order, orderBy)
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row: IMeal, index: number) => {
                                    const isItemSelected = isSelected(row.id);

                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}>
                                            <TableCell padding="checkbox" className={classes.tableCellCheckbox}
                                                       onClick={event => handleRowCheckboxClick(event, row.id)}>
                                                <Checkbox checked={isItemSelected}/>
                                            </TableCell>
                                            <TableCell padding="default" className={classes.tableCellName}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.calories}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.macros.protein}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.macros.carbohydrates}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.macros.fats}
                                            </TableCell>
                                            <TableCell align="right" onClick={event => handleMealEdit(event, row)}>
                                                <EditMeal meal={mealToBeEdited.meal}
                                                          onMealEditDone={onMealEditDone}/>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {emptyRows > 0 && (
                                    <TableRow style={{height: 33 * emptyRows}}>
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={props.meals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}/>
        </div>
    );
}

const mapStateToProps = (state: MyTypes.ReducerState) => ({
    meals: state.mealReducer.list,
});

const mapDispatchToProps = (dispatch: Dispatch<IMealAction>) => ({
    removeMeal: (item: IMeal) => dispatch({type: MealActionTypes.REMOVE_MEAL, payload: item}),
});

export default connect(mapStateToProps, mapDispatchToProps)(MealsTable);
