import { Button } from '@mui/material';
import { MdAddBox } from "react-icons/md";


export const AddButton = (props: { label?: string, disabled?: boolean, onClick: any }) => {
    return (
        <Button variant="outlined" size="small" color="inherit" disabled={props.disabled ? true : false} onClick={() => props.onClick()} startIcon={<MdAddBox />}>
            {props.label ? props.label : "追加"}
        </Button>
    );
};
