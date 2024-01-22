const router = require("express").Router();
const tablename = require("../../controllers/mastertable/tb_product_master_now_controllers.js");

// set base route
router.use("/v1/master/product_master_now", router);

// Get (All)
router.get("/", tablename.findAll);

// Get (One)
router.get("/product_code/:product_code", tablename.findOne);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

// POST
router.post("/", tablename.create);

// PUT
//router.put("/", tablename.update);

// Delete (One)
//router.delete("/:id", tablename.delete);

module.exports = router