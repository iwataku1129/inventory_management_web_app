const router = require("express").Router();
const tablename = require("../../controllers/dayreporttable/tb_day_report_product_category_controllers.js");

// set base route
router.use("/v1/dayrep/day_report_product_category", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (One)
router.get("/id/:id", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

// POST
router.post("/", tablename.create);

// PUT
router.put("/", tablename.update);

// Delete (One)
router.delete("/:id", tablename.delete);

module.exports = router