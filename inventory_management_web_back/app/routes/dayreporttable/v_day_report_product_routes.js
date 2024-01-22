const router = require("express").Router();
const tablename = require("../../controllers/dayreporttable/v_day_report_product_controllers.js");

// set base route
router.use("/v1/dayrep/v_day_report_product", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (One)
router.get("/id/:id", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

module.exports = router