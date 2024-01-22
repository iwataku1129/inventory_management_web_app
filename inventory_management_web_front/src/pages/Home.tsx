import { useCallback, useEffect, useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { CircularProgress, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { PageLayoutAlert } from '../components';
import { GridCard } from '../UIkit';
import { MdStar, MdListAlt } from "react-icons/md";
import { BsBoxSeamFill } from "react-icons/bs";

import { useMsal } from "@azure/msal-react";
// API imports
import { AxiosError } from "axios";
import { apiPath } from "../config/authConfig";
import { ApiGet } from "../utils/ApiCall";
import { getErrorMessage } from "../utils/ErrorMessage";
import { InteractionStatus } from "@azure/msal-browser";


export const Home = () => {
    const { instance, inProgress } = useMsal();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String>("");
    const [alignment, setAlignment] = useState<string | null>('star');
    const [userInfo, setUserInfo] = useState<{ inventory_category_id: number, inventory_category: string }[]>();
    const handleAlignment: any = (_: React.MouseEvent<HTMLElement>, newAlignment: string | null,) => {
        if (newAlignment) {
            setAlignment(newAlignment);
        }
    };

    // DidMount
    useEffect(() => {
        const mainFunction = async () => {
            setLoading(true)
            if (instance.getActiveAccount() && inProgress === InteractionStatus.None) {
                try {
                    await ApiGet(apiPath.master.vUser, `me/`)
                        .then(response => handleChangeUserInfo(response))
                    setLoading(false)
                } catch (e: any) {
                    handleChangeError(e)
                }
            }
        }
        mainFunction()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProgress, instance]);
    // Change CallBackFunctions
    const handleChangeUserInfo = useCallback((result: any) => {
        setUserInfo(result?.data)
    }, [setUserInfo]);

    const handleChangeError = useCallback(async (e: AxiosError) => {
        const htmlMessage = await getErrorMessage(e)
        setError(htmlMessage.split('<br/>').join("\n"))
    }, [setError])

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return (
        <>
            <AuthenticatedTemplate>
                {error && (<PageLayoutAlert errMsg={error} />)}
                {loading && !error ?
                    <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
                    :
                    <div className="mb-5">
                        <div className="mb-5">
                            <h3>
                                <center>
                                    Welcome to 在庫管理Web
                                </center>
                            </h3>
                        </div>
                        <div className="">
                            {(() => {
                                if (alignment === "star") {
                                    return (
                                        <>
                                            <div>
                                                <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                                                    {userInfo?.map((field: any) => (
                                                        <div key={field.id}>
                                                            <GridCard title={`${field?.inventory_category}`} subtitle="在庫管理ページ" href={`/${field?.inventory_category_path}/order`} minWidth={290}>
                                                                <div className="mt-2" style={{ display: "flex", justifyContent: "center" }}><BsBoxSeamFill size={85} /></div>
                                                            </GridCard>
                                                        </div>
                                                    ))}
                                                </Grid>
                                            </div>
                                        </>
                                    )
                                } else if (alignment === "settings") {
                                    return (
                                        <>
                                            <center>T.B.D.</center>
                                        </>
                                    )
                                }
                            })()}
                        </div>
                        <div className="mt-5 + text-center">
                            <ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment} aria-label="text alignment" >
                                <ToggleButton value="star" aria-label="toggle-star">
                                    <MdStar size={35} />
                                </ToggleButton>
                                <ToggleButton value="settings" aria-label="toggle-list">
                                    <MdListAlt size={35} />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div className="mt-1 + text-center">
                            ※ページ追加をご希望の方は管理者へご連絡をお願いします。
                        </div>
                    </div>
                }
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <h3>
                    <center>
                        右上の<code>[Sign in]</code>よりログインをしてください
                    </center>
                </h3>

            </UnauthenticatedTemplate>
        </>
    );
};
