const router = require("express").Router();
const tablename = require("../../controllers/reporttable/v_report_hist_product_controllers.js");

// set base route
router.use("/v1/report/v_report_hist_product", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (One)
router.get("/id/:id", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

module.exports = router