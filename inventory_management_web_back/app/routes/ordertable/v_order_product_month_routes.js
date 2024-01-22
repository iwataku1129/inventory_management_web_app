const router = require("express").Router();
const tablename = require("../../controllers/ordertable/v_order_product_month_controllers.js");

// set base route
router.use("/v1/order/v_order_product_month", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (One)
router.get("/id/:id", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

module.exports = router