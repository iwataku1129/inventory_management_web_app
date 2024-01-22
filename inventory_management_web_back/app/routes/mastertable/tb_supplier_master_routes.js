const router = require("express").Router();
const tablename = require("../../controllers/mastertable/tb_supplier_master_controllers.js");

// set base route
router.use("/v1/master/supplier_master", router);

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