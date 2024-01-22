import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Controller, } from 'react-hook-form'

const CustomTextFieldFull = styled(TextField)({
    marginBottom: 14,
    marginLeft: 8,
    width: 'calc(100% - 10px)'
});
const CustomTextFieldHalf = styled(TextField)({
    marginBottom: 20,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 300,
    width: 'calc(50% - 20px)'
});
const CustomTextFieldSmall = styled(TextField)({
    marginBottom: 20,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 300,
    width: 'calc(30% - 20px)'
});
const CustomTextFieldXSmall = styled(TextField)({
    marginBottom: 20,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 200,
    width: 'calc(10% - 20px)'
});
const disabledStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "black",
        background: "#F0F0F0",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
        color: "rgba(0,0,0,0.6)",
    },
}



export const TextInput = (props: { name: string, control: any, validationRule?: any, widthType: "full" | "half" | "small" | "xsmall", disabled: boolean, label: string, rows: number, type: React.InputHTMLAttributes<unknown>['type'], shrink?: boolean }) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.validationRule || {}}
            render={({ field, fieldState }) => (

                props.widthType === "full" ?
                    <CustomTextFieldFull
                        {...field}
                        InputLabelProps={{ shrink: props.shrink }}
                        sx={disabledStyle}
                        disabled={props.disabled}
                        type={props.type}
                        label={props.label}
                        fullWidth={true}
                        margin="dense"
                        multiline={props.rows === 1 ? false : true}
                        rows={props.rows}
                        required={props.validationRule?.required ? true : false}
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                    />
                    :
                    props.widthType === "half" ?
                        <CustomTextFieldHalf
                            {...field}
                            InputLabelProps={{ shrink: props.shrink }}
                            sx={disabledStyle}
                            disabled={props.disabled}
                            type={props.type}
                            label={props.label}
                            fullWidth={false}
                            margin="dense"
                            multiline={props.rows === 1 ? false : true}
                            rows={props.rows}
                            required={props.validationRule?.required ? true : false}
                            error={fieldState.invalid}
                            helperText={fieldState.error?.message}
                        />
                        :
                        props.widthType === "small" ?
                            <CustomTextFieldSmall
                                {...field}
                                InputLabelProps={{ shrink: props.shrink }}
                                sx={disabledStyle}
                                disabled={props.disabled}
                                type={props.type}
                                label={props.label}
                                fullWidth={false}
                                margin="dense"
                                multiline={props.rows === 1 ? false : true}
                                rows={props.rows}
                                required={props.validationRule?.required ? true : false}
                                error={fieldState.invalid}
                                helperText={fieldState.error?.message}
                            />
                            :
                            <CustomTextFieldXSmall
                                {...field}
                                InputLabelProps={{ shrink: props.shrink }}
                                sx={disabledStyle}
                                disabled={props.disabled}
                                type={props.type}
                                label={props.label}
                                fullWidth={false}
                                margin="dense"
                                multiline={props.rows === 1 ? false : true}
                                rows={props.rows}
                                required={props.validationRule?.required ? true : false}
                                error={fieldState.invalid}
                                helperText={fieldState.error?.message}
                            />
            )}
        />
    );
};
