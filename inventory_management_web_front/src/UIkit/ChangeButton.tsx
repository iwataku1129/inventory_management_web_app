import { Button, IconButton } from '@mui/material';
import { MdOutlineChangeCircle } from "react-icons/md";


export const ChangeButton = (props: { disabled?: boolean, onClick: any, label?: string }) => {
    if (props.label) {
        return (
            <Button variant="outlined" size="small" color="inherit" disabled={props.disabled ? true : false} onClick={() => props.onClick()} startIcon={<MdOutlineChangeCircle />}>
                {props.label}
            </Button >
        )
    } else {
        return (
            <IconButton aria-label="delete" disabled={props.disabled ? true : false} onClick={() => props.onClick()} >
                <MdOutlineChangeCircle />
            </IconButton>
        );
    }
};
