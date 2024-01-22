import { Button } from '@mui/material';
import { MdSearch } from "react-icons/md";


export const SearchButton = (props: { label?: string, disabled?: boolean, onClick?: any, type: 'submit' | 'reset' | 'button' }) => {
    return (
        <Button id={"1"} variant="outlined" size="large" color="error" type={props.type} disabled={props.disabled ? true : false} onClick={props.onClick} startIcon={< MdSearch />}>
            {props.label ? props.label : "検索"}
        </Button >
    );
};
