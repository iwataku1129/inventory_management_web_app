const router = require("express").Router();
const tablename = require("../../controllers/ordertable/v_order_product_status_controllers.js");

// set base route
router.use("/v1/order/v_order_product_status", router);

// Get (All)
router.get("/", tablename.findAll);
router.get("/phase/:phase", tablename.findAllPhase);

// Get (One)
router.get("/id/:id", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

module.exports = router