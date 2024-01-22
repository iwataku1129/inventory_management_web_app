const dbConfig = require("../../config/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB_WEB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT_WEB,
    dialect: dbConfig.dialect,
    //operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },

    logging: (logStr, execTime, options) => {
        console.log(`${new Date().toLocaleString()} : ${logStr}`);
    },

    dialectOptions: {
        //useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: function (field, next) { // for reading from database
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
        },
    },
    timezone: '+09:00',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// [inventory]mastertable (user)
db.tb_user_master = require("./mastertable/tb_user_master_models.js")(sequelize, Sequelize);
db.v_user_master = require("./mastertable/v_user_master_models.js")(sequelize, Sequelize);

// [inventory]mastertable (supplier)
db.tb_supplier_master = require("./mastertable/tb_supplier_master_models.js")(sequelize, Sequelize);
db.v_supplier_master = require("./mastertable/v_supplier_master_models.js")(sequelize, Sequelize);

// [inventory]mastertable (product)
db.tb_product_master_hist = require("./mastertable/tb_product_master_hist_models.js")(sequelize, Sequelize);
db.tb_product_master_now = require("./mastertable/tb_product_master_now_models.js")(sequelize, Sequelize);
db.tb_product_category_1 = require("./mastertable/tb_product_category_1_models.js")(sequelize, Sequelize);
db.tb_product_category_2 = require("./mastertable/tb_product_category_2_models.js")(sequelize, Sequelize);
db.tb_product_category_3 = require("./mastertable/tb_product_category_3_models.js")(sequelize, Sequelize);
db.tb_product_kamoku_category = require("./mastertable/tb_product_kamoku_category_models.js")(sequelize, Sequelize);
db.v_product_master_hist = require("./mastertable/v_product_master_hist_models.js")(sequelize, Sequelize);
db.v_product_master_now = require("./mastertable/v_product_master_now_models.js")(sequelize, Sequelize);
db.v_product_category_1 = require("./mastertable/v_product_category_1_models.js")(sequelize, Sequelize);
db.v_product_category_2 = require("./mastertable/v_product_category_2_models.js")(sequelize, Sequelize);
db.v_product_category_3 = require("./mastertable/v_product_category_3_models.js")(sequelize, Sequelize);
db.v_product_kamoku_category = require("./mastertable/v_product_kamoku_category_models.js")(sequelize, Sequelize);

// [inventory]mastertable (inventory_category)
db.tb_inventory_category = require("./mastertable/tb_inventory_category_models.js")(sequelize, Sequelize);
db.v_inventory_category = require("./mastertable/v_inventory_category_models.js")(sequelize, Sequelize);

// [inventory]dayreporttable (product)
db.tb_day_report_product = require("./dayreporttable/tb_day_report_product_models.js")(sequelize, Sequelize);
db.tb_day_report_product_category = require("./dayreporttable/tb_day_report_product_category_models.js")(sequelize, Sequelize);
db.v_day_report_product = require("./dayreporttable/v_day_report_product_models.js")(sequelize, Sequelize);
db.v_day_report_product_category = require("./dayreporttable/v_day_report_product_category_models.js")(sequelize, Sequelize);

// [inventory]ordertable (product)
db.tb_order_product = require("./ordertable/tb_order_product_models.js")(sequelize, Sequelize);
db.tb_order_product_status = require("./ordertable/tb_order_product_status_models.js")(sequelize, Sequelize);
db.v_order_product = require("./ordertable/v_order_product_models.js")(sequelize, Sequelize);
db.v_order_product_status = require("./ordertable/v_order_product_status_models.js")(sequelize, Sequelize);
db.v_order_product_month = require("./ordertable/v_order_product_month_models.js")(sequelize, Sequelize);
db.v_order_product_supplier_month = require("./ordertable/v_order_product_supplier_month_models.js")(sequelize, Sequelize);

// [inventory]reporttable (product)
db.v_report_hist_product = require("./reporttable/v_report_hist_product_models.js")(sequelize, Sequelize);
db.v_report_stock_product = require("./reporttable/v_report_stock_product_models.js")(sequelize, Sequelize);
db.v_report_stock_product_group = require("./reporttable/v_report_stock_product_group_models.js")(sequelize, Sequelize);


module.exports = db;
