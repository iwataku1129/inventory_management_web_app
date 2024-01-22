import { Button } from '@mui/material';
import { MdDeleteForever } from "react-icons/md";


export const DeleteButton = (props: { label?: string, disabled?: boolean, onClick: any }) => {
    return (
        <Button variant="outlined" size="small" color="error" disabled={props.disabled ? true : false} onClick={() => props.onClick()} startIcon={<MdDeleteForever />}>
            {props.label ? props.label : "Delete"}
        </Button>
    );
};
