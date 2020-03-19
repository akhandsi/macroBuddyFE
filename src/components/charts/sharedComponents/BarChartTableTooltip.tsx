import {TooltipProps} from "recharts";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {IComparisonData} from "../../../models";

interface IBarChartTableTooltipProps extends TooltipProps {
    getDataFromPayload: (payload: any) => IComparisonData[];
}

/**
 * Styling for this component.
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tooltipContainer: {
            background: '#fff !important',
            color: '#111 !important',
            padding: theme.spacing(1)
        },
        tooltipTable: {
            padding: theme.spacing(1),
            paddingTop: '0px'
        },
        tooltipTableText: {
            color: '#111',
            fontSize: '12px',
        },
    }),
);

/**
 * Bar chart tooltip to display custom content on hover.
 *
 * @param props TooltipProps
 */
const BarChartTableTooltip = (props: IBarChartTableTooltipProps) => {
    const classes = useStyles();
    const {active, payload, label} = props;

    if (active && payload) {
        const payloadModel = payload[0].payload;
        return (
            <div className={classes.tooltipContainer}>
                <Typography component="h6">
                    {label}
                </Typography>
                <Table className={classes.tooltipTable} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell align="right" className={classes.tooltipTableText}>
                                Current
                            </TableCell>
                            <TableCell align="right" className={classes.tooltipTableText}>
                                Suggested
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.getDataFromPayload(payloadModel).map((item: IComparisonData, index: number) => {
                                return <TableRow key={`tooltip-item-${index}`}>
                                    <TableCell align="left" className={classes.tooltipTableText}
                                               style={{color: item.colorConfig.main}}>
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tooltipTableText}>
                                        {item.current}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tooltipTableText}>
                                        {item.suggested}
                                    </TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
    return null;
};

export default BarChartTableTooltip;
