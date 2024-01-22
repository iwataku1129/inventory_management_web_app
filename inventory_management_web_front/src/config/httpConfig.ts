
import axios from "axios";

export const axiosConfig = (bearer: string, inv_cat_path?: string, opentime?: string) => {
    return axios.create({
        baseURL: import.meta.env.VITE_APP_backendURL + '/api',
        headers: {
            "Accept": "inventory-manage-net",
            "Content-type": "application/json",
            "Authorization": bearer,
            "opentime": opentime,
            "invcat": inv_cat_path
        },
        responseType: 'json',
    })
}
export const axiosUnAuthConfig = () => {
    return axios.create({
        baseURL: import.meta.env.VITE_APP_backendURL,
        headers: {
            "Accept": "inventory-manage-net",
            "Content-type": "application/json",
        },
        responseType: 'json',
    })
}
export const axiosOtherPageConfig = () => {
    return axios.create({
        //baseURL: url,
        headers: {
            "Content-type": "application/json",
        },
        responseType: 'json',
    })
}