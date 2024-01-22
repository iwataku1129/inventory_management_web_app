const db = require("../../models");
const v_order_product = db.v_order_product;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { hasRequiredDelegatedPermissions } = require('../../../auth/permissionUtils');
const authConfig = require('../../../config/authConfig');
const accessUserInfo = require('../../../auth/accessUserInfo');


// Find a single v_order_product with an id
exports.findOne = async (req, res) => {
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.params.id || !req.headers.invcat) {
            res.status(400).send({ message: "Content can not be empty!" })
            return;
        }

        // Auth request (accessUserId)
        try {
            await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // Get datas
        const get_data_one = await v_order_product.findOne({ where: { [Op.and]: { id: req.params.id, inventory_category_path: req.headers.invcat } } })
        if (get_data_one) {
            res.send(get_data_one)
            return;
        }

        // error handle
        res.status(400).send({ message: "No registration" });
        return;
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." });
        return;
    }
};


// Retrieve all v_order_products from the database.
exports.findAll = async (req, res) => {
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.headers.invcat || !req.query.s || !req.query.e) {
            res.status(400).send({ message: "Content can not be empty!" })
            return;
        }

        // Auth request (accessUserId)
        try {
            await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // Get datas
        const dateStart = req.query.s.match(/\d{4}\-\d{2}\-\d{2}/)
        const dateEnd = req.query.e.match(/\d{4}\-\d{2}\-\d{2}/)
        const supplierCode = req.query.supplierCode || null
        const notCompflg = req.query.notCompflg
        const query = { inventory_category_path: req.headers.invcat, deliver_date: { [Op.between]: [dateStart[0], dateEnd[0]] } }
        if (supplierCode) { query["supplier_code"] = supplierCode }
        if (notCompflg === "1") { query["phase"] = { [Op.in]: ["order", "check"] } } else { query["phase"] = { [Op.in]: ["complete"] } }
        const get_data_all = await v_order_product.findAll({ where: { [Op.and]: query }, order: [["order_check_date", "asc"]], limit: 10000 })
        if (get_data_all.length >= 0) {
            res.send(get_data_all)
            return;
        }

        // error handle
        res.status(500).send({ message: "Some error occurred while retrieving." });
        return;
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." });
        return;
    }
}
