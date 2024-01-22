const router = require("express").Router();
const tablename = require("../../controllers/mastertable/tb_user_master_controllers.js");

// set base route
router.use("/v1/master/user", router);

// Get (All)
//router.get(`/`, tablename.findAll);

// Get (One)
router.get(`/id/:id`, tablename.findOne);

// Get (One (Me))
router.get(`/me`, tablename.findOneMe);

// Get (query)
//router.get(/^\/(.+)/,tablename.query)

// POST
router.post(`/`, tablename.create);
router.post(`/inv_path/:path`, tablename.createInvPath);

// PUT
router.put(`/`, tablename.update);

// Delete (One)
router.delete(`/:id`, tablename.delete);

module.exports = router