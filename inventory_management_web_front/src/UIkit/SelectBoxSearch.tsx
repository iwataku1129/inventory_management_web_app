import { Box, FormControl, FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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

export const SelectBoxSearch = (props: { name: string, control: any, validationRule?: any, widthType: "full" | "half" | "small" | "xsmall", disabled: boolean, disableClearable?: boolean, label: string, options: { id: number | string, name: string }[], groupBy?: string }) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.validationRule || {}}
            render={({ field: { onChange, value }, fieldState }) => (
                <FormControl fullWidth={props.widthType === "full" ? true : false} error={fieldState.invalid} required={props.validationRule?.required ? true : false} sx={formStyle[props.widthType]}>
                    <Autocomplete
                        groupBy={(option) => props.groupBy ? option[props.groupBy] : props.label}
                        renderGroup={(params) => (
                            <div key={params.key}>
                                <div style={{ "backgroundColor": "#ffffdd" }}>〖{params.group}〗</div>
                                <div>{params.children}</div>
                            </div>
                        )}
                        readOnly={props.disabled}
                        disableClearable={props.disableClearable}
                        onChange={(_, data: any) => onChange(data || null)}
                        //options={props.options.map(({ id, name }) => ({ id, name }))}
                        options={props.options}
                        value={value}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, newValue) => {
                            return option.id === newValue.id;
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={props.label} label={props.label} error={fieldState.invalid} sx={disabledStyle} disabled={props.disabled} required={props.validationRule?.required ? true : false} />
                        )}
                        renderOption={(props, option) => {
                            return (
                                <Box component="li" {...props} key={option.id}>
                                    {option.name}
                                </Box>
                            )
                        }}
                    //onInputChange={(_evt, newValue) => setSearch(newValue)}
                    //inputValue={search}
                    />
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    );
};