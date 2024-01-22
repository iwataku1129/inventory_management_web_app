import { loginRequest } from "../config/authConfig";
import { axiosConfig, axiosUnAuthConfig, axiosOtherPageConfig } from "../config/httpConfig";
import { msalInstance } from "../index";
import { AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";


const getAcessToken = async () => {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }

    const responseToken = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account
    });
    return responseToken.accessToken
}

export const ApiGetOtherPage = async (path: string) => {
    const http = axiosOtherPageConfig()
    const response = await http.get(path)
        .then(res => res)
        .catch(e => e)
    return response
}

export const ApiGetUnAuth = async (path: string, query: string = "") => {
    const http = axiosUnAuthConfig()
    const response = await http.get(`${path}/${query ? query : ""}`)
        .then(res => res)
        .catch(e => e)
    return response
}

export const ApiGet = async (path: string, query: string = "", inv_cat_path?: string) => {
    const http = axiosConfig(`Bearer ${await getAcessToken()}`, inv_cat_path)
    const response = await http.get(`${path}/${query ? query : ""}`)
        .then(res => res)
        .catch(async e => {
            if (e instanceof InteractionRequiredAuthError) {
                await msalInstance.acquireTokenRedirect({
                    ...loginRequest,
                    account: msalInstance.getActiveAccount() as AccountInfo
                })
                    .catch((e) => { throw e })
            } else { throw e }
        });
    return response
}

export const ApiPost = async (path: string, data: {}, inv_cat_path?: string, opentime?: string) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const http = axiosConfig(`Bearer ${await getAcessToken()}`, inv_cat_path, opentime)
    const response = await http.post(path.slice(-1) === "/" ? path : path + "/", data)
        .then(res => res)
        .catch(async e => {
            if (e instanceof InteractionRequiredAuthError) {
                await msalInstance.acquireTokenRedirect({
                    ...loginRequest,
                    account: msalInstance.getActiveAccount() as AccountInfo
                })
                    .catch((e) => { throw e })
            } else { throw e }
        });
    await sleep(1000);
    return response
}

export const ApiPut = async (path: string, opentime: string, data?: {}, inv_cat_path?: string) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const http = axiosConfig(`Bearer ${await getAcessToken()}`, inv_cat_path, opentime)
    const response = await http.put(path.slice(-1) === "/" ? path : path + "/", data)
        .then(res => res)
        .catch(async e => {
            if (e instanceof InteractionRequiredAuthError) {
                await msalInstance.acquireTokenRedirect({
                    ...loginRequest,
                    account: msalInstance.getActiveAccount() as AccountInfo
                })
                    .catch((e) => { throw e })
            } else { throw e }
        });
    await sleep(1000);
    return response
}

export const ApiDelete = async (path: string, opentime: string, inv_cat_path?: string, data?: {}) => {
    const http = axiosConfig(`Bearer ${await getAcessToken()}`, inv_cat_path, opentime)
    const response = await http.delete(path.slice(-1) === "/" ? path : path + "/", { "data": data })
        .then(res => res)
        .catch(async e => {
            if (e instanceof InteractionRequiredAuthError) {
                await msalInstance.acquireTokenRedirect({
                    ...loginRequest,
                    account: msalInstance.getActiveAccount() as AccountInfo
                })
                    .catch((e) => { throw e })
            } else { throw e }
        });
    return response
}