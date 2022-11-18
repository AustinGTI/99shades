import {styled, Tooltip, tooltipClasses} from "@mui/material";
import React from "react";

export const CustomTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}} arrow enterDelay={"1000"}
             enterNextDelay={"1000"}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: 'rgb(0,0,0,0.75)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
        fontFamily: 'var(--primary-font)'
    },
}));
