const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const passport = require('passport');
const passportAzureAd = require('passport-azure-ad');
const authConfig = require('./config/authConfig.js');
const routeGuard = require('./auth/guard.js');

const app = express();

/**
 * Enable CORS middleware. In production, modify as to allow only designated origins and methods.
 * If you are using Azure App Service, we recommend removing the line below and configure CORS on the App Service itself.
 */
const corsOptions = {
    origin: "*" // "http://localhost:3000"
};
app.use(cors(corsOptions));
app.use(morgan('dev'));

// status return code 304回避
app.disable('etag');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Todo:もし同期が必要であれば有効化
//const db = require("./app/models");

//db.sequelize.sync();
// // drop the table if it already exists
//db.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
//});

const bearerStrategy = new passportAzureAd.BearerStrategy({
    identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
    issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
    clientID: authConfig.credentials.clientID,
    audience: authConfig.credentials.clientID, // audience is this application
    validateIssuer: authConfig.settings.validateIssuer,
    passReqToCallback: authConfig.settings.passReqToCallback,
    loggingLevel: authConfig.settings.loggingLevel,
    loggingNoPII: authConfig.settings.loggingNoPII,
}, (req, token, done) => {
    /**
     * Below you can do extended token validation and check for additional claims, such as:
     * - check if the caller's tenant is in the allowed tenants list via the 'tid' claim (for multi-tenant applications)
     * - check if the caller's account is homed or guest via the 'acct' optional claim
     * - check if the caller belongs to right roles or groups via the 'roles' or 'groups' claim, respectively
     *
     * Bear in mind that you can do any of the above checks within the individual routes and/or controllers as well.
     * For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validate-the-user-has-permission-to-access-this-data
     */

    /**
     * Lines below verifies if the caller's client ID is in the list of allowed clients.
     * This ensures only the applications with the right client ID can access this API.
     * To do so, we use "azp" claim in the access token. Uncomment the lines below to enable this check.
     */
    const myAllowedClientsList = [
        /* add here the client IDs of the applications that are allowed to call this API */
        authConfig.credentials.clientID,
    ]

    if (!myAllowedClientsList.includes(token.azp)) {
        return done(new Error('Unauthorized'), {}, "Client not allowed");
    }

    /**
     * Access tokens that have neither the 'scp' (for delegated permissions) nor
     * 'roles' (for user roles or application permissions) claim are not to be honored.
     */
    if (!token.hasOwnProperty('scp') && !token.hasOwnProperty('roles')) {
        return done(new Error('Unauthorized'), null, "No delegated or app permission claims found");
    }

    /**
     * If needed, pass down additional user info to route using the second argument below.
     * This information will be available in the req.user object.
     */
    return done(null, {}, token);
});

app.use(passport.initialize());

passport.use(bearerStrategy);

// simple route
app.get("/", (req, res) => {
    res.json({ message: `Welcome to inventory Web Apps` });
});
// current dt
app.get("/current", (req, res) => {
    const now = new Date()
    nowString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2,0)}-${now.getDate().toString().padStart(2,0)} ${now.getHours().toString().padStart(2,0)}:${now.getMinutes().toString().padStart(2,"0")}:${now.getSeconds().toString().padStart(2,"0")}`
    res.status(200).send(nowString)
});

// api req
app.use('/api'
    , (req, res, next) => {
        passport.authenticate('oauth-bearer', { session: false }, (err, user, info) => {
            if (err) {
                /**
                 * An error occurred during authorization. Either pass the error to the next function
                 * for Express error handler to handle, or send a response with the appropriate status code.
                 */
                return res.status(401).json({ error: err.message });
            }

            if (!user) {
                // If no user object found, send a 401 response.
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (info) {
                // access token payload will be available in req.authInfo downstream
                req.authInfo = info;
                return next();
            }
        })(req, res, next)
    },
    // check router guard
    routeGuard(authConfig.accessMatrix),

    // [inventory]mastertable (user)
    require("./app/routes/mastertable/tb_user_master_routes.js"),
    require("./app/routes/mastertable/v_user_master_routes.js"),

    // [inventory]mastertable (supplier)
    require("./app/routes/mastertable/tb_supplier_master_routes.js"),
    require("./app/routes/mastertable/v_supplier_master_routes.js"),

    // [inventory]mastertable (product)
    require("./app/routes/mastertable/tb_product_master_hist_routes.js"),
    require("./app/routes/mastertable/tb_product_master_now_routes.js"),
    require("./app/routes/mastertable/tb_product_category_1_routes.js"),
    require("./app/routes/mastertable/tb_product_category_2_routes.js"),
    require("./app/routes/mastertable/tb_product_category_3_routes.js"),
    require("./app/routes/mastertable/tb_product_kamoku_category_routes.js"),
    require("./app/routes/mastertable/v_product_master_hist_routes.js"),
    require("./app/routes/mastertable/v_product_master_now_routes.js"),
    require("./app/routes/mastertable/v_product_category_1_routes.js"),
    require("./app/routes/mastertable/v_product_category_2_routes.js"),
    require("./app/routes/mastertable/v_product_category_3_routes.js"),
    require("./app/routes/mastertable/v_product_kamoku_category_routes.js"),

    // [inventory]mastertable (inventory_category)
    require("./app/routes/mastertable/tb_inventory_category_routes.js"),
    require("./app/routes/mastertable/v_inventory_category_routes.js"),
    
    // [inventory]dayreporttable (product)
    require("./app/routes/dayreporttable/tb_day_report_product_routes.js"),
    require("./app/routes/dayreporttable/tb_day_report_product_category_routes.js"),
    require("./app/routes/dayreporttable/v_day_report_product_routes.js"),
    require("./app/routes/dayreporttable/v_day_report_product_category_routes.js"),
    
    // [inventory]ordertable (product)
    require("./app/routes/ordertable/tb_order_product_routes.js"),
    require("./app/routes/ordertable/tb_order_product_status_routes.js"),
    require("./app/routes/ordertable/v_order_product_routes.js"),
    require("./app/routes/ordertable/v_order_product_status_routes.js"),
    require("./app/routes/ordertable/v_order_product_month_routes.js"),
    require("./app/routes/ordertable/v_order_product_supplier_month_routes.js"),

    // [inventory]reporttable (product)
    require("./app/routes/reporttable/v_report_hist_product_routes.js"),
    require("./app/routes/reporttable/v_report_stock_product_routes.js"),
    require("./app/routes/reporttable/v_report_stock_product_group_routes.js"),

    // error handle
    (err, req, res, next) => {
        /**
         * Add your custom error handling logic here. For more information, see:
         * http://expressjs.com/en/guide/error-handling.html
         */

        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // send error response
        res.status(err.status || 500).send(err);
    }
);

// set port, listen for requests
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
    console.log(`${new Date().toLocaleString()} : Server is running on port ${port}.`);
});

module.exports = app;