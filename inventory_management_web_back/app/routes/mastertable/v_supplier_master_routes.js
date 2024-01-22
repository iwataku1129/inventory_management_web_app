const router = require("express").Router();
const tablename = require("../../controllers/mastertable/v_supplier_master_controllers.js");

// set base route
router.use("/v1/master/v_supplier_master", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (One)
router.get("/id/:id", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

module.exports = router