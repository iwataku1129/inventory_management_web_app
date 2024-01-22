import { Button } from '@mui/material';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";


export const ExcelButton = (props: { label?: string, disabled?: boolean, onClick?: any, type: 'submit' | 'reset' | 'button' }) => {
    return (
        <Button id={"1"} variant="outlined" size="large" color="inherit" type={props.type} disabled={props.disabled ? true : false} onClick={props.onClick} startIcon={< PiMicrosoftExcelLogoFill />}>
            {props.label ? props.label : "Export(xlsx)"}
        </Button >
    );
};
