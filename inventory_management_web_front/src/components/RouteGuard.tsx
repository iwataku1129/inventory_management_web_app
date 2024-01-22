import { ReactNode, useState, useEffect } from 'react';
import { useMsal, MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Alert } from '@mui/material';
import { appRoles, loginRequest } from '../config/authConfig';

/**
 * The `MsalAuthenticationTemplate` component will render its children if a user is authenticated
 * or attempt to sign a user in. Just provide it with the interaction type you would like to use
 * (redirect or popup) and optionally a request object to be passed to the login API, a component to display while
 * authentication is in progress or a component to display if an error occurs. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */

const authRequest = {
    ...loginRequest,
};

export const RouteGuard = (props: { children: ReactNode, roles: { name: string, read: boolean, create: boolean, update: boolean, delete: boolean }[] }) => {
    const location = useLocation();
    const { instance } = useMsal();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const currentAccount = instance.getActiveAccount();

    useEffect(() => {
        const onLoad = async () => {
            if (currentAccount && currentAccount.idTokenClaims && currentAccount.idTokenClaims['roles']) {
                const roles = currentAccount.idTokenClaims['roles']
                let intersection = props.roles
                    .filter((role: { name: string }) => roles.includes(role.name));
                if (intersection.length > 0) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            }
        };
        onLoad();
    }, [instance, currentAccount, props.roles]);

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >

            {isAuthorized ? (
                <div>{props.children}</div>
            ) : (
                <div className="Align-center + ms-3">
                    <center>
                        <div>
                            このページを表示する権限がありません。<br /><br />
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ユーザー名: </th>
                                        <td>{currentAccount ? currentAccount.name : "-"}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>あなたの権限: </th>
                                        <td>{currentAccount && currentAccount.idTokenClaims && currentAccount.idTokenClaims['roles'] ? currentAccount.idTokenClaims['roles'].join(" / ") : "-"}</td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th>Path: </th>
                                        <td>{location.pathname}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </center>
                </div>
            )}

        </MsalAuthenticationTemplate>
    );
};

export const RouteGuardButton = (props: { children: ReactNode, roleCat: "read" | "create" | "update" | "delete" | "admin" | "super", alert?: boolean }) => {
    const { instance } = useMsal();
    const currentAccount = instance.getActiveAccount();
    const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const onLoad = async () => {
            if (currentAccount && currentAccount.idTokenClaims && currentAccount.idTokenClaims['roles']) {
                const roles = currentAccount.idTokenClaims['roles']
                const roleCat = props.roleCat
                const config = Object.values(appRoles)
                for (const tmp in config) {
                    const role = config[tmp]
                    if (roles.includes(role.name)) {
                        if (role[roleCat]) {
                            setIsAuthorized(true);
                            return
                        }
                    }
                }
            }
            setIsAuthorized(false)
        };
        onLoad();
    }, [instance, currentAccount, props.roleCat]);

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            {(() => {
                if (isAuthorized) {
                    return (<>{props.children}</>)
                } else if (isAuthorized === false && props.alert) {
                    return (<Alert className="mb-2" severity="warning">権限が付与されていません</Alert>)
                }
            })()}
        </MsalAuthenticationTemplate>
    )
};
