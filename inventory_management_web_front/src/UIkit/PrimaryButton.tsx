import { Button, createTheme } from '@mui/material';

const theme = createTheme()
const styles = {
    backgroundColor: theme.palette.primary.main,
    color: '#000',
    fontSize: 16,
    height: 48,
    marginBottom: 16,
    width: 256,
    "&:hover": {
        backgroundColor: theme.palette.primary.light,
    }
}

export const PrimaryButton = (props: { label: string, onClick: any, type: 'submit' | 'reset' | 'button', disabled?: boolean }) => {
    return (
        <Button sx={styles} variant="contained" type={props.type} disabled={props.disabled ? true : false} onClick={() => props.onClick()}>
            {props.label}
        </Button>
    );
};
