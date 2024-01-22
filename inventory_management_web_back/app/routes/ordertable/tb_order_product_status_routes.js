const router = require("express").Router();
const tablename = require("../../controllers/ordertable/tb_order_product_status_controllers.js");

// set base route
router.use("/v1/order/order_product_status", router);

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