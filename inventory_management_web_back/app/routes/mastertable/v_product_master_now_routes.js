const router = require("express").Router();
const tablename = require("../../controllers/mastertable/v_product_master_now_controllers.js");

// set base route
router.use("/v1/master/v_product_master_now", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (One)
router.get("/product_code/:product_code", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

module.exports = router