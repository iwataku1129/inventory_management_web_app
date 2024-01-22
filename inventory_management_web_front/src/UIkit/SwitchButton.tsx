import { FormControlLabel, Switch } from '@mui/material';
import { Controller, } from 'react-hook-form'


export const SwitchButton = (props: { name: string, control: any, label?: string, disabled?: boolean }) => {
    return (
        <FormControlLabel
            control={
                <Controller
                    name={props.name}
                    control={props.control}
                    rules={{}}
                    render={({ field }) => (
                        <Switch
                            onChange={(e) => field.onChange(e.target.checked)}
                            checked={field.value}
                            disabled={props.disabled}
                        />
                    )}
                />
            }
            label={props.label}
        />
    );
};
