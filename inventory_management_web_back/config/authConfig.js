require('dotenv').config();
const passportConfig = {
    credentials: {
        tenantID: process.env.TENANT_ID,
        clientID: process.env.CLIENT_ID
    },
    metadata: {
        authority: 'login.microsoftonline.com',
        discovery: '.well-known/openid-configuration',
        version: 'v2.0',
    },
    settings: {
        validateIssuer: true,
        passReqToCallback: true,
        loggingLevel: 'warn',
        loggingNoPII: true,
    },
    protectedRoutes: {
        webapp: {
            endpoint: '/api',
            delegatedPermissions: {
                scopes: ['access_via_approle_assignments'],
            },
        },
    },
    accessMatrix: [
        // master
        {
            path: '/master/v_user/me/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/v_user/all/',
            methods: { 'GET': ['Super', 'Admin'], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/v_user/inv_path/',
            methods: { 'GET': ['Super'], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/user/',
            methods: { 'GET': ['Super', 'Admin'], 'POST': ['Super', 'Admin'], 'PUT': ['Super', 'Admin'], 'DELETE': ['Super', 'Admin'] },
        },
        {
            path: '/master/user/inv_path/',
            methods: { 'GET': [], 'POST': ['Super'], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/inventory_category/',
            methods: { 'GET': [], 'POST': ['Super'], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/v_inventory_category/',
            methods: { 'GET': ['Super'], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/supplier_master/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/master/v_supplier_master/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/product_master_now/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/master/v_product_master_now/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/v_product_master_hist/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/product_kamoku_category/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/master/v_product_kamoku_category/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/product_category_1/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/master/v_product_category_1/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/product_category_2/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/master/v_product_category_2/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/master/product_category_3/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/master/v_product_category_3/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        // DayRep
        {
            path: '/dayrep/day_report_product_category/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/dayrep/v_day_report_product_category/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/dayrep/day_report_product/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/dayrep/v_day_report_product/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        // order
        {
            path: '/order/order_product/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate',], 'PUT': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate',], 'DELETE': ['Super', 'Admin', 'AllCreateUpdateDelete',] },
        },
        {
            path: '/order/v_order_product/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/order/v_order_product_month/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/order/v_order_product_supplier_month/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/order/v_order_product_status/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        // Stock
        {
            path: '/report/v_report_stock_product/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        {
            path: '/report/v_report_stock_product_group/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
        // Hist
        {
            path: '/report/v_report_hist_product/',
            methods: { 'GET': ['Super', 'Admin', 'AllCreateUpdateDelete', 'AllCreateUpdate', 'AllCreate', 'AllReadOnly',], 'POST': [], 'PUT': [], 'DELETE': [] },
        },
    ],
};

module.exports = passportConfig;
