import { ReactNode } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { MdExpandMore } from "react-icons/md";

export const AccordionUI = (props: { children: ReactNode, defaultExpanded?: boolean, onChange?: any, title: string }) => {
    return (
        <Accordion defaultExpanded={props.defaultExpanded} onChange={(event, expanded) => props.onChange ? props.onChange(event, expanded) : null}>
            <AccordionSummary
                expandIcon={<MdExpandMore />}
            >
                <Typography>{props.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {props.children}
            </AccordionDetails>
        </Accordion>
    )
}