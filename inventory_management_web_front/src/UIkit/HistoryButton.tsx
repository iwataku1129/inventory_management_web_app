import { Button, IconButton } from '@mui/material';
import { MdHistory } from "react-icons/md";


export const HistoryButton = (props: { disabled?: boolean, onClick: any, label?: string }) => {
    if (props.label) {
        return (
            <Button variant="outlined" size="small" color="inherit" disabled={props.disabled ? true : false} onClick={() => props.onClick()} startIcon={<MdHistory />}>
                {props.label}
            </Button >
        )
    } else {
        return (
            <IconButton aria-label="delete" disabled={props.disabled ? true : false} onClick={() => props.onClick()} >
                <MdHistory />
            </IconButton>
        );
    }
};
