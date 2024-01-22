import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication, EventType } from "@azure/msal-browser";

import { msalConfig } from "./config/authConfig";

import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { SWUpdateDialog } from './ServiceWorkerUpdateDialog';
//import reportWebVitals from './reportWebVitals';

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

if (import.meta.env.MODE !== "development") {
  console.log = () => { }
  console.debug = () => { }
  console.warn = () => { }
  console.info = () => { }
}

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

/**
 * To set an active account after the user signs in, register an event and listen to LOGIN_SUCCESS & LOGOUT_SUCCES. For more,
 * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
 */
msalInstance.addEventCallback((event: any) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }

  if (event.eventType === EventType.LOGOUT_SUCCESS) {
    if (msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }
  }

  if (event.eventType === EventType.LOGIN_FAILURE) {
    console.log(JSON.stringify(event));
  }
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App instance={msalInstance} />
    </BrowserRouter>
  </React.StrictMode>,
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.register();
serviceWorkerRegistration.register({
  onUpdate: registration => {
    if (registration.waiting) {
      const dialog = ReactDOM.createRoot(document.getElementById('sw-update-dialog') as HTMLElement);
      dialog.render(<SWUpdateDialog registration={registration} />)
    }
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
