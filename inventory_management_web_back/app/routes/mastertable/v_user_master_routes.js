const router = require("express").Router();
const tablename = require("../../controllers/mastertable/v_user_master_controllers.js");

// set base route
router.use("/v1/master/v_user", router);

// Get (All)
//router.get(`/`, tablename.findAll);
router.get(`/all`, tablename.findAll);
router.get(`/inv_path/:path`, tablename.findAllInvPath);

// Get (One)
router.get(`/id/:id`, tablename.findOne);

// Get (One (Me))
router.get(`/me`, tablename.findAllMe);

module.exports = router