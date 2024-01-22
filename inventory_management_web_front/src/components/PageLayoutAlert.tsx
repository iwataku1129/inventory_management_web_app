import { Alert, AlertTitle } from "@mui/material"
import { ChangeButton } from "../UIkit"

export const PageLayout = (props: { errMsg: String }) => {
    return (
        <Alert severity="error"><AlertTitle>Error</AlertTitle>
            <div>{props.errMsg}</div>
            <div className="mt-2"><ChangeButton onClick={() => window.location.reload()} label="再試行" /></div>
        </Alert>
    )
}