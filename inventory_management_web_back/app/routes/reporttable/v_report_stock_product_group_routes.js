const router = require("express").Router();
const tablename = require("../../controllers/reporttable/v_report_stock_product_group_controllers.js");

// set base route
router.use("/v1/report/v_report_stock_product_group", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (All)
router.get("/query", tablename.findAllQuery);

// Get (One)
router.get("/id/:id", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

module.exports = router