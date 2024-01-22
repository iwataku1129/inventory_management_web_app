import { InputLabel, MenuItem, FormControl, FormHelperText, Select } from '@mui/material';
import { Controller } from 'react-hook-form'


const formStyle = {
    full: {
        marginBottom: 2,
        marginLeft: 1,
        width: 'calc(100% - 9px)'
    },
    half: {
        marginTop: 1,
        marginBottom: 2,
        marginLeft: 1,
        minWidth: 300,
        width: 'calc(50% - 16px)'
    },
    small: {
        marginTop: 1,
        marginBottom: 2,
        marginLeft: 1,
        minWidth: 300,
        width: 'calc(30% - 16px)'
    },
    xsmall: {
        marginTop: 1,
        marginBottom: 2,
        marginLeft: 1,
        minWidth: 200,
        width: 'calc(10% - 16px)'
    }
}
const disabledStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "black",
        background: "#F0F0F0",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
        color: "rgba(0,0,0,0.6)",
    },
}

export const SelectBox = (props: { name: string, control: any, validationRule?: any, widthType: "full" | "half" | "small" | "xsmall", disabled: boolean, label: string, options: { id: number | string, name: string }[] }) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.validationRule || {}}
            render={({ field, fieldState }) => (
                <FormControl fullWidth={props.widthType === "full" ? true : false} error={fieldState.invalid} required={props.validationRule?.validate ? true : false} sx={formStyle[props.widthType]}>
                    <InputLabel id={`${props.name}-label`}>{props.label}</InputLabel>
                    <Select
                        sx={disabledStyle}
                        disabled={props.disabled}
                        labelId={`${props.name}-label`}
                        label={props.label}
                        {...field}
                    >
                        {props.options.map((value: { id: number | string, name: string }) => {
                            return <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
                        })}
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    );
};
