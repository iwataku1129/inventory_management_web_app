import { Button } from '@mui/material';
import { MdLocationPin } from "react-icons/md";


export const PostalButton = (props: { label?: string, disabled?: boolean, onClick: any }) => {
    return (
        <Button id={"1"} variant="outlined" className="ms-2 + mb-3" size="large" color="error" disabled={props.disabled ? true : false} onClick={props.onClick} startIcon = {< MdLocationPin />}>
            { props.label ? props.label : "住所検索" }
        </Button >
    );
};
