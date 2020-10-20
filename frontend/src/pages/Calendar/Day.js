import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    // Always displayed styling
    dayWrapperStyling : {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    cellStyling : {
        border: "1px solid black",
        height: "calc(100%/6)",
        minHeight: "50px",
        width: "calc(100%/7)"
    },

    // Conditional Styles
    offMonthStyling: {
        color: theme.palette.text.secondary
    }
}));

const Day = ({ dayDate, currentMonth, setView }) => {
    // Styling
    const classes = useStyles();
    const offMonth = currentMonth !== dayDate.getMonth();

    // Event Handlers
    const enterDayView = () => {
        console.log('Clicked on' + dayDate.toISOString());
        setView("day");
    };

    return (
        <td className={classes.cellStyling}>
            {/* Always have dayWrapperStyling. Sometimes have offMonthStyling */}
            <div className={`${classes.dayWrapperStyling} ${offMonth ? classes.offMonthStyling : ''}`}>
                {/* Div that changes to day view */}
                <div onClick={enterDayView}>
                    {dayDate.getDate()}
                </div>
            </div>
        </td>
    );
}

export default Day;