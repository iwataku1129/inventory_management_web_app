import { ReactNode } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { NavigationBar } from "./NavigationBar";

export const PageLayout = (props: { children: ReactNode }) => {

    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not. 
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will 
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */
    return (
        <div className="App-header">
            <NavigationBar />
            <br />
            {props.children}
            <br />
            <AuthenticatedTemplate>
                <footer>
                    <center>{import.meta.env.VITE_APP_copylight || "Copyright © TakumaIwai 2024"}
                        <a href={`mailto:${import.meta.env.VITE_APP_contact || "xxx@yyy.com"}?subject=【在庫管理Web】お問い合わせ`} target="_blank" rel="noopener noreferrer"> contact us!</a>
                    </center>
                </footer>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <footer>
                    <center>{import.meta.env.VITE_APP_copylight || "Copyright © TakumaIwai 2024"}</center>
                </footer>
            </UnauthenticatedTemplate>
        </div>
    );
};