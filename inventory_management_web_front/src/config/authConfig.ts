/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        authority: `https://login.microsoftonline.com/${String(import.meta.env.VITE_APP_tenantId)}`,
        //clientCapabilities: ['CP1'], // this lets the resource owner know that this client is capable of handling claims challenge.
        clientId: String(import.meta.env.VITE_APP_clientId), 
        redirectUri: import.meta.env.VITE_APP_redirectUri, // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
        postLogoutRedirectUri: import.meta.env.VITE_APP_postLogoutRedirectUri, // Indicates the page to navigate after logout.
    },
    cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                }
            },
        },
    },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const apiPath = {
    master: {
        // user
        user: '/v1/master/user',
        userInvPath: '/v1/master/user/inv_path',
        vUser: '/v1/master/v_user',
        // page
        inventCategory: '/v1/master/inventory_category',
        vInventCategory: '/v1/master/v_inventory_category',
        // supplier
        supplier: '/v1/master/supplier_master',
        vSupplier: '/v1/master/v_supplier_master',
        // Product
        productNow: '/v1/master/product_master_now',
        productKamokuCat: '/v1/master/product_kamoku_category',
        productCat1: '/v1/master/product_category_1',
        productCat2: '/v1/master/product_category_2',
        productCat3: '/v1/master/product_category_3',
        vProductNow: '/v1/master/v_product_master_now',
        vProductHist: '/v1/master/v_product_master_hist',
        vProductKamokuCat: '/v1/master/v_product_kamoku_category',
        vProductCat1: '/v1/master/v_product_category_1',
        vProductCat2: '/v1/master/v_product_category_2',
        vProductCat3: '/v1/master/v_product_category_3',
        // scope
        scopes: [`api://${msalConfig.auth.clientId}/access_via_approle_assignments`],
    },
    order: {
        // order
        orderProduct: '/v1/order/order_product',
        vOrderProduct: '/v1/order/v_order_product',
        vOrderProductSts: '/v1/order/v_order_product_status',
        vOrderProductMonth: '/v1/order/v_order_product_month',
        vOrderProductSupplierMonth: '/v1/order/v_order_product_supplier_month',
        // scope
        scopes: [`api://${msalConfig.auth.clientId}/access_via_approle_assignments`],
    },
    dayreport: {
        // DayReport
        dayRepProduct: '/v1/dayrep/day_report_product',
        vDayRepProduct: '/v1/dayrep/v_day_report_product',
        dayRepCat1: '/v1/dayrep/day_report_product_category',
        vDayRepCat1: '/v1/dayrep/v_day_report_product_category',
        // scope
        scopes: [`api://${msalConfig.auth.clientId}/access_via_approle_assignments`],
    },
    stock: {
        // Stock
        vReportStockProduct: '/v1/report/v_report_stock_product',
        vReportStockProductGroup: '/v1/report/v_report_stock_product_group',
        vReportHistProduct: '/v1/report/v_report_hist_product',
        // scope
        scopes: [`api://${msalConfig.auth.clientId}/access_via_approle_assignments`],
    },
};


/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: [...apiPath.master.scopes],
};

export const appRoles = {
    All_R: { name: "AllReadOnly", read: true, create: false, update: false, delete: false, admin: false, super:false },
    All_CR: { name: "AllCreate", read: true, create: true, update: false, delete: false, admin: false, super:false },
    All_CRU: { name: "AllCreateUpdate", read: true, create: true, update: true, delete: false, admin: false, super:false },
    All_CRUD: { name: "AllCreateUpdateDelete", read: true, create: true, update: true, delete: true, admin: false, super:false },
    Admin: { name: "Admin", read: true, create: true, update: true, delete: true, admin: true, super:false },
    Super: { name: "Super", read: true, create: true, update: true, delete: true, admin: true, super:true },
}
